import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useQuery } from "@tanstack/react-query";
import { NavigationItem } from "@shared/schema";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(3);

  // Get navigation items from the API
  const { data: navigationItems = [], isLoading: isNavLoading } = useQuery<NavigationItem[]>({
    queryKey: ['/api/navigation'],
  });

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="bg-background text-gray-100 min-h-screen flex">
      <Sidebar 
        collapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        navigationItems={navigationItems}
        currentPath={location}
        isLoading={isNavLoading}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
        />
        
        <main id="content-wrapper" className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
