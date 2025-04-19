import { useState } from "react";
import { Link } from "wouter";
import { NavigationItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { 
  Home, Gamepad, Store, Users, 
  Wrench, Settings, Map, ChevronLeft, ChevronRight,
  LogOut
} from "lucide-react";
import { NAV_ICON_MAPPING } from "@/lib/constants";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
  navigationItems: NavigationItem[];
  currentPath: string;
  isLoading: boolean;
}

const Sidebar = ({ 
  collapsed, 
  toggleSidebar, 
  navigationItems,
  currentPath,
  isLoading
}: SidebarProps) => {
  
  // Function to render the appropriate icon based on the icon name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <Home className="w-5 h-5" />;
      case 'gamepad':
        return <Gamepad className="w-5 h-5" />;
      case 'store':
        return <Store className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'wrench':
        return <Wrench className="w-5 h-5" />;
      case 'sitemap':
        return <Map className="w-5 h-5" />;
      case 'settings':
        return <Settings className="w-5 h-5" />;
      default:
        return <Home className="w-5 h-5" />;
    }
  };

  // Group navigation items
  const regularNavItems = navigationItems.filter(item => !item.isAdminOnly);
  const adminNavItems = navigationItems.filter(item => item.isAdminOnly);

  return (
    <aside 
      className={cn(
        "h-screen bg-muted flex flex-col border-r border-border transition-all duration-300 ease-in-out z-30",
        collapsed ? "w-20" : "w-60"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h18v8zM6 15h2v-2h2v-2H8V9H6v2H4v2h2z"></path>
            <circle cx="14.5" cy="13.5" r="1.5"></circle>
            <circle cx="18.5" cy="10.5" r="1.5"></circle>
          </svg>
          {!collapsed && <h1 className="ml-2 text-xl font-bold">GameVault</h1>}
        </div>
        <button 
          onClick={toggleSidebar}
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      
      <nav className="flex-grow py-4 overflow-y-auto">
        <ul>
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <li key={i} className="px-2 mb-1">
                <div className="flex items-center px-4 py-2">
                  <Skeleton className="w-5 h-5 rounded" />
                  {!collapsed && <Skeleton className="w-24 h-4 ml-3" />}
                </div>
              </li>
            ))
          ) : (
            <>
              {regularNavItems.map((item) => (
                <li key={item.id} className="px-2 mb-1">
                  <Link href={item.path}>
                    <a className={cn(
                      "flex items-center px-4 py-2 text-muted-foreground rounded-md hover:bg-primary/10 transition-colors",
                      currentPath === item.path && "bg-primary/20 border-l-2 border-primary text-primary-foreground"
                    )}>
                      <span className="w-5 text-center">
                        {renderIcon(NAV_ICON_MAPPING[item.icon] || 'home')}
                      </span>
                      {!collapsed && <span className="ml-3">{item.label}</span>}
                    </a>
                  </Link>
                </li>
              ))}
              
              {adminNavItems.length > 0 && (
                <>
                  <li className="px-4 py-3 mt-4">
                    {!collapsed && <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</div>}
                  </li>
                  
                  {adminNavItems.map((item) => (
                    <li key={item.id} className="px-2 mb-1">
                      <Link href={item.path}>
                        <a className={cn(
                          "flex items-center px-4 py-2 text-muted-foreground rounded-md hover:bg-primary/10 transition-colors",
                          currentPath === item.path && "bg-primary/20 border-l-2 border-primary text-primary-foreground"
                        )}>
                          <span className="w-5 text-center">
                            {renderIcon(NAV_ICON_MAPPING[item.icon] || 'wrench')}
                          </span>
                          {!collapsed && <span className="ml-3">{item.label}</span>}
                        </a>
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </>
          )}
        </ul>
      </nav>
      
      <div className="border-t border-border p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
            P
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-foreground">Player1</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          )}
          <div className={collapsed ? "ml-auto" : "ml-auto"}>
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted-foreground/20">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
