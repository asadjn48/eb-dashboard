// import React, { useEffect, useState } from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import {
//   LayoutDashboard, FolderKanban, Users, Wallet, Receipt,
//   Briefcase, Settings, Building2, ChevronLeft, ChevronRight, LogOut
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { settingsAPI } from '@/services/settingsService';
// import type { CompanySettings } from '@/types';
// import { useAuth } from '@/context/AuthContext';

// interface SidebarProps {
//   isCollapsed: boolean;
//   onToggle: () => void;
//   isMobileOpen?: boolean;
//   onMobileClose?: () => void;
// }

// const menuItems = [
//   { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//   { path: '/projects', label: 'Projects', icon: FolderKanban },
//   { path: '/team', label: 'Team', icon: Users },
//   { path: '/alumni', label: 'Alumni', icon: Users },
//   { path: '/payroll', label: 'Payroll', icon: Wallet },
//   { path: '/expenses', label: 'Expenses', icon: Receipt },
//   { path: '/note', label: 'Notes', icon: Briefcase },
//   { path: '/settings', label: 'Settings', icon: Settings },
// ];

// const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, isMobileOpen = false, onMobileClose }) => {
//   const location = useLocation();
//   const { logout } = useAuth();
//   const [settings, setSettings] = useState<CompanySettings | null>(null);

//   useEffect(() => {
//     const fetchBranding = async () => {
//       try {
//         const data = await settingsAPI.get();
//         setSettings(data);
//       } catch (error) {
//         console.error("Failed to load sidebar settings", error);
//       }
//     };
//     fetchBranding();
//   }, []);

//   return (
//     <>
//       {/* MOBILE OVERLAY */}
//       <div 
//         className={cn(
//           "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
//           isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         )}
//         onClick={onMobileClose}
//       />

//       {/* SIDEBAR */}
//       <aside
//         className={cn(
//           'fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out z-50 flex flex-col',
//           // Desktop Width: Reduced from w-72 to w-64 for a "smaller" feel
//           isCollapsed ? 'lg:w-[70px]' : 'lg:w-64',
//           // Mobile Transform
//           isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
//         )}
//       >
//         {/* --- HEADER (Branding) --- */}
//         <div className={cn(
//           "h-16 flex items-center px-4 border-b border-gray-100/50 transition-all", 
//           isCollapsed ? "justify-center" : "justify-between"
//         )}>
          
//           <div className="flex items-center gap-3 overflow-hidden">
//             {settings?.logo ? (
//               <img 
//                 src={settings.logo} 
//                 alt="Logo" 
//                 className="w-8 h-8 object-contain rounded-md bg-gray-50 border border-gray-100" 
//               />
//             ) : (
//               <div className="flex-shrink-0 w-8 h-8 rounded-md bg-[var(--primary)] flex items-center justify-center shadow-md shadow-[var(--primary)]/20">
//                 <Building2 className="w-4 h-4 text-white" />
//               </div>
//             )}
            
//             <div className={cn("transition-opacity duration-200", isCollapsed ? "lg:opacity-0 lg:hidden" : "opacity-100")}>
//               <span className="font-bold text-sm text-gray-900 whitespace-nowrap block leading-tight">
//                 {settings?.name || 'EncoderBytes'}
//               </span>
//               <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
//                 Workspace
//               </span>
//             </div>
//           </div>

//           {/* Collapse Toggle */}
//           <button
//             onClick={onToggle}
//             className={cn(
//               "hidden lg:flex p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors",
//               isCollapsed && "hidden"
//             )}
//           >
//             <ChevronLeft className="w-4 h-4" />
//           </button>
//         </div>

//         {/* --- NAVIGATION --- */}
//         <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-none">
//           {menuItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname.startsWith(item.path);

//             return (
//               <NavLink
//                 key={item.path}
//                 to={item.path}
//                 onClick={onMobileClose}
//                 className={cn(
//                   'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
//                   isActive
//                     ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
//                     : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
//                   isCollapsed && "justify-center px-2"
//                 )}
//                 title={isCollapsed ? item.label : undefined}
//               >
//                 <Icon
//                   className={cn(
//                     'w-5 h-5 flex-shrink-0 transition-transform duration-200',
//                     isActive && !isCollapsed ? 'scale-105' : 'group-hover:scale-110'
//                   )}
//                 />
                
