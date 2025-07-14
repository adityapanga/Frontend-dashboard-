// types/loan.ts
export interface Loan {
  id: string
  loanNumber: string
  amount: number
  startDate: string
  interestRate: number
  status: 'active' | 'pending' | 'completed' | 'defaulted'
}

export interface CustomerData {
  name: string
  pan: string
  mobile: string
  loans: Loan[]
}

export interface SearchCustomerRequest {
  pan?: string
  mobile?: string
}

export interface SearchCustomerResponse {
  customerData?: CustomerData
  error?: string
  message?: string
}

// types/api.ts
export interface ApiError {
  error: string
  message?: string
  details?: any[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}