import { useState } from "react";
import GameCard from "./GameCard";
import { Game } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List, Filter, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface GameGridProps {
  games: Game[];
  isLoading?: boolean;
}

const GameGrid = ({ games, isLoading = false }: GameGridProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState<string>("recentlyAdded");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Filter games based on active tab
  const filteredGames = games.filter(game => {
    if (activeTab === "all") return true;
    if (activeTab === "favorites") return game.isFavorite;
    if (activeTab === "installed") return game.isInstalled;
    return true;
  });
  
  // Sort games based on selected sort option
  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    // Default: recently added (by ID in this mock implementation)
    return b.id - a.id;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="installed">Installed</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    sortBy === option.value && "bg-primary text-primary-foreground"
                  )}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center border border-border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-10"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-10"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className={cn(
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      )}>
        {sortedGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
        
        {sortedGames.length === 0 && (
          <div className="col-span-full py-10 text-center">
            <p className="text-muted-foreground">No games found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameGrid;
