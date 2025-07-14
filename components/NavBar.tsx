import React from "react";
import Link from "next/link";
import { PiFileSqlFill } from "react-icons/pi";
import { MdDashboard, MdNotifications, MdAccountCircle } from "react-icons/md";
import { FiSearch, FiBell } from "react-icons/fi";

const NavBar = () => {
  return (
    <nav className="nav-enhanced flex items-center justify-between px-6 h-16 text-gray-800 sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link 
          href="/" 
          className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-300"
        >
          AbhiLoans
        </Link>
        
        {/* Search bar for larger screens */}
        <div className="hidden md:flex items-center bg-gray-50 rounded-full px-4 py-2 w-80">
          <FiSearch className="text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search loans, customers..." 
            className="bg-transparent outline-none flex-1 text-sm"
          />
        </div>
      </div>
      
      <ul className="flex items-center space-x-2">
        <li>
          <Link 
            href="/dashboard" 
            className="nav-button-enhanced flex items-center gap-2 group"
          >
            <MdDashboard className="text-xl group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/query" 
            className="nav-button-enhanced flex items-center gap-2 group"
          >
            <PiFileSqlFill className="text-xl group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-medium">Query</span>
          </Link>
        </li>
        
        {/* Notification bell */}
        <li>
          <button className="nav-button-enhanced relative group">
            <FiBell className="text-xl group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              3
            </span>
          </button>
        </li>
        
        {/* Profile */}
        <li>
          <button className="nav-button-enhanced group">
            <MdAccountCircle className="text-2xl group-hover:scale-110 transition-transform" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;