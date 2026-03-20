import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/orders', icon: PackageSearch, label: 'Orders' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 flex flex-col h-full bg-slate-900/50 backdrop-blur-2xl border-r border-white/10 shadow-2xl z-50 fixed left-0 top-0"
    >
      <div className="p-6">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Order Analytics
        </h2>
        <span className="text-xs text-slate-400 font-medium tracking-wider uppercase mt-1 block">
          Management Dashboard
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 relative">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
          Navigation
        </div>
        
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path === '/' && location.pathname === '/');
          
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium relative overflow-hidden group ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-xl"
                />
              )}
              <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-400 transition-colors'} />
              <span className="relative z-10">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10 mt-auto">
        <div className="text-xs text-slate-500 leading-relaxed">
          <div className="font-semibold text-slate-300 mb-1">v2.0.0 AI Powered</div>
          Customer Order Management & Analytics
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
