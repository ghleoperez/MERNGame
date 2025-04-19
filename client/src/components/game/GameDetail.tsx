import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Game } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Heart, ArrowLeft, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

interface GameDetailProps {
  game: Game;
}

const GameDetail = ({ game }: GameDetailProps) => {
  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/games/${id}/toggle-favorite`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/games'] });
      queryClient.invalidateQueries({ queryKey: [`/api/games/${game.id}`] });
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
      queryClient.invalidateQueries({ queryKey: [`/api/games/${game.id}`] });
    },
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link href="/library">
          <a className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </a>
        </Link>
      </div>
      
      <div className="bg-card rounded-lg overflow-hidden border border-border">
        <div className="relative h-80">
          <img 
            src={game.coverImage} 
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="mb-2 bg-primary text-primary-foreground">
                  {game.category}
                </Badge>
                <h1 className="text-3xl font-bold text-white mb-2">{game.title}</h1>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-white">
                    {(game.rating / 10).toFixed(1)}
                  </span>
                  <Badge variant="outline" className="ml-4">
                    {game.playMode}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-10 h-10 bg-card/30 backdrop-blur-sm"
                  onClick={() => toggleFavoriteMutation.mutate(game.id)}
                >
                  <Heart 
                    className={cn(
                      "h-5 w-5",
                      game.isFavorite ? "fill-red-500 text-red-500" : "text-white"
                    )} 
                  />
                </Button>
                <Button
                  variant={game.isInstalled ? "default" : "secondary"}
                  className="pl-4 pr-5"
                  onClick={() => {
                    if (game.isInstalled) {
                      // Launch game
                      console.log(`Launching game: ${game.title}`);
                    } else {
                      toggleInstalledMutation.mutate(game.id);
                    }
                  }}
                >
                  {game.isInstalled ? (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Play
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Install
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-3">About</h2>
          <p className="text-muted-foreground mb-6">
            {game.description}
          </p>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{game.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Play Mode</span>
                  <span>{game.playMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span>{game.isInstalled ? "Installed" : "Not Installed"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {(game.rating / 10).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Related Games</h3>
              <p className="text-muted-foreground">No related games found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
