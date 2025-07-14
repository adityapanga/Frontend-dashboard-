import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/prisma/client'

// Validation schema
const searchSchema = z.object({
  pan: z.string().optional(),
  mobile: z.string().optional(),
}).refine(
  (data) => data.pan || data.mobile,
  {
    message: "Either PAN or mobile number must be provided",
    path: ["pan", "mobile"],
  }
)

export async function GET(request: NextRequest) {
  try {
    console.log('=== Loan Search API Started ===')
    
    const { searchParams } = new URL(request.url)
    const pan = searchParams.get('pan')
    const mobile = searchParams.get('mobile')
    
    console.log('Search params:', { pan, mobile })

    // Validate input
    const validationResult = searchSchema.safeParse({ pan, mobile })
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.errors)
      return NextResponse.json(
        { error: 'Invalid input parameters', details: validationResult.error.errors },
        { status: 400 }
      )
    }

    console.log('Validation passed')

    let loans: any[] = []

    if (mobile) {
      console.log('Searching by mobile:', mobile)
      
      // Your exact working SQL query for mobile search
      loans = await prisma.$queryRaw`
        SELECT 
          tblLoan.id,
          tblLoan.loanApplicationNumber,
          tblLoan.loanAmountApproved,
          tblLoan.loanAmountDisbursed,
          tblLoan.loanApprovedOn,
          tblLoan.loanDisbursedOn,
          tblLoan.interestRate,
          tblLoan.tenure,
          tblLoan.installmentAmount,
          tblLoan.currentOutstanding,
          tblLoan.maturityDate,
          tblLoan.firstInstallmentDate,
          tblLoan.loanStatus,
          tblLoan.isActive,
          tblLoan.creationTime,
          tblLoan.emi_amount,
          tblClient.clientName,
          tblClient.panFlag,
          tblMobile.phoneNumber
        FROM tblLoan 
        INNER JOIN tblClient ON tblLoan.clientId = tblClient.id 
        INNER JOIN tblPersonMobile ON tblClient.primaryPersonId = tblPersonMobile.personId 
        LEFT JOIN tblMobile ON tblPersonMobile.mobileId = tblMobile.id 
        WHERE tblMobile.phoneNumber = ${mobile}
          AND tblLoan.isActive = 1
        ORDER BY tblLoan.creationTime DESC
      `
      
    } else if (pan) {
      console.log('Searching by PAN:', pan)
      
      // PAN search query
      loans = await prisma.$queryRaw`
        SELECT 
          tblLoan.id,
          tblLoan.loanApplicationNumber,
          tblLoan.loanAmountApproved,
          tblLoan.loanAmountDisbursed,
          tblLoan.loanApprovedOn,
          tblLoan.loanDisbursedOn,
          tblLoan.interestRate,
          tblLoan.tenure,
          tblLoan.installmentAmount,
          tblLoan.currentOutstanding,
          tblLoan.maturityDate,
          tblLoan.firstInstallmentDate,
          tblLoan.loanStatus,
          tblLoan.isActive,
          tblLoan.creationTime,
          tblLoan.emi_amount,
          tblClient.clientName,
          tblClient.panFlag,
          tblMobile.phoneNumber
        FROM tblLoan 
        INNER JOIN tblClient ON tblLoan.clientId = tblClient.id 
        LEFT JOIN tblPersonMobile ON tblClient.primaryPersonId = tblPersonMobile.personId 
        LEFT JOIN tblMobile ON tblPersonMobile.mobileId = tblMobile.id 
        WHERE tblClient.panFlag = ${pan}
          AND tblLoan.isActive = 1
        ORDER BY tblLoan.creationTime DESC
      `
    }

    console.log('Raw query result count:', loans.length)

    if (loans.length === 0) {
      console.log('No loans found')
      return NextResponse.json(
        { 
          error: 'No active loans found for the provided details',
          customerData: null
        },
        { status: 404 }
      )
    }

    // Get client info from the first loan
    const firstLoan = loans[0]
    console.log('First loan client:', firstLoan.clientName)

    // Helper function to convert loan status number to string
    const getLoanStatusString = (status: number) => {
      switch (status) {
        case 1:
          return 'pending'
        case 2:
          return 'active'
        case 3:
          return 'completed'
        case 4:
          return 'defaulted'
        default:
          return 'active'
      }
    }

    // Transform the result to match your expected format
    const customerData = {
      name: firstLoan.clientName || 'Unknown',
      pan: firstLoan.panFlag || pan || 'N/A',
      mobile: firstLoan.phoneNumber || mobile || 'N/A',
      loans: loans.map((loan: any) => ({
        id: loan.id?.toString() || 'unknown',
        loanNumber: loan.loanApplicationNumber || 'N/A',
        amount: parseFloat(loan.loanAmountApproved?.toString() || loan.loanAmountDisbursed?.toString() || '0'),
        startDate: loan.loanDisbursedOn ? new Date(loan.loanDisbursedOn).toISOString() : 
                   (loan.loanApprovedOn ? new Date(loan.loanApprovedOn).toISOString() : new Date().toISOString()),
        interestRate: parseFloat(loan.interestRate?.toString() || '0'),
        status: getLoanStatusString(loan.loanStatus) as 'active' | 'pending' | 'completed' | 'defaulted',
        creationTime: loan.creationTime ? new Date(loan.creationTime).toISOString() : undefined,
        tenure: loan.tenure || null,
        emi: parseFloat(loan.emi_amount?.toString() || loan.installmentAmount?.toString() || '0'),
        outstandingAmount: parseFloat(loan.currentOutstanding?.toString() || '0'),
        maturityDate: loan.maturityDate ? new Date(loan.maturityDate).toISOString() : null,
        firstInstallmentDate: loan.firstInstallmentDate ? new Date(loan.firstInstallmentDate).toISOString() : null,
        disbursedAmount: parseFloat(loan.loanAmountDisbursed?.toString() || '0'),
        approvedAmount: parseFloat(loan.loanAmountApproved?.toString() || '0'),
      }))
    }

    console.log('Returning customer data:', {
      name: customerData.name,
      loanCount: customerData.loans.length,
      totalAmount: customerData.loans.reduce((sum, loan) => sum + loan.amount, 0)
    })

    return NextResponse.json(customerData)

  } catch (error) {
    console.error('=== API ERROR ===')
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