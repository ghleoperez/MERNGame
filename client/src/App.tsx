import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import MainLayout from "@/components/layouts/MainLayout";
import Home from "@/pages/Home";
import Library from "@/pages/Library";
import GameDetails from "@/pages/GameDetails";
import AdminBuilder from "@/pages/AdminBuilder";
import AdminNavigation from "@/pages/AdminNavigation";
import AdminSettings from "@/pages/AdminSettings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/library" component={Library} />
      <Route path="/game/:id" component={GameDetails} />
      <Route path="/admin/builder" component={AdminBuilder} />
      <Route path="/admin/navigation" component={AdminNavigation} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MainLayout>
          <Router />
        </MainLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
