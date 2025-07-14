import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/prisma/client'

// Validation schema
const securitiesSchema = z.object({
  loanId: z.string().min(1, "Loan ID is required"),
})

export async function GET(request: NextRequest) {
  try {
    console.log('=== Loan Securities API Started ===')
    
    const { searchParams } = new URL(request.url)
    const loanId = searchParams.get('loanId')
    
    console.log('Loan ID:', loanId)

    // Validate input
    const validationResult = securitiesSchema.safeParse({ loanId })
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { error: 'Invalid loan ID parameter', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    console.log('Validation passed')

    // Fetch CAMS securities with specific columns for operations validation
    const camsSecurities = await prisma.$queryRaw`
      SELECT 
        id,
        scripId,
        loanId,
        accountId,
        attachedQuantity,
        totalQunantity,
        pledgedQuantity,
        isPledge,
        pledgeTimeValue,
        lienMarkNo,
        isActive,
        amcCode,
        folioNumber,
        schemeCode,
        PANNumber,
        lienReferenceNumber,
        currentQuantity,
        lienRefNo,
        nsdlStatus,
        kfinStatus,
        invocationQuantity,
        rtaName,
        isin,
        mfcentralStatus,
        depository_code,
        pledgeTimeLtv,
        pledgeMode,
        creationTime,
        modifiedTime
      FROM tblCAMSLoanScrip 
      WHERE loanId = ${loanId}
    `

    // Fetch regular securities with specific columns for operations validation
    const loanSecurities = await prisma.$queryRaw`
      SELECT 
        id,
        scripId,
        loanId,
        dematAccountId,
        attachedQuantity,
        totalQunantity,
        pledgedQuantity,
        isPledge,
        pledgeTimeValue,
        isActive,
        nsdlStatus,
        accountId,
        lienMarkNo,
        amcCode,
        lienReferenceNumber,
        currentQuantity,
        lienRefNo,
        schemeCode,
        pledgeTimeLtv,
        pledgeMode,
        depositoryCode,
        creationTime,
        modifiedTime
      FROM tblLoanScrip 
      WHERE loanId = ${loanId}
    `

    console.log('CAMS Securities count:', (camsSecurities as any[]).length)
    console.log('Loan Securities count:', (loanSecurities as any[]).length)

    // Fetch BE2 Provider Request data using loanId
    const be2ProviderRequests = await prisma.$queryRaw`
      SELECT * FROM be2ProviderRequest WHERE entityId = ${loanId}
    `

    console.log('BE2 Provider Requests count:', (be2ProviderRequests as any[]).length)

    // Extract unique PAN numbers from CAMS securities for BE2 Provider Log queries
    const panNumbers = Array.from(new Set(
      (camsSecurities as any[])
        .map((security: any) => security.PANNumber)
        .filter((pan: string) => pan && pan !== 'N/A' && pan.trim() !== '')
    ))

    console.log('Unique PAN numbers found:', panNumbers.length, panNumbers)

    // Fetch BE2 Provider Log data for each PAN number
    let be2ProviderLogs: any[] = []
    
    if (panNumbers.length > 0) {
      // Use Promise.all to fetch logs for all PAN numbers concurrently
      const logPromises = panNumbers.map(async (panNumber: string) => {
        const logs = await prisma.$queryRaw`
          SELECT * FROM be2ProviderLog 
          WHERE entityId = ${panNumber} AND type NOT LIKE "%RAW%"
        `
        return logs
      })
      
      const logResults = await Promise.all(logPromises)
      be2ProviderLogs = logResults.flat()
    }

    console.log('BE2 Provider Logs count:', be2ProviderLogs.length)

    // Transform and combine the results
    const securitiesData = {
      loanId: loanId,
      camsSecurities: (camsSecurities as any[]).map((security: any) => ({
        id: security.id?.toString() || 'unknown',
        scripId: security.scripId?.toString() || 'N/A',
        loanId: security.loanId?.toString() || loanId,
        accountId: security.accountId?.toString() || 'N/A',
        attachedQuantity: parseFloat(security.attachedQuantity?.toString() || '0'),
        totalQuantity: parseFloat(security.totalQunantity?.toString() || '0'),
        pledgedQuantity: parseFloat(security.pledgedQuantity?.toString() || '0'),
        isPledge: security.isPledge === 1,
        pledgeTimeValue: parseFloat(security.pledgeTimeValue?.toString() || '0'),
        lienMarkNo: security.lienMarkNo || 'N/A',
        isActive: security.isActive === 1,
        amcCode: security.amcCode || 'N/A',
        folioNumber: security.folioNumber || 'N/A',
        schemeCode: security.schemeCode || 'N/A',
        panNumber: security.PANNumber || 'N/A',
        lienReferenceNumber: security.lienReferenceNumber || 'N/A',
        currentQuantity: parseFloat(security.currentQuantity?.toString() || '0'),
        lienRefNo: security.lienRefNo || 'N/A',
        nsdlStatus: security.nsdlStatus || 'N/A',
        kfinStatus: security.kfinStatus || 'N/A',
        invocationQuantity: parseFloat(security.invocationQuantity?.toString() || '0'),
        rtaName: security.rtaName || 'N/A',
        isin: security.isin || 'N/A',
        mfcentralStatus: security.mfcentralStatus || 'N/A',
        depositoryCode: security.depository_code || 'N/A',
        pledgeTimeLtv: security.pledgeTimeLtv || 'N/A',
        pledgeMode: security.pledgeMode || 'N/A',
        createdAt: security.creationTime ? new Date(security.creationTime).toISOString() : null,
        updatedAt: security.modifiedTime ? new Date(security.modifiedTime).toISOString() : null,
        type: 'CAMS'
      })),
      loanSecurities: (loanSecurities as any[]).map((security: any) => ({
        id: security.id?.toString() || 'unknown',
        scripId: security.scripId?.toString() || 'N/A',
        loanId: security.loanId?.toString() || loanId,
        dematAccountId: security.dematAccountId?.toString() || 'N/A',
        accountId: security.accountId?.toString() || 'N/A',
        attachedQuantity: parseFloat(security.attachedQuantity?.toString() || '0'),
        totalQuantity: parseFloat(security.totalQunantity?.toString() || '0'),
        pledgedQuantity: parseFloat(security.pledgedQuantity?.toString() || '0'),
        isPledge: security.isPledge === 1,
        pledgeTimeValue: parseFloat(security.pledgeTimeValue?.toString() || '0'),
        isActive: security.isActive === 1,
        nsdlStatus: security.nsdlStatus || 'N/A',
        lienMarkNo: security.lienMarkNo || 'N/A',
        amcCode: security.amcCode || 'N/A',
        lienReferenceNumber: security.lienReferenceNumber || 'N/A',
        currentQuantity: parseFloat(security.currentQuantity?.toString() || '0'),
        lienRefNo: security.lienRefNo || 'N/A',
        schemeCode: security.schemeCode || 'N/A',
        pledgeTimeLtv: security.pledgeTimeLtv || 'N/A',
        pledgeMode: security.pledgeMode || 'N/A',
        depositoryCode: security.depositoryCode || 'N/A',
        createdAt: security.creationTime ? new Date(security.creationTime).toISOString() : null,
        updatedAt: security.modifiedTime ? new Date(security.modifiedTime).toISOString() : null,
        type: 'Regular'
      })),
      be2ProviderRequests: (be2ProviderRequests as any[]).map((request: any) => ({
        ...request,
        // Convert any date fields to ISO strings if they exist
        createdAt: request.createdAt ? new Date(request.createdAt).toISOString() : null,
        updatedAt: request.updatedAt ? new Date(request.updatedAt).toISOString() : null,
        requestTime: request.requestTime ? new Date(request.requestTime).toISOString() : null,
        responseTime: request.responseTime ? new Date(request.responseTime).toISOString() : null,
      })),
      be2ProviderLogs: be2ProviderLogs.map((log: any) => ({
        ...log,
        // Convert any date fields to ISO strings if they exist
        createdAt: log.createdAt ? new Date(log.createdAt).toISOString() : null,
        updatedAt: log.updatedAt ? new Date(log.updatedAt).toISOString() : null,
        logTime: log.logTime ? new Date(log.logTime).toISOString() : null,
        timestamp: log.timestamp ? new Date(log.timestamp).toISOString() : null,
      }))
    }

    // Calculate totals based on pledge values
    const totalCamsValue = securitiesData.camsSecurities.reduce((sum, sec) => sum + sec.pledgeTimeValue, 0)
    const totalLoanValue = securitiesData.loanSecurities.reduce((sum, sec) => sum + sec.pledgeTimeValue, 0)
    const totalCamsPledged = securitiesData.camsSecurities.reduce((sum, sec) => sum + sec.pledgedQuantity, 0)
    const totalLoanPledged = securitiesData.loanSecurities.reduce((sum, sec) => sum + sec.pledgedQuantity, 0)

    const result = {
      ...securitiesData,
      summary: {
        totalSecurities: securitiesData.camsSecurities.length + securitiesData.loanSecurities.length,
        totalCamsSecurities: securitiesData.camsSecurities.length,
        totalLoanSecurities: securitiesData.loanSecurities.length,
        totalValue: totalCamsValue + totalLoanValue,
        totalPledgedQuantity: totalCamsPledged + totalLoanPledged,
        totalCamsValue,
        totalLoanValue,
        totalCamsPledged,
        totalLoanPledged,
        activeCamsSecurities: securitiesData.camsSecurities.filter(s => s.isActive).length,
        activeLoanSecurities: securitiesData.loanSecurities.filter(s => s.isActive).length,
        pledgedCamsSecurities: securitiesData.camsSecurities.filter(s => s.isPledge).length,
        pledgedLoanSecurities: securitiesData.loanSecurities.filter(s => s.isPledge).length,
        // Add BE2 provider data summaries
        totalBe2ProviderRequests: securitiesData.be2ProviderRequests.length,
        totalBe2ProviderLogs: securitiesData.be2ProviderLogs.length,
        uniquePanNumbers: panNumbers.length,
        panNumbers: panNumbers
      }
    }

    console.log('Returning securities data for loan:', loanId)
    console.log('Total securities found:', result.summary.totalSecurities)
    console.log('Total BE2 provider requests:', result.summary.totalBe2ProviderRequests)
    console.log('Total BE2 provider logs:', result.summary.totalBe2ProviderLogs)

    return NextResponse.json(result)

  } catch (error) {
    console.error('=== SECURITIES API ERROR ===')
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