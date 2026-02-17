

import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Users, Wallet, Receipt,
  StickyNote, Settings, Building2, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { settingsAPI } from '@/services/settingsService';
import type { CompanySettings } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

// Static menu configuration
const MENU_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/team', label: 'Team', icon: Users },
  { path: '/payroll', label: 'Payroll', icon: Wallet },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  { path: '/notes', label: 'Notes & Ideas', icon: StickyNote },
  { path: '/settings', label: 'Settings', icon: Settings },
];

// --- Sub-Component: Sidebar Link ---
const SidebarLink = ({ item, isCollapsed }: { item: typeof MENU_ITEMS[0], isCollapsed: boolean }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) => cn(
      "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
      isActive 
        ? "bg-slate-50 text-slate-900" 
        : "text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm",
      isCollapsed && "justify-center px-0 py-3"
    )}
  >
    {({ isActive }) => (
      <>
        {/* Active Indicator Bar */}
        {isActive && (
          <span className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-slate-900 transition-all duration-300",
            isCollapsed ? "h-1.5 w-1.5 left-1/2 top-[85%] -translate-x-1/2 rounded-full" : ""
          )} />
        )}

        {/* Icon */}
        <item.icon
          className={cn(
            "shrink-0 transition-all duration-200 relative z-10",
            isCollapsed ? "w-6 h-6" : "w-5 h-5",
            isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
          )}
        />

        {/* Label (Desktop Expanded) */}
        <span className={cn(
          "whitespace-nowrap transition-all duration-300 origin-left",
          isCollapsed ? "hidden" : "block"
        )}>
          {item.label}
        </span>

        {/* Floating Tooltip (Collapsed Mode) */}
        {isCollapsed && (
          <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg translate-x-2 group-hover:translate-x-0">
            {item.label}
          </div>
        )}
      </>
    )}
  </NavLink>
);

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, isMobileOpen = false, onMobileClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBranding = async () => {
      try {
        const data = await settingsAPI.get();
        if (isMounted) setSettings(data);
      } catch (error) {
        console.error("Failed to load sidebar settings", error);
      }
    };
    fetchBranding();
    return () => { isMounted = false; };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* 1. MOBILE BACKDROP (Closes sidebar only on click) */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 lg:hidden transition-all duration-500 ease-in-out",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onMobileClose}
      />

      {/* 2. SIDEBAR CONTAINER */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-[#fcfcfc] border-r border-gray-100 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) z-50 flex flex-col',
          'overflow-x-hidden',
          isCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]', 
          isMobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'
        )}
      >
        
        {/* --- HEADER --- */}
        <div className={cn(
          "h-20 flex items-center shrink-0 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-between px-6"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Logo Wrapper */}
            <div className={cn(
              "shrink-0 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm border border-gray-100",
              settings?.logo ? "bg-white p-1" : "bg-slate-900",
              isCollapsed ? "w-10 h-10" : "w-9 h-9"
            )}>
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt="Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <Building2 className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Title Text */}
            <div className={cn(
              "flex flex-col transition-all duration-300 origin-left",
              isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            )}>
              <span className="font-bold text-[15px] text-slate-900 leading-tight truncate">
                {settings?.name || 'Nexus ERP'}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Workspace
              </span>
            </div>
          </div>

          {/* Desktop Toggle (Visible only when expanded) */}
          <button
            onClick={onToggle}
            className={cn(
              "hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-100 transition-colors",
              isCollapsed && "hidden"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* --- NAVIGATION --- */}
        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-1.5 scrollbar-none overflow-x-hidden">
          {MENU_ITEMS.map((item) => (
            <SidebarLink 
              key={item.path} 
              item={item} 
              isCollapsed={isCollapsed} 
            />
          ))}
        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm shrink-0">
          {/* Re-expand button for collapsed state */}
          {isCollapsed && (
             <button 
                onClick={onToggle} 
                className="hidden lg:flex w-full items-center justify-center p-2.5 mb-3 rounded-xl text-slate-400 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all bg-gray-50"
             >
                <ChevronRight className="w-5 h-5" />
             </button>
          )}

          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
              "text-slate-500 hover:text-red-600 hover:bg-red-50",
              isCollapsed && "justify-center px-0"
            )}
            title="Sign Out"
          >
            <LogOut className={cn(
                "transition-colors shrink-0", 
                isCollapsed ? "w-5 h-5" : "w-4 h-4"
            )} />
            
            <span className={cn(
              "font-medium text-sm whitespace-nowrap transition-all duration-200",
              isCollapsed ? "hidden" : "block"
            )}>
              Sign Out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;