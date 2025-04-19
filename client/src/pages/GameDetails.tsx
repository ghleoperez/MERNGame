import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Game } from "@shared/schema";
import GameDetail from "@/components/game/GameDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const GameDetailsPage = () => {
  const { id } = useParams();
  const gameId = parseInt(id);
  
  const { data: game, isLoading, error } = useQuery<Game>({
    queryKey: [`/api/games/${gameId}`],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="bg-card rounded-lg overflow-hidden border border-border">
          <Skeleton className="h-80 w-full" />
          <div className="p-6">
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !game) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error ? 'Failed to load game details.' : 'Game not found.'}
        </AlertDescription>
      </Alert>
    );
  }

  return <GameDetail game={game} />;
};

export default GameDetailsPage;
