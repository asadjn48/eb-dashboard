import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { settingsAPI } from '@/services/settingsService';
import type { CompanySettings } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LogOut, Settings, Menu, 
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  // Fetch Branding (Still needed for the Settings Logo in the profile button)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.get();
        setSettings(data);
        if (data.primaryColor) {
          document.documentElement.style.setProperty('--primary', data.primaryColor);
        }
      } catch (error) {
        console.error("Failed to load header settings", error);
      }
    };
    fetchSettings();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-300">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between max-w-[1920px] mx-auto">
        
        {/* --- LEFT: Mobile Trigger Only (Logo Removed) --- */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* --- RIGHT: Actions & Profile --- */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 pl-1 pr-2 py-1.5 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
                
                {/* SETTINGS LOGO (Instead of User Avatar) */}
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-2 ring-gray-100 group-hover:ring-[var(--primary)]/30 transition-all">
                  <AvatarImage src={settings?.logo} className="object-cover bg-white" /> 
                  <AvatarFallback className="bg-gradient-to-br from-[var(--primary)] to-gray-800 text-white font-bold text-sm">
                    {settings?.name?.charAt(0) || 'E'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="hidden md:block text-left mr-1">
                  <p className="text-sm font-bold text-gray-700 leading-none group-hover:text-[var(--primary)] transition-colors">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                    {user?.role || 'Administrator'}
                  </p>
                </div>
                
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform group-data-[state=open]:rotate-180 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-60 mt-2 shadow-xl border-gray-100 rounded-2xl p-2 animate-in slide-in-from-top-2">
              <DropdownMenuLabel className="font-normal px-3 py-2.5 bg-gray-50/50 rounded-xl mb-1">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs leading-none text-gray-500 truncate">{user?.email || 'admin@company.com'}</p>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer rounded-lg py-2.5 px-3 hover:bg-[var(--primary)]/5 hover:text-[var(--primary)] transition-colors">
                <Settings className="mr-2.5 h-4 w-4" />
                <span className="font-medium">Settings & Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-lg py-2.5 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors">
                <LogOut className="mr-2.5 h-4 w-4" />
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;