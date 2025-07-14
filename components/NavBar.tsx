import React from "react";
import Link from "next/link";
import { PiFileSqlFill } from "react-icons/pi";
import { MdDashboard } from "react-icons/md";

const NavBar = () => {
  return (
    <nav className="nav-enhanced flex items-center justify-between px-6 h-16 sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link 
          href="/" 
          className="text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors"
        >
          AbhiLoans
        </Link>
      </div>
      
      <ul className="flex items-center space-x-2">
        <li>
          <Link 
            href="/dashboard" 
            className="nav-link"
          >
            <MdDashboard className="text-lg" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/query" 
            className="nav-link"
          >
            <PiFileSqlFill className="text-lg" />
            <span className="hidden sm:inline">Query</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;