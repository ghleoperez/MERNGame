import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import GameGrid from "@/components/game/GameGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Home = () => {
  const { data: games, isLoading, error } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Welcome to GameVault</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Featured Game */}
          <div className="md:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
            <div className="relative pb-[40%]">
              <img 
                src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Featured Game" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Cyber Odyssey 2077</h3>
                <p className="text-white/80 mb-4 max-w-md">Experience the future in this open-world action RPG set in a dystopian future.</p>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md w-fit">
                  Play Now
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Your Gaming Stats</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Games in Library</span>
                  <span className="font-medium">{isLoading ? "-" : games?.length || 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, (games?.length || 0) * 10)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Installed Games</span>
                  <span className="font-medium">{isLoading ? "-" : games?.filter(g => g.isInstalled).length || 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: `${Math.min(100, ((games?.filter(g => g.isInstalled).length || 0) / (games?.length || 1)) * 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Favorites</span>
                  <span className="font-medium">{isLoading ? "-" : games?.filter(g => g.isFavorite).length || 0}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-[#EF4444]" style={{ width: `${Math.min(100, ((games?.filter(g => g.isFavorite).length || 0) / (games?.length || 1)) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-card rounded-lg overflow-hidden border border-border">
                  <Skeleton className="h-40 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load games. Please try again later.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {games?.filter(game => game.isInstalled).slice(0, 4).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
              
              {games?.filter(game => game.isInstalled).length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No recently played games. Install a game to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mini GameCard for home page
const GameCard = ({ game }: { game: Game }) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-colors">
      <div className="relative pb-[56.25%]">
        <img 
          src={game.coverImage} 
          alt={game.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{game.title}</h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-muted-foreground text-sm">Last played today</span>
          <span className="text-muted-foreground text-sm">2h playtime</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
