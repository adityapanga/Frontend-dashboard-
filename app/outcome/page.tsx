'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield,
  AlertTriangle,
  Info,
  ArrowLeft, 
  Search,
  User,
  Phone,
  CreditCard,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Download,
  DollarSign,
  FileText,
  BarChart3,
  History,
  Target,
  Activity
} from 'lucide-react'
interface SecurityValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// === UPDATED INTERFACES ===
export interface BankerCheckDetail {
  id: string
  loanId: string
  severity: string
  status: string
  checkType: string
  remarks: string
  checkDate: string | null
  checkedBy: string
  approvedBy: string
  rejectedBy: string
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null
}

export interface PersonLocation {
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  country: string
  locationType: string
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null
}

export interface PersonEmail {
  emailId: string
  emailType: string
  isPrimary: boolean
  isActive: boolean
  createdAt: string | null
  updatedAt: string | null
}

export interface Person {
  id: string
  clientId: string
  firstName: string
  lastName: string
  middleName: string
  fullName: string
  dateOfBirth: string | null
  gender: string
  panNumber: string
  aadharNumber: string
  createdAt: string | null
  updatedAt: string | null
  locations: PersonLocation[]
  emails: PersonEmail[]
}

export interface LoanInfo {
  loanId: string
  clientId: string
  securityType: string
  loanAmount: number
  interestRate: number
  loanStatus: string
  sanctionedAmount: number
  disbursedAmount: number
  outstandingAmount: number
  createdAt: string | null
  updatedAt: string | null
}

export interface BankerCheck {
  id: string
  loanId: string
  severity: string
  status: string
  checkType: string
  remarks: string
  createdAt: string | null
  updatedAt: string | null
}

export interface BankerCheckSummary {
  totalPersons: number
  totalBankerChecks: number
  totalLocations: number
  totalEmails: number
  activeBankerChecks: number
  severityBreakdown: Record<string, number>
  statusBreakdown: Record<string, number>
  checkTypeBreakdown: Record<string, number>
  loanAmount: number
  outstandingAmount: number
  securityType: string
}

export interface BankerCheckResponse {
  loanId: string
  loanInfo: LoanInfo
  persons: Person[]
  bankerChecks: BankerCheck[]
  bankerCheckDetails: BankerCheckDetail[]
  summary: BankerCheckSummary
}

// Keep your existing ProviderLog interface (it's good as is)
export interface ProviderLog {
  logTime: any
  id: string
  entityId: string
  entityType: string
  provider: string
  type: string
  status: string
  httpStatus: string
  payload: string // Truncated for display
  response: string // Truncated for display
  fullPayload: any // Full payload object
  fullResponse: any // Full response object
  createdAt: string | null
  updatedAt: string | null
}

// Keep your existing ProviderLogSummary interface (it's comprehensive)
export interface ProviderLogSummary {
  totalLogs: number
  uniqueProviders: number
  uniqueTypes: number
  successfulRequests: number
  failedRequests: number
  statusBreakdown: Record<string, number>
  providerBreakdown: Record<string, number>
  httpStatusBreakdown: Record<string, number>
  typeBreakdown: Record<string, number>
  latestLogDate: string | null
  oldestLogDate: string | null
}

// ADD NEW: BE2 Provider Request Interface
export interface Be2ProviderRequest {
  id: string
  entityId: string
  status: string
  requestTime: string | null
  responseTime: string | null
  createdAt: string | null
  updatedAt: string | null
  // Add other fields as they exist in your database
  [key: string]: any // For any additional fields
}

// UPDATE: Your existing Security interface (keep as is, it's comprehensive)
export interface Security {
  id: string
  scripId: string
  loanId: string
  accountId?: string
  dematAccountId?: string
  attachedQuantity: number
  totalQuantity: number
  pledgedQuantity: number
  isPledge: boolean
  pledgeTimeValue: number
  lienMarkNo: string
  isActive: boolean
  amcCode?: string
  folioNumber?: string
  schemeCode?: string
  panNumber?: string
  lienReferenceNumber: string
  currentQuantity: number
  lienRefNo: string
  nsdlStatus: string
  kfinStatus?: string
  invocationQuantity?: number
  rtaName?: string
  isin?: string
  mfcentralStatus?: string
  depositoryCode: string
  pledgeTimeLtv: string
  pledgeMode: string
  createdAt: string | null
  updatedAt: string | null
  type: 'CAMS' | 'Regular'
}

