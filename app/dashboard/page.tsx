'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-xs">
        <div className="text-center mb-8">
          <h1 className="text-xl font-light text-gray-900 mb-2">
            Loan Search
          </h1>
          <p className="text-sm text-gray-500">
            Enter PAN or mobile number
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="PAN Number"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              className="border-0 border-b border-gray-200 rounded-none px-0 py-2 text-center placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 text-sm"
              maxLength={10}
            />
          </div>

          <div className="text-center">
            <span className="text-xs text-gray-400 bg-white px-3">OR</span>
          </div>

          <div>
            <Input
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              className="border-0 border-b border-gray-200 rounded-none px-0 py-2 text-center placeholder:text-gray-400 focus:border-gray-400 focus:ring-0 text-sm"
              maxLength={10}
            />
          </div>

          <div className="pt-6">
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white border-0 rounded-none py-3 font-light"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}