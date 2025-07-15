import React from "react";
import Link from "next/link";
import { LayoutGrid, Database } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <Link 
        href="/" 
        className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
      >
        AbhiLoans
      </Link>
      
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
  );
};

export default NavBar;