// UPDATE: Extend your existing SecuritiesSummary to include BE2 data
export interface SecuritiesSummary {
  totalSecurities: number
  totalCamsSecurities: number
  totalLoanSecurities: number
  totalValue: number
  totalPledgedQuantity: number
  totalCamsValue: number
  totalLoanValue: number
  totalCamsPledged: number
  totalLoanPledged: number
  activeCamsSecurities: number
  activeLoanSecurities: number
  pledgedCamsSecurities: number
  pledgedLoanSecurities: number
  // ADD THESE NEW FIELDS:
  totalBe2ProviderRequests: number
  totalBe2ProviderLogs: number
  uniquePanNumbers: number
  panNumbers: string[]
}

// UPDATE: Your existing EligibilityResponse to include BE2 data
export interface EligibilityResponse {
  loanId: string
  camsSecurities: Security[]
  loanSecurities: Security[]
  // ADD THESE NEW FIELDS:
  be2ProviderRequests: Be2ProviderRequest[]
  be2ProviderLogs: ProviderLog[]
  summary: SecuritiesSummary
}

// REPLACE: Your existing EligibilityData interface with this updated one
export interface EligibilityData {
  loanId: string
  camsSecurities: Security[]
  loanSecurities: Security[]
  be2ProviderRequests: Be2ProviderRequest[]
  be2ProviderLogs: ProviderLog[]
  summary: {
    totalSecurities: number
    totalCamsSecurities: number
    totalLoanSecurities: number
    totalValue: number
    totalPledgedQuantity: number
    totalCamsValue: number
    totalLoanValue: number
    totalCamsPledged: number
    totalLoanPledged: number
    activeCamsSecurities: number
    activeLoanSecurities: number
    pledgedCamsSecurities: number
    pledgedLoanSecurities: number
    totalBe2ProviderRequests: number
    totalBe2ProviderLogs: number
    uniquePanNumbers: number
    panNumbers: string[]
    // Keep any other fields you need from your existing validation
    totalLienMarkedCAMS?: number
    totalLienMarkedScrips?: number
    totalApprovedSecurities?: number
    validationStatus?: string
  }
}

// Keep your existing interfaces unchanged
export interface ProviderLogResponse {
  loanId: string
  providerLogs: ProviderLog[]
  summary: ProviderLogSummary
}

interface Loan {
  id: string
  loanNumber: string
  amount: number
  startDate: string
  interestRate: number
  status: 'active' | 'pending' | 'completed' | 'defaulted'
  emi?: number
  outstandingAmount?: number
  tenure?: number
  creationTime?: string
}

interface CustomerData {
  name: string
  pan: string
  mobile: string
  loans: Loan[]
}

// REMOVE: The SecurityItem interface (redundant with Security)
// REMOVE: The old EligibilityData interface (replaced above)



export default function Outcome() {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [eligibilityData, setEligibilityData] = useState<EligibilityData | null>(null)
  const [eligibilityLoading, setEligibilityLoading] = useState(false)
  const [eligibilityError, setEligibilityError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('summary')

  const router = useRouter()
  const searchParams = useSearchParams()
  

  const [bankerCheckData, setBankerCheckData] = useState<BankerCheckResponse | null>(null)
  const [bankerCheckLoading, setBankerCheckLoading] = useState(false)
  const [bankerCheckError, setBankerCheckError] = useState<string | null>(null)


  const pan = searchParams.get('pan')
  const mobile = searchParams.get('mobile')

  const [providerLogsData, setProviderLogsData] = useState<ProviderLogResponse | null>(null)
  const [providerLogsLoading, setProviderLogsLoading] = useState(false)
  const [providerLogsError, setProviderLogsError] = useState<string | null>(null)

  const [repaymentData, setRepaymentData] = useState<ProviderLogResponse | null>(null)
  const [loadingRepayment, setLoadingRepayment] = useState(false)
  
  const fetchProviderLogs = async (loanId: string) => {
  setProviderLogsLoading(true)
  setProviderLogsError(null)  // <- ADD THIS
  try {
    if (!customerData) {
      throw new Error('Customer data not loaded')
    }
    const response = await fetch(`/api/provider-logs?pan=${customerData.pan}`)

    if (!response.ok) {
      throw new Error('Failed to fetch provider logs')
    }
    const data = await response.json()
    setProviderLogsData(data)
  } catch (error) {
    console.error('Error fetching provider logs:', error)
    setProviderLogsError(error instanceof Error ? error.message : 'Failed to load provider logs')  // <- ADD THIS
  } finally {
    setProviderLogsLoading(false)
  }
}

const fetchBankerCheckData = async (loanId: string) => {
  setBankerCheckLoading(true)
  setBankerCheckError(null)
  try {
    const response = await fetch(`/api/banker-check?loanId=${loanId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch banker check data')
    }
    
    const data = await response.json()
    setBankerCheckData(data)
  } catch (error) {
    console.error('Error fetching banker check data:', error)
    setBankerCheckError(error instanceof Error ? error.message : 'Failed to load banker check data')
  } finally {
    setBankerCheckLoading(false)
  }
}

// Add this useEffect to handle tab changes
useEffect(() => {
  if (activeTab === 'transactions' && selectedLoan?.id && !bankerCheckData) {
    fetchBankerCheckData(selectedLoan.id)
  }
}, [activeTab, selectedLoan?.id])


const handleRepaymentClick = () => {
  if (!providerLogsData && selectedLoan?.id) {  // <- UPDATE VARIABLE NAME
    fetchProviderLogs(selectedLoan.id)
  }
}

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const queryParams = new URLSearchParams()
        if (pan) queryParams.append('pan', pan)
        if (mobile) queryParams.append('mobile', mobile)
        
        const response = await fetch(`/api/search-customer?${queryParams.toString()}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch customer data')
        }
        
        const data = await response.json()
        setCustomerData(data)
        
        if (data.loans.length > 0) {
          setSelectedLoan(data.loans[0])
        }
        
      } catch (error) {
        console.error('Error fetching customer data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load customer data')
      } finally {
        setIsLoading(false)
      }
    }

    if (pan || mobile) {
      fetchCustomerData()
    } else {
      setError('No search parameters provided')
      setIsLoading(false)
    }
  }, [pan, mobile])


  useEffect(() => {
  if (activeTab === 'eligibility' && selectedLoan) {
    fetchEligibilityData(selectedLoan.id)
  }
}, [selectedLoan])


    // Reset eligibility data when selectedLoan changes
  useEffect(() => {
    if (selectedLoan?.id) {
      setEligibilityData(null)
    }
  }, [selectedLoan?.id])

  // Auto-fetch eligibility if eligibility tab is active and loan changes
  useEffect(() => {
    if (selectedLoan?.id && activeTab === 'eligibility') {
      console.log('Selected loan changed, refetching eligibility...')
      fetchEligibilityData(selectedLoan.id)
    }
  }, [selectedLoan?.id, activeTab])

  // Add this improved version of fetchEligibilityData with better debugging

