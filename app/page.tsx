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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Abhi<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Loans</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl">
            Advanced Loan Management System
          </p>
          <p className="text-lg text-gray-400 max-w-2xl">
            Streamline your lending operations with our comprehensive fintech dashboard
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="flex flex-col md:flex-row gap-8 mb-16 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <a 
            href="/dashboard" 
            className="group relative overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-80 h-80 flex flex-col items-center justify-center transition-all duration-500 hover:scale-105 hover:bg-white/15"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MdDashboard className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Dashboard</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Access comprehensive loan management tools, customer insights, and real-time analytics
              </p>
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">→</span>
              </div>
            </div>
          </a>
          
          <a 
            href="/query" 
            className="group relative overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 w-80 h-80 flex flex-col items-center justify-center transition-all duration-500 hover:scale-105 hover:bg-white/15"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <PiFileSqlFill className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">SQL Query</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Execute custom database queries for advanced data analysis and reporting
              </p>
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">→</span>
              </div>
            </div>
          </a>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl animate-slide-up" style={{animationDelay: '0.4s'}}>
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105"
              style={{animationDelay: `${0.5 + index * 0.1}s`}}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                {feature.icon}
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{animationDelay: '0.6s'}}>
          {[
            { label: "Active Loans", value: "12,847", suffix: "" },
            { label: "Total Portfolio", value: "2.4", suffix: "Cr" },
            { label: "Success Rate", value: "98.5", suffix: "%" }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {stat.value}<span className="text-blue-400">{stat.suffix}</span>
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center animate-slide-up" style={{animationDelay: '0.8s'}}>
          <p className="text-gray-500 text-sm">
            Powered by advanced analytics and secure infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}