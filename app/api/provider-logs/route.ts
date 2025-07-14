import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/prisma/client'

// Validation schema
const providerLogSchema = z.object({
  pan: z.string().min(1, "PAN number is required"),
})

export async function GET(request: NextRequest) {
  try {
    console.log('=== Provider Log API Started ===')
    
    const { searchParams } = new URL(request.url)
    const pan = searchParams.get('pan')
    
    console.log('PAN Number:', pan)

    // Validate input
    const validationResult = providerLogSchema.safeParse({ pan })
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { error: 'Invalid PAN parameter', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    console.log('Validation passed')

    // Fetch provider logs with PAN as entityId
    const providerLogs = await prisma.$queryRaw`
      SELECT 
        id,
        entityId,
        entityType,
        provider,
        type,
        status,
        payload,
        httpStatus,
        response,
        createdAt,
        modifiedAt
      FROM be2ProviderLog 
      WHERE entityId = ${pan}
      ORDER BY createdAt DESC
    `

    console.log('Provider Logs count:', (providerLogs as any[]).length)

    // Transform results
    const logsData = {
      pan: pan,
      providerLogs: (providerLogs as any[]).map((log: any) => ({
        id: log.id?.toString() || 'unknown',
        entityId: log.entityId || pan,
        entityType: log.entityType || 'N/A',
        provider: log.provider || 'N/A',
        type: log.type || 'N/A',
        status: log.status || 'N/A',
        httpStatus: log.httpStatus || 'N/A',
        payload: log.payload ? (log.payload.length > 200 ? log.payload.substring(0, 200) + '...' : log.payload) : 'N/A',
        response: log.response ? (log.response.length > 200 ? log.response.substring(0, 200) + '...' : log.response) : 'N/A',
        fullPayload: log.payload || null,
        fullResponse: log.response || null,
        createdAt: log.createdAt ? new Date(log.createdAt).toISOString() : null,
        modifiedAt: log.modifiedAt ? new Date(log.modifiedAt).toISOString() : null,
      }))
    }

    // Summary statistics
    const statusCounts = logsData.providerLogs.reduce((acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const providerCounts = logsData.providerLogs.reduce((acc, log) => {
      acc[log.provider] = (acc[log.provider] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const httpStatusCounts = logsData.providerLogs.reduce((acc, log) => {
      acc[log.httpStatus] = (acc[log.httpStatus] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const typeCounts = logsData.providerLogs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const result = {
      ...logsData,
      summary: {
        totalLogs: logsData.providerLogs.length,
        uniqueProviders: Object.keys(providerCounts).length,
        uniqueTypes: Object.keys(typeCounts).length,
        successfulRequests: logsData.providerLogs.filter(log => 
          log.httpStatus === '200' || log.status.toLowerCase().includes('success')
        ).length,
        failedRequests: logsData.providerLogs.filter(log => 
          log.httpStatus !== '200' && !log.status.toLowerCase().includes('success')
        ).length,
        statusBreakdown: statusCounts,
        providerBreakdown: providerCounts,
        httpStatusBreakdown: httpStatusCounts,
        typeBreakdown: typeCounts,
        latestLogDate: logsData.providerLogs.length > 0 ? logsData.providerLogs[0].createdAt : null,
        oldestLogDate: logsData.providerLogs.length > 0 ? 
          logsData.providerLogs[logsData.providerLogs.length - 1].createdAt : null
      }
    }

    console.log('Returning provider logs for PAN:', pan)
    console.log('Total logs found:', result.summary.totalLogs)

    return NextResponse.json(result)

  } catch (error) {
    console.error('=== PROVIDER LOG API ERROR ===')
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
function setProviderLogsData(data: Response) {
  throw new Error('Function not implemented.')
}

