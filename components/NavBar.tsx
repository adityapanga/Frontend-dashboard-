import React from "react";
import Link from "next/link";
import { PiFileSqlFill } from "react-icons/pi";
import { MdDashboard } from "react-icons/md";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between border-b border-white bg-black px-5 h-14 text-white">
      <Link 
        href="/" 
        className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
      >
        Abhiloans
      </Link>
      
      <ul className="flex space-x-6 items-center">
        <li>
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors p-2 rounded"
          >
            <MdDashboard className="text-xl" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link 
            href="/query" 
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors p-2 rounded"
          >
            <PiFileSqlFill className="text-xl" />
            <span className="hidden sm:inline">Query</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;