//                 <span className={cn(
//                   "font-medium text-sm whitespace-nowrap transition-all duration-300 origin-left",
//                   isCollapsed ? "lg:hidden" : "block"
//                 )}>
//                   {item.label}
//                 </span>
//               </NavLink>
//             );
//           })}
//         </nav>

//         {/* --- TOGGLE BUTTON (COLLAPSED MODE) --- */}
//         {isCollapsed && (
//            <div className="hidden lg:flex justify-center pb-2">
//               <button onClick={onToggle} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400">
//                  <ChevronRight className="w-4 h-4" />
//               </button>
//            </div>
//         )}

//         {/* --- FOOTER --- */}
//         <div className="p-3 border-t border-gray-100 bg-gray-50/30">
//           <button 
//             onClick={logout}
//             className={cn(
//               "flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors group",
//               isCollapsed && "justify-center px-0"
//             )}
//             title="Sign Out"
//           >
//             <LogOut className="w-4 h-4 flex-shrink-0" />
//             <span className={cn(
//               "font-medium text-sm whitespace-nowrap transition-all duration-200",
//               isCollapsed ? "lg:hidden" : "block"
//             )}>
//               Sign Out
//             </span>
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;






























import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Users, Wallet, Receipt,
  StickyNote, Settings, Building2, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
// Assuming settingsAPI is available, if not you can remove the fetch logic
import { settingsAPI } from '@/services/settingsService'; 
import type { CompanySettings } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/team', label: 'Team', icon: Users },
  // 'Alumni' is usually accessed via Team page, but can be here if desired. 
  // I removed it from main nav to keep it clean, as per standard UX.
  // { path: '/alumni', label: 'Alumni', icon: Users }, 
  { path: '/payroll', label: 'Payroll', icon: Wallet },
  { path: '/expenses', label: 'Expenses', icon: Receipt },
  // UPDATED: 'Notes' instead of Portfolio
  { path: '/notes', label: 'Notes & Ideas', icon: StickyNote }, 
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, isMobileOpen = false, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const data = await settingsAPI.get();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load sidebar settings", error);
      }
    };
    fetchBranding();
  }, []);

  const handleLogout = async () => {
      await logout();
      navigate('/login');
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onMobileClose}
      />

      {/* SIDEBAR */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out z-50 flex flex-col',
          // Desktop Width
          isCollapsed ? 'lg:w-[70px]' : 'lg:w-64',
          // Mobile Transform
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* --- HEADER (Branding) --- */}
        <div className={cn(
          "h-16 flex items-center px-4 border-b border-gray-100/50 transition-all", 
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          
          <div className="flex items-center gap-3 overflow-hidden">
            {settings?.logo ? (
              <img 
                src={settings.logo} 
                alt="Logo" 
                className="w-8 h-8 object-contain rounded-md bg-gray-50 border border-gray-100" 
              />
            ) : (
              <div className="flex-shrink-0 w-8 h-8 rounded-md bg-[var(--primary)] flex items-center justify-center shadow-md shadow-[var(--primary)]/20">
                <Building2 className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={cn("transition-opacity duration-200", isCollapsed ? "lg:opacity-0 lg:hidden" : "opacity-100")}>
              <span className="font-bold text-sm text-gray-900 whitespace-nowrap block leading-tight">
                {settings?.name || 'Nexus'}
              </span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                Workspace
              </span>
            </div>
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={onToggle}
            className={cn(
              "hidden lg:flex p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors",
              isCollapsed && "hidden"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* --- NAVIGATION --- */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileClose}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                  isActive
                    ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                    isActive && !isCollapsed ? 'scale-105' : 'group-hover:scale-110'
                  )}
                />
                
                <span className={cn(
                  "font-medium text-sm whitespace-nowrap transition-all duration-300 origin-left",
                  isCollapsed ? "lg:hidden" : "block"
                )}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* --- TOGGLE BUTTON (COLLAPSED MODE) --- */}
        {isCollapsed && (
           <div className="hidden lg:flex justify-center pb-2">
              <button onClick={onToggle} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400">
                 <ChevronRight className="w-4 h-4" />
              </button>
           </div>
        )}

        {/* --- FOOTER --- */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/30">
          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors group",
              isCollapsed && "justify-center px-0"
            )}
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className={cn(
              "font-medium text-sm whitespace-nowrap transition-all duration-200",
              isCollapsed ? "lg:hidden" : "block"
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