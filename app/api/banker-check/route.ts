import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/prisma/client'

// Validation schema
const bankerCheckSchema = z.object({
  loanId: z.string().min(1, "Loan ID is required"),
})

export async function GET(request: NextRequest) {
  try {
    console.log('=== Banker Check API Started ===')
    
    const { searchParams } = new URL(request.url)
    const loanId = searchParams.get('loanId')
    
    console.log('Loan ID:', loanId)

    // Validate input
    const validationResult = bankerCheckSchema.safeParse({ loanId })
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { error: 'Invalid loan ID parameter', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    console.log('Validation passed')

    // Run the simplified query as requested
    const bankerCheckData = await prisma.$queryRaw`
      SELECT 
        tblBankerCheck.severity,
        tblBankerCheck.id,
        tblPerson.id as personId,
        tblPersonLocation.addressLine1,
        tblPersonEmail.emailId,
        tblLoan.clientId,
        tblPersonLocation.locationType,
        tblLoan.securityType
      FROM tblLoan
      JOIN tblPerson ON tblPerson.clientId = tblLoan.clientId
      LEFT JOIN tblPersonLocation ON tblPersonLocation.personId = tblPerson.id
      LEFT JOIN tblPersonEmail ON tblPersonEmail.personId = tblPerson.id
      LEFT JOIN tblBankerCheck ON tblBankerCheck.loanId = tblLoan.id
      WHERE tblLoan.id = ${loanId}
    `

    console.log('Query executed successfully')
    console.log('Result count:', (bankerCheckData as any[]).length)

    // Transform the results to a more usable format
    const transformedData = (bankerCheckData as any[]).map((row: any) => ({
      bankerCheck: {
        severity: row.severity || null,
        id: row.id?.toString() || null,
      },
      person: {
        id: row.personId?.toString() || null,
      },
      location: {
        addressLine1: row.addressLine1 || null,
        locationType: row.locationType || null,
      },
      email: {
        emailId: row.emailId || null,
      },
      loan: {
        clientId: row.clientId?.toString() || null,
        securityType: row.securityType || null,
      }
    }))

    // Group data to match original API structure
    const personsMap = new Map()
    const bankerChecksMap = new Map()
    
    transformedData.forEach(item => {
      // Group persons
      if (item.person.id) {
        if (!personsMap.has(item.person.id)) {
          personsMap.set(item.person.id, {
            id: item.person.id,
            clientId: item.loan.clientId,
            locations: [],
            emails: []
          })
        }
        
        const person = personsMap.get(item.person.id)
        
        // Add unique locations
        if (item.location.addressLine1) {
          const locationExists = person.locations.some((loc: any) => 
            loc.addressLine1 === item.location.addressLine1 && 
            loc.locationType === item.location.locationType
          )
          if (!locationExists) {
            person.locations.push(item.location)
          }
        }
        
        // Add unique emails
        if (item.email.emailId) {
          const emailExists = person.emails.some((email: any) => 
            email.emailId === item.email.emailId
          )
          if (!emailExists) {
            person.emails.push(item.email)
          }
        }
      }
      
      // Group banker checks (only if they exist)
      if (item.bankerCheck.id) {
        if (!bankerChecksMap.has(item.bankerCheck.id)) {
          bankerChecksMap.set(item.bankerCheck.id, item.bankerCheck)
        }
      }
    })

    // Convert to arrays
    const persons = Array.from(personsMap.values())
    const bankerChecks = Array.from(bankerChecksMap.values())

    // Create summary statistics
    const summary = {
      totalRecords: transformedData.length,
      totalPersons: persons.length,
      totalBankerChecks: bankerChecks.length,
      totalLocations: persons.reduce((sum, person) => sum + person.locations.length, 0),
      totalEmails: persons.reduce((sum, person) => sum + person.emails.length, 0),
      activeBankerChecks: bankerChecks.filter(check => check.severity !== null).length,
      severityBreakdown: {} as any,
      securityTypeBreakdown: {} as any,
      locationTypeBreakdown: {} as any,
    }

    // Calculate breakdowns
    bankerChecks.forEach(check => {
      const severity = check.severity || 'Unknown'
      summary.severityBreakdown[severity] = (summary.severityBreakdown[severity] || 0) + 1
    })

    transformedData.forEach(item => {
      // Security type breakdown
      const securityType = item.loan.securityType || 'Unknown'
      summary.securityTypeBreakdown[securityType] = (summary.securityTypeBreakdown[securityType] || 0) + 1

      // Location type breakdown
      if (item.location.locationType) {
        const locationType = item.location.locationType || 'Unknown'
        summary.locationTypeBreakdown[locationType] = (summary.locationTypeBreakdown[locationType] || 0) + 1
      }
    })

    const result = {
      loanId: loanId,
      persons: persons,
      bankerChecks: bankerChecks,
      data: transformedData,
      summary
    }

    console.log('Returning simplified banker check data for loan:', loanId)
    console.log('Total records found:', result.summary.totalRecords)
    console.log('Total persons found:', result.summary.totalPersons)
    console.log('Total banker checks found:', result.summary.totalBankerChecks)
    console.log('Total locations found:', result.summary.totalLocations)
    console.log('Total emails found:', result.summary.totalEmails)

    return NextResponse.json(result)

  } catch (error) {
    console.error('=== BANKER CHECK API ERROR ===')
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