import { useQuery } from "@tanstack/react-query";
import { Game } from "@shared/schema";
import GameGrid from "@/components/game/GameGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Library = () => {
  const { data: games, isLoading, error } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  return (
    <div id="library-section" className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Library</h2>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full max-w-xs mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden border border-border">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
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
        <GameGrid games={games || []} />
      )}
    </div>
  );
};

export default Library;
