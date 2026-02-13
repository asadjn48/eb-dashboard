/* eslint-disable react-hooks/set-state-in-effect */
// /* eslint-disable react-hooks/set-state-in-effect */
// import React, { useState, useEffect } from 'react';
// import { Outlet, useLocation } from 'react-router-dom';
// import Sidebar from './Sidebar';
// import Header from './Header';
// import { useIsMobile } from '@/hooks/use-mobile'; // Corrected import

// const MainLayout: React.FC = () => {
//   const isMobile = useIsMobile();
//   const location = useLocation();
  
//   // State: Default to OPEN on desktop, CLOSED on mobile
//   const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

//   // Close sidebar automatically on mobile route change
//   useEffect(() => {
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//   }, [location.pathname, isMobile]);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   return (
//     <div className="min-h-screen bg-gray-50/50 flex">
      
//       {/* Sidebar - Matching SidebarProps interface */}
//       <Sidebar 
//         isCollapsed={!sidebarOpen} 
//         onToggle={toggleSidebar}
//         isMobileOpen={isMobile && sidebarOpen}
//         onMobileClose={() => setSidebarOpen(false)}
//       />

//       {/* Main Content Area */}
//       <div 
//         className={`flex-1 flex flex-col transition-all duration-300 ${
//           sidebarOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-[70px]'
//         }`}
//       >
        
//         {/* Header */}
//         <Header toggleSidebar={toggleSidebar} />

//         {/* Page Content */}
//         <main className="flex-1 p-4 md:p-6 overflow-x-hidden w-full">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;










import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const MainLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    // FIXED: h-screen and overflow-hidden on the root prevents window scrollbar
    <div className="h-screen w-full bg-gray-50/50 flex overflow-hidden">
      
      <Sidebar 
        isCollapsed={!sidebarOpen} 
        onToggle={toggleSidebar}
        isMobileOpen={isMobile && sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      <div 
        className={cn(
          "flex-1 flex flex-col h-full transition-all duration-300 ease-in-out",
          !isMobile ? (sidebarOpen ? "lg:ml-64" : "lg:ml-[70px]") : "ml-0"
        )}
      >
        <Header toggleSidebar={toggleSidebar} />

        {/* FIXED: This is the ONLY scrollable container now */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-200">
          <div className="max-w-[1920px] mx-auto pb-20">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;