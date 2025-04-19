import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: number;
}

const TopBar = ({ 
  sidebarCollapsed, 
  toggleSidebar, 
  searchQuery, 
  setSearchQuery,
  notifications 
}: TopBarProps) => {
  return (
    <header className="bg-muted h-16 border-b border-border flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center flex-1">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <div className="ml-4 flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search games..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className={cn(
              "absolute top-1 right-1.5 w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center",
              "text-primary-foreground"
            )}>
              {notifications}
            </span>
          )}
        </Button>
        
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default TopBar;