const fetchEligibilityData = async (loanId: string) => {
  try {
    setEligibilityLoading(true)
    setEligibilityError(null)
    
    // Debug logging
    console.log('Fetching eligibility data for loan ID:', loanId)
    console.log('Selected loan object:', selectedLoan)
    
    const response = await fetch(`/api/validate?loanId=${loanId}`)
    
    console.log('API Response status:', response.status)
    console.log('API Response headers:', response.headers)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Error Response:', errorData)
      throw new Error(errorData.error || 'Failed to fetch eligibility data')
    }
    
    const data = await response.json()
    console.log('API Success Response:', data)
    
    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from API')
    }
    
    // Check if summary data exists and has valid numbers
    if (data.summary) {
      console.log('Summary data:', data.summary)
      
      // Fix NaN values
      const summary = {
        ...data.summary,
        totalLienMarkedCAMS: data.summary.totalLienMarkedCAMS || 0,
        totalLienMarkedScrips: data.summary.totalLienMarkedScrips || 0,
        totalApprovedSecurities: data.summary.totalApprovedSecurities || 0,
        totalValue: data.summary.totalValue || 0
      }
      
      data.summary = summary
    }
    
    setEligibilityData(data)
    
  } catch (error) {
    console.error('Error fetching eligibility data:', error)
    console.error('Error details:', {
      loanId,
      selectedLoan,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    setEligibilityError(error instanceof Error ? error.message : 'Failed to load eligibility data')
  } finally {
    setEligibilityLoading(false)
  }
}

// Improved handleTabChange with better async handling
const handleTabChange = async (value: string) => {
  if (value === 'eligibility' && selectedLoan && !eligibilityData) {
    console.log('Tab changed to eligibility, fetching data...')
    await fetchEligibilityData(selectedLoan.id)
  }
}

// Also add this debugging component to display current state
const DebugInfo = () => {
  if (process.env.NODE_ENV !== 'development') return null
  
  return (
    <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono mb-4">
      <div><strong>Selected Loan ID:</strong> {selectedLoan?.id || 'None'}</div>
      <div><strong>Selected Loan Number:</strong> {selectedLoan?.loanNumber || 'None'}</div>
      <div><strong>Eligibility Data Loaded:</strong> {eligibilityData ? 'Yes' : 'No'}</div>
      <div><strong>Eligibility Loading:</strong> {eligibilityLoading ? 'Yes' : 'No'}</div>
      <div><strong>Eligibility Error:</strong> {eligibilityError || 'None'}</div>
    </div>
  )
}

  const filteredLoans = useMemo(() => {
    if (!customerData?.loans) return []
    
    return customerData.loans.filter(loan => {
      const matchesSearch = loan.loanNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || loan.status === statusFilter
      return matchesSearch && matchesStatus
    }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  }, [customerData?.loans, searchTerm, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'defaulted': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="w-3 h-3 text-green-600" />
      case 'pending': return <Clock className="w-3 h-3 text-orange-600" />
      case 'completed': return <Target className="w-3 h-3 text-blue-600" />
      case 'defaulted': return <AlertCircle className="w-3 h-3 text-red-600" />
      default: return <div className="w-2 h-2 bg-gray-400 rounded-full" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600"></div>
      </div>
    )
  }

  if (error || !customerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-6">{error || 'No data found'}</p>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => router.push('/dashboard')} 
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Search
            </Button>
            
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">{customerData.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  PAN: {customerData.pan}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Mobile: {customerData.mobile}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Total Loans</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-lg px-3 py-1 border border-blue-200">
              {customerData.loans.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Loans List */}
          <div className="col-span-4">
            <Card className="h-fit shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg text-gray-900">Loans Granted</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search loans..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="defaulted">Defaulted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Loans List */}
                <div className="space-y-3">
                  {filteredLoans.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No loans found</p>
                    </div>
                  ) : (
                    filteredLoans.map((loan) => (
                      <div
                        key={loan.id}
                        onClick={() => setSelectedLoan(loan)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                          selectedLoan?.id === loan.id 
                            ? 'border-blue-400 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 text-sm">
                            {loan.loanNumber}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(loan.status)} text-xs flex items-center gap-1`}
                          >
                            {getStatusIcon(loan.status)}
                            {loan.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-lg font-semibold text-blue-600">
                            {formatCurrency(loan.amount)}
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Start: {formatDate(loan.startDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Rate: {loan.interestRate}% p.a.
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loan Details */}
          <div className="col-span-8">
            {selectedLoan ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Loan Details - {selectedLoan.loanNumber}
                    </h2>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <p className="text-gray-600 text-sm">Comprehensive loan information and analytics</p>

                <Tabs defaultValue="summary" onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-100">
                    <TabsTrigger value="summary" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
                      <FileText className="w-4 h-4" />
                      Loan Summary
                    </TabsTrigger>
                    <TabsTrigger value="eligibility" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
                      <CheckCircle2 className="w-4 h-4" />
                      Securities
                    </TabsTrigger>
                    <TabsTrigger value="repayment" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600" onClick={handleRepaymentClick}>
                      <Calendar className="w-4 h-4" />
                      CKYC
                    </TabsTrigger>
                    <TabsTrigger value="transactions" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
                      <BarChart3 className="w-4 h-4" />
                      Banker Check
                    </TabsTrigger>
                    <TabsTrigger value="collateral" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-600">
                      <Target className="w-4 h-4" />
                      Collateral
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="mt-0">
                    <Card className="shadow-sm border-gray-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                            <CardTitle className="text-gray-900">Loan Overview</CardTitle>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${getStatusColor(selectedLoan.status)} flex items-center gap-2`}
                          >
                            {getStatusIcon(selectedLoan.status)}
                            {selectedLoan.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Main Loan Info */}
                        <div className="grid grid-cols-4 gap-6 mb-8">
                          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
                            <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedLoan.amount)}</p>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-gray-600 mb-1">Outstanding</p>
                            <p className="text-2xl font-bold text-red-600">
                              {selectedLoan.outstandingAmount ? formatCurrency(selectedLoan.outstandingAmount) : '₹3,75,000'}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
                            <p className="text-2xl font-bold text-green-600">{selectedLoan.interestRate}%</p>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <div className="flex items-center justify-center gap-1">
                              {getStatusIcon(selectedLoan.status)}
                              <p className="text-lg font-semibold text-gray-700">{selectedLoan.status}</p>
                            </div>
                          </div>
                        </div>

                        {/* Loan Progress */}
                        <div className="mb-8">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Loan Progress</h3>
                            <span className="text-sm text-gray-500">Completed: 15 months | Remaining: 45 months</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '25%'}}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Start: {formatDate(selectedLoan.startDate)}</span>
                            <span>End: 15/1/2025</span>
                          </div>
                        </div>

                        {/* Next Payment & Payment Summary */}
                        <div className="grid grid-cols-2 gap-6">
                          <Card className="border-gray-200">
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <CardTitle className="text-base">Next Payment</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Due Date:</span>
                                <span className="font-medium">15/1/2024</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Amount:</span>
                                <span className="font-bold text-green-600">₹25,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Days Remaining:</span>
                                <span className="font-medium text-orange-600">12 days</span>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border-gray-200">
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-600" />
                                <CardTitle className="text-base">Payment Summary</CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Paid:</span>
                                <span className="font-bold text-green-600">₹1,25,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Principal Paid:</span>
                                <span className="font-medium">₹1,00,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Interest Paid:</span>
                                <span className="font-medium">₹25,000</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="eligibility" className="mt-0">
  {eligibilityData ? (
    <div className="space-y-8">
      {/* --- Summary Cards --- */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Total Securities</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-gray-800">
            {eligibilityData.summary.totalSecurities}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Total Value</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-blue-600">
            ₹ {formatCurrency(eligibilityData.summary.totalValue)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Total CAMS Pledged</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-green-600">
            {eligibilityData.summary.totalCamsPledged}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">Total Loan Pledged</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-green-600">
            {eligibilityData.summary.totalLoanPledged}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">BE2 Requests</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-purple-600">
            {eligibilityData.summary.totalBe2ProviderRequests}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-500">BE2 Logs</CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-bold text-orange-600">
            {eligibilityData.summary.totalBe2ProviderLogs}
          </CardContent>
        </Card>
      </div>

      {/* --- CAMS Securities Table --- */}
      <div>
        <h3 className="text-lg font-semibold text-blue-700 mb-2">CAMS Securities</h3>
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm table-auto border-collapse">
            <thead className="bg-blue-50 border-b">
              <tr>
                <th className="p-2 text-left">ISIN</th>
                <th className="p-2 text-left">Scrip ID</th>
                <th className="p-2 text-left">Pledged Qty</th>
                <th className="p-2 text-left">Pledge Value</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {eligibilityData.camsSecurities.map(sec => (
                <tr key={sec.id} className="border-t hover:bg-blue-50">
                  <td className="p-2">{sec.isin}</td>
                  <td className="p-2">{sec.scripId}</td>
                  <td className="p-2">{sec.pledgedQuantity}</td>
                  <td className="p-2">₹ {formatCurrency(sec.pledgeTimeValue)}</td>
                  <td className="p-2">
                    <Badge variant={sec.isActive ? "default" : "outline"}>
                      {sec.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Regular Loan Securities Table --- */}
      <div>
        <h3 className="text-lg font-semibold text-green-700 mb-2">Loan Scrips</h3>
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm table-auto border-collapse">
            <thead className="bg-green-50 border-b">
              <tr>
                <th className="p-2 text-left">Scrip ID</th>
                <th className="p-2 text-left">Pledged Qty</th>
                <th className="p-2 text-left">Pledge Value</th>
                <th className="p-2 text-left">Depository</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {eligibilityData.loanSecurities.map(sec => (
                <tr key={sec.id} className="border-t hover:bg-green-50">
                  <td className="p-2">{sec.scripId}</td>
                  <td className="p-2">{sec.pledgedQuantity}</td>
                  <td className="p-2">₹ {formatCurrency(sec.pledgeTimeValue)}</td>
                  <td className="p-2">{sec.depositoryCode}</td>
                  <td className="p-2">
                    <Badge variant={sec.isActive ? "default" : "outline"}>
                      {sec.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- BE2 Provider Requests Table --- */}
      {eligibilityData.be2ProviderRequests && eligibilityData.be2ProviderRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-purple-700 mb-2">BE2 Provider Requests</h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm table-auto border-collapse">
              <thead className="bg-purple-50 border-b">
                <tr>
                  <th className="p-2 text-left">Request ID</th>
                  <th className="p-2 text-left">Entity ID</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Request Time</th>
                  <th className="p-2 text-left">Response Time</th>
                </tr>
              </thead>
              <tbody>
                {eligibilityData.be2ProviderRequests.map((request, index) => (
                  <tr key={request.id || index} className="border-t hover:bg-purple-50">
                    <td className="p-2">{request.id || 'N/A'}</td>
                    <td className="p-2">{request.entityId || 'N/A'}</td>
                    <td className="p-2">
                      <Badge variant={request.status === 'SUCCESS' ? "default" : "outline"}>
                        {request.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      {request.requestTime ? new Date(request.requestTime).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-2">
                      {request.responseTime ? new Date(request.responseTime).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- BE2 Provider Logs Table --- */}
      {eligibilityData.be2ProviderLogs && eligibilityData.be2ProviderLogs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-orange-700 mb-2">BE2 Provider Logs</h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm table-auto border-collapse">
              <thead className="bg-orange-50 border-b">
                <tr>
                  <th className="p-2 text-left">Log ID</th>
                  <th className="p-2 text-left">Entity ID (PAN)</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Log Time</th>
                </tr>
              </thead>
              <tbody>
                {eligibilityData.be2ProviderLogs.map((log, index) => (
                  <tr key={log.id || index} className="border-t hover:bg-orange-50">
                    <td className="p-2">{log.id || 'N/A'}</td>
                    <td className="p-2">{log.entityId || 'N/A'}</td>
                    <td className="p-2">{log.type || 'N/A'}</td>
                    <td className="p-2">
                      <Badge variant={log.status === 'SUCCESS' ? "default" : "outline"}>
                        {log.status || 'Unknown'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      {log.logTime ? new Date(log.logTime).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- PAN Numbers Summary --- */}
      {eligibilityData.summary.panNumbers && eligibilityData.summary.panNumbers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Associated PAN Numbers ({eligibilityData.summary.uniquePanNumbers})
          </h3>
          <div className="flex flex-wrap gap-2">
            {eligibilityData.summary.panNumbers.map((pan, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {pan}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="text-center py-16 text-gray-400">
      <Shield className="w-12 h-12 mx-auto mb-4" />
      <p>Click to load eligibility validation</p>
    </div>
  )}
</TabsContent>
                                      
                   <TabsContent value="repayment" className="mt-0">

  {providerLogsData ? (
    <div className="space-y-8">
      {/* Error State */}
      {providerLogsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
          <p className="text-red-600">{providerLogsError}</p>
        </div>
      )}

      {/* Empty State */}
      {providerLogsData?.providerLogs?.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-4" />
          <p>No provider logs found for this loan</p>
        </div>
      )}

      {/* Provider Logs Content */}
      {(providerLogsData?.providerLogs?.length ?? 0) > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[ 
              { label: 'Total Logs', value: providerLogsData?.summary?.totalLogs, color: 'text-gray-800' },
              { label: 'Unique Providers', value: providerLogsData?.summary?.uniqueProviders, color: 'text-blue-600' },
              { label: 'Successful Requests', value: providerLogsData?.summary?.successfulRequests, color: 'text-green-600' },
              { label: 'Failed Requests', value: providerLogsData?.summary?.failedRequests, color: 'text-red-600' }
            ].map((card) => (
              <Card key={card.label}>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500">{card.label}</CardTitle>
                </CardHeader>
                <CardContent className={`text-xl font-bold ${card.color}`}>
                  {card.value || 0}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['statusBreakdown', 'providerBreakdown', 'httpStatusBreakdown', 'typeBreakdown'] as const).map((key) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="text-sm text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {providerLogsData && providerLogsData.summary && providerLogsData.summary[key] &&
                      Object.entries(
                        providerLogsData.summary[key as keyof Pick<ProviderLogSummary, 'statusBreakdown' | 'providerBreakdown' | 'httpStatusBreakdown' | 'typeBreakdown'>] as Record<string, number>
                      ).map(([label, count]) => (
                        <div key={label} className="flex justify-between items-center">
                          <span className="text-sm truncate">{label}</span>
                          <Badge variant="outline" className="text-xs">{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Date Range Info */}
          <div className="flex gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                  Latest Log Date
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                {providerLogsData && providerLogsData.summary && providerLogsData.summary.latestLogDate
                  ? new Date(providerLogsData.summary.latestLogDate).toLocaleString()
                  : 'N/A'}
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                  Oldest Log Date
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                {providerLogsData && providerLogsData.summary && providerLogsData.summary.oldestLogDate
                  ? new Date(providerLogsData.summary.oldestLogDate).toLocaleString()
                  : 'N/A'}
              </CardContent>
            </Card>
          </div>

          {/* Provider Logs Table */}
          <div>
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Provider Logs</h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm table-auto border-collapse">
                <thead className="bg-purple-50 border-b sticky top-0 z-10">
                  <tr>
                    {['Provider', 'Type', 'Status', 'HTTP Status', 'Entity Type', 'Payload', 'Response', 'Created At', 'Actions'].map((header) => (
                      <th key={header} className="p-2 text-left font-semibold whitespace-nowrap">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {providerLogsData?.providerLogs?.map((log) => (
                    <tr key={log.id} className="border-t hover:bg-purple-50 transition-colors">
                      <td className="p-2 font-medium whitespace-nowrap">{log.provider || 'N/A'}</td>
                      <td className="p-2 whitespace-nowrap">{log.type || 'N/A'}</td>
                      <td className="p-2 whitespace-nowrap">
                        <Badge variant={log.status?.toLowerCase().includes('success') ? 'default' : 'destructive'}>
                          {log.status || 'N/A'}
                        </Badge>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <Badge variant={log.httpStatus === '200' ? 'default' : 'destructive'}>
                          {log.httpStatus || 'N/A'}
                        </Badge>
                      </td>
                      <td className="p-2 whitespace-nowrap">{log.entityType || 'N/A'}</td>

                      {/* Payload Column */}
                      <td className="p-2 max-w-xs truncate" title={log.payload}>
                        <div className="flex items-center gap-2">
                          <span>{log.payload ? log.payload.slice(0, 50) + '…' : 'N/A'}</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">View</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Full Payload</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                                  {JSON.stringify(JSON.parse(log.fullPayload || '{}'), null, 2)}
                                </pre>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="mt-2"
                                  onClick={() => navigator.clipboard.writeText(log.fullPayload || '{}')}
                                >
                                  Copy JSON
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>

                      {/* Response Column */}
                      <td className="p-2 max-w-xs truncate" title={log.response}>
                        <div className="flex items-center gap-2">
                          <span>{log.response ? log.response.slice(0, 50) + '…' : 'N/A'}</span>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">View</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Full Response</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                                  {JSON.stringify(JSON.parse(log.fullResponse || '{}'), null, 2)}
                                </pre>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="mt-2"
                                  onClick={() => navigator.clipboard.writeText(log.fullResponse || '{}')}
                                >
                                  Copy JSON
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </td>

                      <td className="p-2 whitespace-nowrap">{log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A'}</td>
                      <td className="p-2 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigator.clipboard.writeText(JSON.stringify(log, null, 2))}
                        >
                          Copy Row
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  ) : (
    <div className="text-center py-16 text-gray-400">
      <Activity className="w-12 h-12 mx-auto mb-4" />
      <p>Click to load provider logs</p>
    </div>
  )}
</TabsContent>


                  
                  <TabsContent value="transactions" className="mt-0">
  {bankerCheckLoading ? (
    <div className="flex items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  ) : bankerCheckData ? (
    <div className="space-y-8">
      {/* Error State */}
      {bankerCheckError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold">Error Loading Data</h3>
          <p className="text-red-600">{bankerCheckError}</p>
        </div>
      )}

      {/* Loan Information Card */}
      {bankerCheckData.loanInfo && (
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-700">Loan Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="text-xl font-bold text-green-600">
                  ₹{bankerCheckData.loanInfo.loanAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Outstanding Amount</p>
                <p className="text-xl font-bold text-red-600">
                  ₹{bankerCheckData.loanInfo.outstandingAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="text-xl font-bold text-blue-600">
                  {bankerCheckData.loanInfo.interestRate}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={bankerCheckData.loanInfo.loanStatus === 'Active' ? 'default' : 'secondary'}>
                  {bankerCheckData.loanInfo.loanStatus}
                </Badge>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Security Type</p>
                <p className="font-medium">{bankerCheckData.loanInfo.securityType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sanctioned Amount</p>
                <p className="font-medium">₹{bankerCheckData.loanInfo.sanctionedAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Disbursed Amount</p>
                <p className="font-medium">₹{bankerCheckData.loanInfo.disbursedAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Persons', value: bankerCheckData.summary.totalPersons, color: 'text-gray-800' },
          { label: 'Banker Checks', value: bankerCheckData.summary.totalBankerChecks, color: 'text-blue-600' },
          { label: 'Active Checks', value: bankerCheckData.summary.activeBankerChecks, color: 'text-green-600' },
          { label: 'Locations', value: bankerCheckData.summary.totalLocations, color: 'text-purple-600' },
          { label: 'Email Addresses', value: bankerCheckData.summary.totalEmails, color: 'text-orange-600' }
        ].map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">{card.label}</CardTitle>
            </CardHeader>
            <CardContent className={`text-2xl font-bold ${card.color}`}>
              {card.value || 0}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Breakdown Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['severityBreakdown', 'statusBreakdown', 'checkTypeBreakdown'] as const).map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-sm text-gray-500 capitalize">
                {key.replace('Breakdown', '').replace(/([A-Z])/g, ' $1')} Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(bankerCheckData.summary[key] || {}).map(([label, count]) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-sm truncate">{label}</span>
                    <Badge variant="outline" className="text-xs">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Persons Information */}
      {bankerCheckData?.persons?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-700">Person Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {bankerCheckData.persons.map((person) => (
                <div key={person.id} className="border-b pb-4 last:border-b-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">{person.fullName}</h4>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm"><span className="font-medium">PAN:</span> {person.panNumber}</p>
                        <p className="text-sm"><span className="font-medium">Aadhar:</span> {person.aadharNumber}</p>
                        <p className="text-sm"><span className="font-medium">Gender:</span> {person.gender}</p>
                        {person.dateOfBirth && (
                          <p className="text-sm">
                            <span className="font-medium">DOB:</span> {new Date(person.dateOfBirth).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      {person.locations.length > 0 && (
                        <div className="mb-3">
                          <h5 className="font-medium text-gray-700 mb-1">Addresses</h5>
                          {person.locations.map((location, idx) => (
                            <div key={idx} className="text-sm text-gray-600 mb-1">
                              <Badge variant="outline" className="text-xs mr-2">{location.locationType}</Badge>
                              {location.addressLine1}, {location.city}, {location.state} - {location.pincode}
                            </div>
                          ))}
                        </div>
                      )}
                      {person.emails.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-1">Emails</h5>
                          {person.emails.map((email, idx) => (
                            <div key={idx} className="text-sm text-gray-600 mb-1">
                              <Badge variant="outline" className="text-xs mr-2">{email.emailType}</Badge>
                              {email.emailId}
                              {email.isPrimary && <Badge variant="secondary" className="ml-2 text-xs">Primary</Badge>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banker Checks Table */}
      {bankerCheckData?.bankerChecks?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-700">Banker Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm table-auto border-collapse">
                <thead className="bg-purple-50 border-b sticky top-0 z-10">
                  <tr>
                    {['ID', 'Severity', 'Status', 'Check Type', 'Remarks', 'Created At', 'Updated At'].map((header) => (
                      <th key={header} className="p-3 text-left font-semibold whitespace-nowrap">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bankerCheckData.bankerChecks.map((check) => (
                    <tr key={check.id} className="border-t hover:bg-purple-50 transition-colors">
                      <td className="p-3 font-medium">{check.id}</td>
                      <td className="p-3">
                        <Badge variant={
                          check.severity === 'High' ? 'destructive' : 
                          check.severity === 'Medium' ? 'secondary' : 'outline'
                        }>
                          {check.severity}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={check.status === 'Approved' ? 'default' : 'secondary'}>
                          {check.status}
                        </Badge>
                      </td>
                      <td className="p-3">{check.checkType}</td>
                      <td className="p-3 max-w-xs truncate" title={check.remarks}>
                        {check.remarks}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {check.createdAt ? new Date(check.createdAt).toLocaleString() : 'N/A'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {check.updatedAt ? new Date(check.updatedAt).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Banker Checks */}
      {bankerCheckData?.bankerCheckDetails?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-purple-700">Detailed Banker Check Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm table-auto border-collapse">
                <thead className="bg-purple-50 border-b sticky top-0 z-10">
                  <tr>
                    {['ID', 'Severity', 'Status', 'Check Type', 'Check Date', 'Checked By', 'Approved By', 'Rejected By', 'Active', 'Remarks'].map((header) => (
                      <th key={header} className="p-3 text-left font-semibold whitespace-nowrap">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bankerCheckData.bankerCheckDetails.map((detail) => (
                    <tr key={detail.id} className="border-t hover:bg-purple-50 transition-colors">
                      <td className="p-3 font-medium">{detail.id}</td>
                      <td className="p-3">
                        <Badge variant={
                          detail.severity === 'High' ? 'destructive' : 
                          detail.severity === 'Medium' ? 'secondary' : 'outline'
                        }>
                          {detail.severity}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={detail.status === 'Approved' ? 'default' : 'secondary'}>
                          {detail.status}
                        </Badge>
                      </td>
                      <td className="p-3">{detail.checkType}</td>
                      <td className="p-3 whitespace-nowrap">
                        {detail.checkDate ? new Date(detail.checkDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3">{detail.checkedBy}</td>
                      <td className="p-3">{detail.approvedBy}</td>
                      <td className="p-3">{detail.rejectedBy}</td>
                      <td className="p-3">
                        <Badge variant={detail.isActive ? 'default' : 'secondary'}>
                          {detail.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-3 max-w-xs truncate" title={detail.remarks}>
                        {detail.remarks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {bankerCheckData.summary.totalBankerChecks === 0 && (
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-8">
            <div className="text-center py-16 text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-4" />
              <p>No banker check data found for this loan</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  ) : (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="p-8">
        <div className="text-center py-16 text-gray-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-4" />
          <p>Click to load banker check data</p>
          <Button 
            onClick={() => selectedLoan?.id && fetchBankerCheckData(selectedLoan.id)}
            className="mt-4"
            disabled={!selectedLoan?.id}
          >
            Load Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )}
</TabsContent>
                  
                  <TabsContent value="collateral" className="mt-0">
                    <Card className="shadow-sm border-gray-200">
                      <CardContent className="p-8">
                        <div className="text-center py-16 text-gray-400">
                          <Target className="w-12 h-12 mx-auto mb-4" />
                          <p>Collateral information will be displayed here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <Card className="h-96 shadow-sm border-gray-200">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-400">
                    <User className="w-12 h-12 mx-auto mb-4" />
                    <p>Select a loan to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}