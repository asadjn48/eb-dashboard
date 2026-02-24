// /* eslint-disable @typescript-eslint/no-explicit-any */


// import React from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { Bell, Search, Menu } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// interface HeaderProps {
//   toggleSidebar: () => void;
// }

// const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
//   const { user, logout } = useAuth();

//   // Helper to safely get user info
//   const displayName = user?.displayName || (user as any)?.name || 'User';
//   const role = (user as any)?.role || 'Admin'; // Fallback if role missing

//   return (
//     <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm h-16 flex items-center px-4 gap-4">
//       <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
//         <Menu className="h-5 w-5" />
//       </Button>

//       <div className="flex-1 flex items-center gap-4 md:gap-8">
//         <form className="flex-1 hidden md:block max-w-sm">
//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="search"
//               placeholder="Search..."
//               className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
//             />
//           </div>
//         </form>
//       </div>

//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" className="relative">
//           <Bell className="h-5 w-5" />
//           <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border border-white" />
//         </Button>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="relative h-9 w-9 rounded-full">
//               <Avatar className="h-9 w-9">
//                 <AvatarImage src={user?.photoURL || ''} alt={displayName} />
//                 <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
//               </Avatar>
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56" align="end" forceMount>
//             <DropdownMenuLabel className="font-normal">
//               <div className="flex flex-col space-y-1">
//                 <p className="text-sm font-medium leading-none">{displayName}</p>
//                 <p className="text-xs leading-none text-muted-foreground">
//                   {user?.email}
//                 </p>
//                 <p className="text-xs text-blue-600 font-semibold mt-1 uppercase">{role}</p>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// };

// export default Header;


















/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Search, Menu, CalendarDays, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchParams, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current filters from URL
  const startDate = searchParams.get('start') || '';
  const endDate = searchParams.get('end') || '';

  // Only show the date filter on the dashboard page
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

  // Helper to safely get user info
  const displayName = user?.displayName || (user as any)?.name || 'User';
  const role = (user as any)?.role || 'Admin';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('start');
    params.delete('end');
    setSearchParams(params);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-4 lg:px-6 gap-4 shadow-sm">
      
      {/* Mobile Menu Toggle */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="lg:hidden text-slate-500 hover:bg-slate-100" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="hidden sm:block text-lg font-bold text-slate-800 tracking-tight">
          {isDashboard ? 'Executive Overview' : 'Workspace'}
        </h2>
      </div>

      {/* Center / Global Actions */}
      <div className="flex-1 flex items-center justify-end md:justify-center gap-4">
        
        {/* Search Bar (Hidden on small mobile) */}
        <form className="hidden md:block w-full max-w-[280px]">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#5d88c6] transition-colors" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-slate-50/50 border-slate-200 pl-9 rounded-full h-9 text-sm focus-visible:ring-1 focus-visible:ring-[#5d88c6] transition-all shadow-none"
            />
          </div>
        </form>

        {/* Global Date Filter (Only visible on Dashboard) */}
        {isDashboard && (
          <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-full h-9 px-3 shadow-sm">
            <CalendarDays className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <Input 
              type="date" 
              value={startDate}
              onChange={(e) => updateParam('start', e.target.value)}
              className="h-7 w-[115px] text-xs bg-transparent border-0 focus-visible:ring-0 shadow-none px-1 cursor-pointer font-medium text-slate-700"
              title="Start Date"
            />
            <span className="text-slate-300 text-xs font-bold px-1 shrink-0">to</span>
            <Input 
              type="date" 
              value={endDate}
              onChange={(e) => updateParam('end', e.target.value)}
              className="h-7 w-[115px] text-xs bg-transparent border-0 focus-visible:ring-0 shadow-none px-1 cursor-pointer font-medium text-slate-700"
              title="End Date"
            />
            {(startDate || endDate) && (
              <div className="pl-1 border-l border-slate-200 ml-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearFilters} 
                  className="h-6 w-6 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-100"
                  title="Clear Filters"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Profile Dropdown */}
      <div className="flex items-center shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-slate-200 transition-all p-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photoURL || ''} alt={displayName} />
                <AvatarFallback className="bg-[#5d88c6] text-white font-semibold text-sm">
                  {displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2 rounded-xl shadow-lg border-slate-100" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-3">
              <div className="flex flex-col space-y-1.5">
                <p className="text-sm font-bold text-slate-800 leading-none">{displayName}</p>
                <p className="text-xs text-slate-500 leading-none">{user?.email}</p>
                <div className="pt-1.5">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{role}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem onClick={logout} className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 cursor-pointer font-medium p-3">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;