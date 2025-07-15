import Link from "next/link";
import { LayoutGrid, Database } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="text-xl font-semibold text-gray-900">
          AbhiLoans
        </div>
        <div className="flex items-center space-x-6">
          <Link 
            href="/dashboard" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/query" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Database className="w-4 h-4" />
            <span>Query</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Abhi<span className="text-blue-600">Loans</span>
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Advanced Loan Management System
          </p>
          <p className="text-gray-500">
            Streamline your lending operations with our comprehensive fintech dashboard
          </p>
        </div>

        {/* Action Cards */}
        <div className="flex space-x-8">
          <Link href="/dashboard" className="group">
            <div className="bg-white rounded-2xl p-8 w-80 h-64 flex flex-col items-center justify-center text-center shadow-sm border hover:shadow-md transition-all duration-200">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <LayoutGrid className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Dashboard</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Access comprehensive loan management tools, customer insights, and real-time analytics
              </p>
            </div>
          </Link>
          
          <Link href="/query" className="group">
            <div className="bg-white rounded-2xl p-8 w-80 h-64 flex flex-col items-center justify-center text-center shadow-sm border hover:shadow-md transition-all duration-200">
              <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">SQL Query</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Execute custom database queries for advanced data analysis and reporting
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}