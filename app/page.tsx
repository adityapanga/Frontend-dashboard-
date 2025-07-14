import { MdDashboard } from "react-icons/md";
import { PiFileSqlFill } from "react-icons/pi";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex gap-12">
        <a 
          href="/dashboard" 
          className="group flex flex-col items-center justify-center w-32 h-32 bg-gray-900 hover:bg-blue-600 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:scale-110"
        >
          <MdDashboard className="text-5xl text-gray-400 group-hover:text-white transition-colors duration-300 mb-2" />
          <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300 font-medium">Dashboard</span>
        </a>
        
        <a 
          href="/query" 
          className="group flex flex-col items-center justify-center w-32 h-32 bg-gray-900 hover:bg-purple-600 rounded-2xl border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:scale-110"
        >
          <PiFileSqlFill className="text-5xl text-gray-400 group-hover:text-white transition-colors duration-300 mb-2" />
          <span className="text-sm text-gray-400 group-hover:text-white transition-colors duration-300 font-medium">SQL Query</span>
        </a>
      </div>
    </div>
  );
}