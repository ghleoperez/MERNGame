import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, Play, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Game } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/games/${id}/toggle-favorite`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
    },
  });
  
  // Toggle installed mutation
  const toggleInstalledMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/games/${id}/toggle-installed`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
    },
  });
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMutation.mutate(game.id);
  };
  
  const handleInstallToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleInstalledMutation.mutate(game.id);
  };
  
  const handlePlayGame = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, this would launch the game
    console.log(`Launching game: ${game.title}`);
  };

  return (
    <Link href={`/game/${game.id}`}>
      <a className="block">
        <Card 
          className={cn(
            "group bg-card rounded-lg overflow-hidden border border-border transition-all duration-200 hover:border-primary",
            "transform hover:-translate-y-1 hover:shadow-lg"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative pb-[56.25%]">
            <img 
              src={game.coverImage} 
              className="absolute inset-0 w-full h-full object-cover"
              alt={game.title}
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {game.category}
              </Badge>
            </div>
            <div className={cn(
              "absolute top-3 right-3 transition-opacity",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <Button 
                size="icon" 
                variant="secondary" 
                className="w-8 h-8 rounded-full bg-card"
                onClick={handleFavoriteToggle}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4",
                    game.isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  )} 
                />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold truncate">{game.title}</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-muted-foreground text-sm ml-1">
                  {(game.rating / 10).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Badge variant="outline" className="text-xs">
                  {game.playMode}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    game.isInstalled 
                      ? "bg-green-900 bg-opacity-30 border-green-700 text-green-400" 
                      : "bg-muted border-muted-foreground text-muted-foreground"
                  )}
                >
                  {game.isInstalled ? "Installed" : "Not Installed"}
                </Badge>
              </div>
              <Button 
                size="icon" 
                variant={game.isInstalled ? "default" : "secondary"} 
                className="w-8 h-8"
                onClick={game.isInstalled ? handlePlayGame : handleInstallToggle}
              >
                {game.isInstalled ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
};

export default GameCard;
