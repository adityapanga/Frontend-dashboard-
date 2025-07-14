'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Search, TrendingUp, Users, DollarSign, Activity } from 'lucide-react'

export default function Dashboard() {
  const [panNumber, setPanNumber] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async () => {
    if (!panNumber && !mobileNumber) {
      return
    }

    setIsLoading(true)
    
    try {
      const searchParams = new URLSearchParams()
      if (panNumber) searchParams.append('pan', panNumber)
      if (mobileNumber) searchParams.append('mobile', mobileNumber)
      
      router.push(`/outcome?${searchParams.toString()}`)
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  const quickStats = [
    {
      title: "Total Loans",
      value: "12,847",
      change: "+12.5%",
      icon: DollarSign,
    },
    {
      title: "Active Customers",
      value: "8,392",
      change: "+8.2%",
      icon: Users,
    },
    {
      title: "Portfolio Value",
      value: "₹2.4Cr",
      change: "+15.3%",
      icon: TrendingUp,
    },
    {
      title: "Processing",
      value: "247",
      change: "+5.1%",
      icon: Activity,
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="fade-in">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Loan Management Dashboard
          </h1>
          <p className="text-slate-600">
            Search and manage customer loans efficiently
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in">
          {quickStats.map((stat, index) => (
            <div key={stat.title} className="metric-card">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4 mx-auto">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="metric-value">{stat.value}</div>
              <div className="metric-label">{stat.title}</div>
              <div className="text-sm text-green-600 font-medium mt-2">
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Search Section */}
          <div className="lg:col-span-2 fade-in">
            <div className="search-form">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Customer Search
                </h2>
                <p className="text-slate-600">
                  Enter customer details to view their loan portfolio
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pan" className="text-sm font-medium text-slate-700">
                    PAN Number
                  </Label>
                  <Input
                    id="pan"
                    type="text"
                    placeholder="Enter PAN Number (optional for testing)"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="input-enhanced"
                    maxLength={10}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="h-px bg-slate-300 flex-1 w-16"></div>
                    <span className="text-sm text-slate-500 bg-white px-4 py-1 rounded-full border">OR</span>
                    <div className="h-px bg-slate-300 flex-1 w-16"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-sm font-medium text-slate-700">
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter mobile number (optional for testing)"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="input-enhanced"
                    maxLength={10}
                  />
                </div>

                <Button 
                  onClick={handleSearch}
                  disabled={isLoading || (!panNumber && !mobileNumber)}
                  className="button-primary w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="spinner"></div>
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Search className="w-5 h-5" />
                      <span>Search Customer</span>
                    </div>
                  )}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Leave fields empty to test with mock data
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="fade-in">
            <Card className="card-enhanced h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Recent Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: 1, action: "New loan application", customer: "Rajesh Kumar", amount: "₹5,00,000", time: "2 min ago" },
                  { id: 2, action: "Payment received", customer: "Priya Sharma", amount: "₹25,000", time: "5 min ago" },
                  { id: 3, action: "Loan approved", customer: "Amit Patel", amount: "₹3,50,000", time: "12 min ago" },
                  { id: 4, action: "Document verified", customer: "Sunita Devi", amount: "₹2,00,000", time: "18 min ago" }
                ].map((activity) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-slate-600">{activity.customer}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-green-600">{activity.amount}</span>
                        <span className="text-xs text-slate-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}