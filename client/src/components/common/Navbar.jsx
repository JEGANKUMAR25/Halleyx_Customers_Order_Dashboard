import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-20 w-full flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
      
      {/* Search Bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Ask AI or search..." 
          className="w-full bg-black/20 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium placeholder-slate-500"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900"></span>
        </button>
        
        <div className="h-8 w-px bg-white/10"></div>
        
        <button className="flex items-center gap-3 hover:bg-white/5 p-1.5 rounded-full pr-4 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-sm">
            AD
          </div>
          <span className="text-sm font-medium text-slate-200">Admin</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
