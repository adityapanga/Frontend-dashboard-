'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, User, CreditCard, FileText, Download, Eye, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

interface CustomerData {
  name: string
  pan: string
  mobile: string
  loans: any[]
}

interface SecurityData {
  camsSecurities: any[]
  loanSecurities: any[]
  be2ProviderRequests: any[]
  be2ProviderLogs: any[]
  summary: any
}

interface EligibilityData {
  AA?: any
  MFC?: any
  summary: any
}

interface BankerCheckData {
  persons: any[]
  bankerChecks: any[]
  summary: any
}

interface ProviderLogData {
  providerLogs: any[]
  summary: any
}

export default function OutcomePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pan = searchParams.get('pan')
  const mobile = searchParams.get('mobile')
  
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [securityData, setSecurityData] = useState<SecurityData | null>(null)
  const [eligibilityData, setEligibilityData] = useState<EligibilityData | null>(null)
  const [bankerCheckData, setBankerCheckData] = useState<BankerCheckData | null>(null)
  const [providerLogData, setProviderLogData] = useState<ProviderLogData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('summary')

  useEffect(() => {
    const fetchData = async () => {
      if (!pan && !mobile) {
        setError('No search parameters provided')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch customer data
        const customerParams = new URLSearchParams()
        if (pan) customerParams.append('pan', pan)
        if (mobile) customerParams.append('mobile', mobile)
        
        const customerResponse = await fetch(`/api/search-customer?${customerParams.toString()}`)
        
        if (!customerResponse.ok) {
          throw new Error('Customer not found')
        }
        
        const customer = await customerResponse.json()
        setCustomerData(customer)

        // If we have loans, fetch additional data
        if (customer.loans && customer.loans.length > 0) {
          const loanId = customer.loans[0].id

          // Fetch security data
          try {
            const securityResponse = await fetch(`/api/validate?loanId=${loanId}`)
            if (securityResponse.ok) {
              const security = await securityResponse.json()
              setSecurityData(security)
            }
          } catch (err) {
            console.error('Error fetching security data:', err)
          }

          // Fetch eligibility data
          try {
            const eligibilityResponse = await fetch(`/api/eligibility?mobile=${customer.mobile}`)
            if (eligibilityResponse.ok) {
              const eligibility = await eligibilityResponse.json()
              setEligibilityData(eligibility)
            }
          } catch (err) {
            console.error('Error fetching eligibility data:', err)
          }

          // Fetch banker check data
          try {
            const bankerResponse = await fetch(`/api/banker-check?loanId=${loanId}`)
            if (bankerResponse.ok) {
              const banker = await bankerResponse.json()
              setBankerCheckData(banker)
            }
          } catch (err) {
            console.error('Error fetching banker check data:', err)
          }

          // Fetch provider log data
          try {
            const providerResponse = await fetch(`/api/provider-logs?pan=${customer.pan}`)
            if (providerResponse.ok) {
              const provider = await providerResponse.json()
              setProviderLogData(provider)
            }
          } catch (err) {
            console.error('Error fetching provider log data:', err)
          }
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [pan, mobile])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customer data...</p>
        </div>
      </div>
    )
  }

  if (error || !customerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <p className="text-red-600 mb-4">{error || 'Customer not found'}</p>
            <Link href="/dashboard">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900">{customerData.name}</h1>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Loans</div>
            <div className="text-2xl font-bold text-blue-600">{customerData.loans.length}</div>
          </div>
        </div>
        <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <CreditCard className="w-4 h-4" />
            <span>PAN: {customerData.pan}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>📱</span>
            <span>Mobile: {customerData.mobile}</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Loans Portfolio */}
        <div className="w-80 bg-white border-r p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Loans Portfolio</h2>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search loans..." 
                className="flex-1 text-sm border-none outline-none"
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>All statuses</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-3">
            {customerData.loans.map((loan, index) => (
              <div key={loan.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{loan.loanNumber}</div>
                  <Badge variant={loan.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {loan.status}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  ₹{loan.amount.toLocaleString()}
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>📅 Start: {new Date(loan.startDate).toLocaleDateString()}</span>
                  <span>📈 Rate: {loan.interestRate}% p.a.</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg border">
            {/* Loan Analysis Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold">Loan Analysis</h2>
                </div>
                <div className="text-sm text-gray-600">
                  {customerData.loans[0]?.loanNumber}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Comprehensive loan information and analytics dashboard
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
                <TabsTrigger value="summary" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                  📊 Summary
                </TabsTrigger>
                <TabsTrigger value="securities" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                  🛡️ Securities
                </TabsTrigger>
                <TabsTrigger value="ckyc" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                  📋 CKYC
                </TabsTrigger>
                <TabsTrigger value="banker-check" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                  📊 Banker Check
                </TabsTrigger>
                <TabsTrigger value="collateral" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                  ⚪ Collateral
                </TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="p-6">
                <div className="space-y-6">
                  {/* Loan Overview */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span>💰</span>
                      <h3 className="font-semibold">Loan Overview</h3>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Loan Amount</div>
                        <div className="text-2xl font-bold">₹{customerData.loans[0]?.amount.toLocaleString() || '0'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Outstanding</div>
                        <div className="text-2xl font-bold text-red-600">₹3,75,000</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Interest Rate</div>
                        <div className="text-2xl font-bold text-green-600">{customerData.loans[0]?.interestRate || 0}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Status</div>
                        <Badge variant="default" className="text-sm">
                          ✓ {customerData.loans[0]?.status || 'Active'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Loan Progress */}
                  <div>
                    <h3 className="font-semibold mb-4">Loan Progress</h3>
                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span>Completed: 15 months</span>
                      <span>Remaining: 45 months</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Start: 15 Jul 2025</span>
                      <span>25% Complete</span>
                      <span>End: 15/1/2025</span>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <span>📅</span>
                        <h3 className="font-semibold">Next Payment</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Due Date:</span>
                          <span>15/1/2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-semibold">₹25,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Days Remaining:</span>
                          <span>12 days</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <span>⏰</span>
                        <h3 className="font-semibold">Payment Summary</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total Paid:</span>
                          <span>₹1,25,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Principal Paid:</span>
                          <span>₹1,00,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest Paid:</span>
                          <span>₹25,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Securities Tab */}
              <TabsContent value="securities" className="p-6">
                <div className="space-y-6">
                  {/* Securities Summary */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Total Securities</h3>
                      <div className="text-3xl font-bold text-blue-600">
                        {securityData?.summary?.totalSecurities || 1}
                      </div>
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="flex justify-between">
                          <span>CAMS Pledged</span>
                          <span>{securityData?.summary?.totalCamsSecurities || '0.999'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>BE2 Requests</span>
                          <span>{securityData?.summary?.totalBe2ProviderRequests || 8}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Total Value</h3>
                      <div className="text-3xl font-bold text-green-600">
                        ₹{securityData?.summary?.totalValue?.toLocaleString() || '1,40,030'}
                      </div>
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="flex justify-between">
                          <span>Loan Pledged</span>
                          <span>{securityData?.summary?.totalLoanSecurities || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>BE2 Logs</span>
                          <span>{securityData?.summary?.totalBe2ProviderLogs || 122}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CAMS Securities */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span>📊</span>
                      <h3 className="font-semibold">CAMS Securities</h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ISIN</TableHead>
                          <TableHead>SCRIP ID</TableHead>
                          <TableHead>PLEDGED QTY</TableHead>
                          <TableHead>PLEDGE VALUE</TableHead>
                          <TableHead>STATUS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>N/A</TableCell>
                          <TableCell>262</TableCell>
                          <TableCell>0.999</TableCell>
                          <TableCell>₹1,40,030</TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Loan Securities */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span>📋</span>
                      <h3 className="font-semibold">Loan Securities</h3>
                    </div>
                    <div className="text-center py-8 text-gray-500">
                      No loan securities found
                    </div>
                  </div>

                  {/* BE2 Provider Requests */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span>🔄</span>
                      <h3 className="font-semibold">BE2 Provider Requests</h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>REQUEST ID</TableHead>
                          <TableHead>ENTITY ID</TableHead>
                          <TableHead>STATUS</TableHead>
                          <TableHead>REQUEST TIME</TableHead>
                          <TableHead>RESPONSE TIME</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 8 }, (_, i) => (
                          <TableRow key={i}>
                            <TableCell>esign_mkti3h7ftdr1evp9</TableCell>
                            <TableCell>58203</TableCell>
                            <TableCell>Unknown</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>N/A</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* BE2 Provider Logs */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span>📝</span>
                      <h3 className="font-semibold">BE2 Provider Logs</h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>LOG ID</TableHead>
                          <TableHead>ENTITY ID (PAN)</TableHead>
                          <TableHead>TYPE</TableHead>
                          <TableHead>STATUS</TableHead>
                          <TableHead>LOG TIME</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>b3wtknp3upyv2vvq15nunr19</TableCell>
                          <TableCell>DXUPD2023Q</TableCell>
                          <TableCell>CKYC_DNLOAD</TableCell>
                          <TableCell>
                            <Badge variant="destructive">FAILURE</Badge>
                          </TableCell>
                          <TableCell>N/A</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>bkzdjzvr0nhzk86u9z118roo</TableCell>
                          <TableCell>DXUPD2023Q</TableCell>
                          <TableCell>CKYC_SEARCH</TableCell>
                          <TableCell>
                            <Badge variant="destructive">FAILURE</Badge>
                          </TableCell>
                          <TableCell>N/A</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* CKYC Tab */}
              <TabsContent value="ckyc" className="p-6">
                <div className="space-y-6">
                  {/* CKYC Summary */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Total Logs</h3>
                      <div className="text-3xl font-bold">122</div>
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="flex justify-between">
                          <span>Successful Requests</span>
                          <span>100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status</span>
                          <div className="space-y-1">
                            <div>FAILURE: 21</div>
                            <div>SUCCESS: 100</div>
                            <div>PENDING: 1</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Unique Providers</h3>
                      <div className="text-3xl font-bold">2</div>
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="flex justify-between">
                          <span>Failed Requests</span>
                          <span>22</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Provider</span>
                          <div className="space-y-1">
                            <div>DECENTRO: 27</div>
                            <div>MFC: 95</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Http Status */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Http Status</h3>
                      <div className="text-sm space-y-1">
                        <div>N/A: 122</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Type</h3>
                      <div className="text-sm space-y-1">
                        <div>CKYC_DNLOAD: 4</div>
                        <div>CKYC_SEARCH: 22</div>
                        <div>CKYC_GEN_OTP: 1</div>
                        <div>SUBMIT_REVOKE: 47</div>
                        <div>VALIDATE_REVOKE: 48</div>
                      </div>
                    </div>
                  </div>

                  {/* Latest and Oldest Log Dates */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span>📅</span>
                        <h3 className="font-semibold">Latest Log Date</h3>
                      </div>
                      <div>7/7/2025, 3:38:33 PM</div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span>⏰</span>
                        <h3 className="font-semibold">Oldest Log Date</h3>
                      </div>
                      <div>1/13/2025, 11:07:06 AM</div>
                    </div>
                  </div>

                  {/* Provider Logs Table */}
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <span>🔄</span>
                      <h3 className="font-semibold">Provider Logs</h3>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PROVIDER</TableHead>
                          <TableHead>TYPE</TableHead>
                          <TableHead>STATUS</TableHead>
                          <TableHead>HTTP STATUS</TableHead>
                          <TableHead>ENTITY TYPE</TableHead>
                          <TableHead>PAYLOAD</TableHead>
                          <TableHead>RESPONSE</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>DECENTRO</TableCell>
                          <TableCell>CKYC_DNLOAD</TableCell>
                          <TableCell>
                            <Badge variant="destructive">FAILURE</Badge>
                          </TableCell>
                          <TableCell>N/A</TableCell>
                          <TableCell>PAN</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </TableCell>
                          <TableCell>{"code":"FETCHER_NOT_OK_EI"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>DECENTRO</TableCell>
                          <TableCell>CKYC_SEARCH</TableCell>
                          <TableCell>
                            <Badge variant="default">SUCCESS</Badge>
                          </TableCell>
                          <TableCell>N/A</TableCell>
                          <TableCell>PAN</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </TableCell>
                          <TableCell>{"decentroTxnId":"99B7A7626C"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>DECENTRO</TableCell>
                          <TableCell>CKYC_DNLOAD</TableCell>
                          <TableCell>
                            <Badge variant="default">SUCCESS</Badge>
                          </TableCell>
                          <TableCell>N/A</TableCell>
                          <TableCell>PAN</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </TableCell>
                          <TableCell>{"decentroTxnId":"0B4C02C5F"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>DECENTRO</TableCell>
                          <TableCell>CKYC_GEN_OTP</TableCell>
                          <TableCell>
                            <Badge variant="default">SUCCESS</Badge>
                          </TableCell>
                          <TableCell>N/A</TableCell>
                          <TableCell>PAN</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </TableCell>
                          <TableCell>{"decentroTxnId":"762E6DBC7A"}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Banker Check Tab */}
              <TabsContent value="banker-check" className="p-6">
                <div className="space-y-6">
                  {/* Banker Check Summary */}
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold mb-4">Total Persons</h3>
                      <div className="text-3xl font-bold">1</div>
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="flex justify-between">
                          <span>Active Checks</span>
                          <span>1</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Email Addresses</span>
                          <span>1</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">Banker Checks</h3>
                      <div className="text-3xl font-bold">1</div>
                      <div className="space-y-2 mt-4 text-sm">
                        <div className="flex justify-between">
                          <span>Locations</span>
                          <span>2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Collateral Tab */}
              <TabsContent value="collateral" className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">⚪</div>
                  <h3 className="text-lg font-semibold mb-2">No Collateral Data</h3>
                  <p>No collateral information available for this loan.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}