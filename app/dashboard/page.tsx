'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Search, TrendingUp, Users, DollarSign, Activity, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

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
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Active Customers",
      value: "8,392",
      change: "+8.2%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Portfolio Value",
      value: "₹2.4Cr",
      change: "+15.3%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Processing",
      value: "247",
      change: "+5.1%",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  const recentActivities = [
    { id: 1, action: "New loan application", customer: "Rajesh Kumar", amount: "₹5,00,000", time: "2 min ago" },
    { id: 2, action: "Payment received", customer: "Priya Sharma", amount: "₹25,000", time: "5 min ago" },
    { id: 3, action: "Loan approved", customer: "Amit Patel", amount: "₹3,50,000", time: "12 min ago" },
    { id: 4, action: "Document verified", customer: "Sunita Devi", amount: "₹2,00,000", time: "18 min ago" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Loan Management Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Search and manage customer loans efficiently
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>Last updated: Just now</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
          {quickStats.map((stat, index) => (
            <div key={stat.title} className="metric-card group cursor-pointer" style={{animationDelay: `${0.1 + index * 0.1}s`}}>
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="metric-value">{stat.value}</div>
              <div className="metric-label">{stat.title}</div>
              <div className="text-sm text-green-600 font-medium mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Search Section */}
          <div className="lg:col-span-2 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="search-container">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse-glow">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Customer Loan Search
                </h2>
                <p className="text-gray-600">
                  Enter PAN or mobile number to find customer details
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="pan" className="text-sm font-medium text-gray-700">
                    PAN Number
                  </Label>
                  <Input
                    id="pan"
                    type="text"
                    placeholder="Enter PAN Number (e.g., ABCDE1234F)"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="search-input"
                    maxLength={10}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex items-center space-x-4">
                    <div className="h-px bg-gray-300 flex-1 w-16"></div>
                    <span className="text-sm text-gray-500 bg-white px-4 py-1 rounded-full border">OR</span>
                    <div className="h-px bg-gray-300 flex-1 w-16"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-sm font-medium text-gray-700">
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter Mobile Number (10 digits)"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="search-input"
                    maxLength={10}
                  />
                </div>

                <Button 
                  onClick={handleSearch}
                  disabled={isLoading || (!panNumber && !mobileNumber)}
                  className="search-button w-full group"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Search className="w-5 h-5" />
                      <span>Search Customer</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
            <Card className="fintech-card h-full">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Recent Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    style={{animationDelay: `${0.5 + index * 0.1}s`}}
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 group-hover:scale-150 transition-transform"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600">{activity.customer}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-semibold text-green-600">{activity.amount}</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 hover:bg-blue-50 rounded-lg transition-colors">
                  View All Activities →
                </button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="animate-slide-up" style={{animationDelay: '0.5s'}}>
          <Card className="fintech-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "New Application", icon: "📝", color: "bg-blue-500" },
                  { title: "Approve Loan", icon: "✅", color: "bg-green-500" },
                  { title: "Generate Report", icon: "📊", color: "bg-purple-500" },
                  { title: "Customer Support", icon: "🎧", color: "bg-orange-500" }
                ].map((action, index) => (
                  <button 
                    key={action.title}
                    className="interactive-element p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 text-center group"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                      <span className="text-2xl">{action.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.title}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}