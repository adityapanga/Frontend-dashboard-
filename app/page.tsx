import { MdDashboard } from "react-icons/md";
import { PiFileSqlFill } from "react-icons/pi";
import { TrendingUp, Users, Shield, Zap } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Management",
      description: "Comprehensive customer data and loan tracking"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Compliant",
      description: "Bank-grade security with regulatory compliance"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Analytics & Reports",
      description: "Real-time insights and detailed reporting"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Processing",
      description: "Quick loan approvals and instant updates"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Abhi<span className="text-blue-600">Loans</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-4 max-w-3xl">
            Advanced Loan Management System
          </p>
          <p className="text-lg text-slate-500 max-w-2xl">
            Streamline your lending operations with our comprehensive fintech dashboard
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="flex flex-col md:flex-row gap-8 mb-16 fade-in">
          <a 
            href="/dashboard" 
            className="card-enhanced p-8 w-80 h-80 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          >
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <MdDashboard className="text-4xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Dashboard</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Access comprehensive loan management tools, customer insights, and real-time analytics
            </p>
          </a>
          
          <a 
            href="/query" 
            className="card-enhanced p-8 w-80 h-80 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform"
          >
            <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center mb-6">
              <PiFileSqlFill className="text-4xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">SQL Query</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Execute custom database queries for advanced data analysis and reporting
            </p>
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl fade-in">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="card-enhanced p-6 text-center hover:scale-105 transition-transform"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600">
                {feature.icon}
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h4>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 fade-in">
          {[
            { label: "Active Loans", value: "12,847", suffix: "" },
            { label: "Total Portfolio", value: "2.4", suffix: "Cr" },
            { label: "Success Rate", value: "98.5", suffix: "%" }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {stat.value}<span className="text-blue-600">{stat.suffix}</span>
              </div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}