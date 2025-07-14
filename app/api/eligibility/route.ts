import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/prisma/client'
import { Prisma } from '@prisma/client'

// Validation schema
const eligibilitySchema = z.object({
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  provider: z.enum(['AA', 'MFC']).optional(),
}).refine(
  (data) => data.mobile,
  {
    message: "Mobile number is required",
    path: ["mobile"],
  }
)

interface EligibilityLead {
  id: number
}

interface LatestProviderRequest {
  id: number
  requestId: string
  createdAt: Date
  provider: string
}

interface EligibilitySecurities {
  id: number
  requestId: string
  securityType: string
  securityValue: number
  eligibleAmount: number
  loanToValue: number
  remarks: string | null
  createdAt: Date
  updatedAt: Date
}

interface EligibilityData {
  provider: string
  requestId: string
  requestDate: string
  securities: EligibilitySecurities[]
  totalEligibleAmount: number
  totalSecurityValue: number
}

export async function GET(request: NextRequest) {
  try {
    console.log('=== Eligibility API Started ===')
    
    const { searchParams } = new URL(request.url)
    const mobile = searchParams.get('mobile')
    const provider = searchParams.get('provider') as 'AA' | 'MFC' | null
    
    console.log('Search params:', { mobile, provider })

    // Validate input
    const validationResult = eligibilitySchema.safeParse({ mobile, provider })
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { error: 'Invalid input parameters', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    console.log('Validation passed')

    // Function to get eligibility data for a specific provider
    const getEligibilityForProvider = async (providerName: 'AA' | 'MFC'): Promise<EligibilityData | null> => {
      try {
        console.log(`Getting eligibility for provider: ${providerName}`)
        
        // Get eligible leads for the mobile number
        const eligibleLeads: EligibilityLead[] = await prisma.$queryRaw`
          SELECT id FROM be2CheckEligibilityLeads WHERE mobileNumber = ${mobile}
        `
        
        console.log(`Found ${eligibleLeads.length} eligible leads for mobile: ${mobile}`)
        
        if (eligibleLeads.length === 0) {
          console.log(`No eligible leads found for mobile: ${mobile}`)
          return null
        }
        
        const leadIds = eligibleLeads.map(lead => lead.id)
        
        // Get latest provider request
        const latestRequest: LatestProviderRequest[] = await prisma.$queryRaw`
          SELECT id, createdAt, provider
          FROM be2ProviderRequest 
          WHERE entityType = 'LEAD' 
            AND requestType = 'ELIGIBILITY' 
            AND state = 'DATA_FETCHED' 
            AND entityId IN (${Prisma.join(leadIds)})
          ORDER BY createdAt DESC 
          LIMIT 1
        `
        
        console.log(`Latest request for ${providerName}:`, latestRequest)
        
        if (latestRequest.length === 0) {
          console.log(`No eligibility requests found for provider: ${providerName}`)
          return null
        }
        
        const request = latestRequest[0]
        
        // Get securities for this request
        const securities: EligibilitySecurities[] = await prisma.$queryRaw`
          SELECT * FROM be2CheckEligibilitySecurities WHERE requestId = ${request.id.toString()}
        `
        
        console.log(`Found ${securities.length} securities for request: ${request.id}`)
        
        // Calculate totals
        const totalEligibleAmount = securities.reduce((sum, security) => sum + (security.eligibleAmount || 0), 0)
        const totalSecurityValue = securities.reduce((sum, security) => sum + (security.securityValue || 0), 0)
        
        return {
          provider: providerName,
          requestId: request.id.toString(),
          requestDate: request.createdAt.toISOString(),
          securities: securities.map(security => ({
            ...security,
            createdAt: security.createdAt,
            updatedAt: security.updatedAt
          })),
          totalEligibleAmount,
          totalSecurityValue
        }
        
      } catch (error) {
        console.error(`Error getting eligibility for provider ${providerName}:`, error)
        return null
      }
    }

    let eligibilityData: { AA?: EligibilityData | null, MFC?: EligibilityData | null } = {}

    if (provider) {
      // Get data for specific provider
      const data = await getEligibilityForProvider(provider)
      eligibilityData[provider] = data
    } else {
      // Get data for both providers
      const [aaData, mfcData] = await Promise.all([
        getEligibilityForProvider('AA'),
        getEligibilityForProvider('MFC')
      ])
      
      eligibilityData = {
        AA: aaData,
        MFC: mfcData
      }
    }

    console.log('Eligibility data retrieved:', {
      AA: eligibilityData.AA ? 'Found' : 'Not found',
      MFC: eligibilityData.MFC ? 'Found' : 'Not found'
    })

    // Check if any data was found
    const hasData = Object.values(eligibilityData).some(data => data !== null && data !== undefined)
    
    if (!hasData) {
      console.log('No eligibility data found for any provider')
      return NextResponse.json(
        { 
          error: 'No eligibility data found',
          message: 'No eligibility requests found for the provided mobile number',
          eligibilityData: eligibilityData
        },
        { status: 404 }
      )
    }

    // Prepare response with summary
    const response = {
      mobile,
      eligibilityData,
      summary: {
        totalProviders: Object.keys(eligibilityData).length,
        availableProviders: Object.entries(eligibilityData)
          .filter(([_, data]) => data !== null)
          .map(([provider, _]) => provider),
        missingProviders: Object.entries(eligibilityData)
          .filter(([_, data]) => data === null)
          .map(([provider, _]) => provider),
        totalEligibleAmount: Object.values(eligibilityData)
          .filter(data => data !== null)
          .reduce((sum, data) => sum + (data?.totalEligibleAmount || 0), 0),
        totalSecurityValue: Object.values(eligibilityData)
          .filter(data => data !== null)
          .reduce((sum, data) => sum + (data?.totalSecurityValue || 0), 0)
      }
    }

    console.log('Returning eligibility response:', {
      mobile: response.mobile,
      availableProviders: response.summary.availableProviders,
      missingProviders: response.summary.missingProviders,
      totalEligibleAmount: response.summary.totalEligibleAmount
    })

    return NextResponse.json(response)

  } catch (error) {
    console.error('=== ELIGIBILITY API ERROR ===')
    console.error('Error details:', error)
    console.error('Error stack:', (error as Error).stack)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      },
      { status: 500 }
    )
  }
}