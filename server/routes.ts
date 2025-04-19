import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertGameSchema, 
  insertNavigationItemSchema, 
  insertLayoutSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - all prefixed with /api
  const apiRouter = app.route('/api');
  
  // Game routes
  app.get('/api/games', async (req: Request, res: Response) => {
    try {
      const games = await storage.getGames();
      res.json(games);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch games' });
    }
  });
  
  app.get('/api/games/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGame(id);
      
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
      
      res.json(game);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch game' });
    }
  });
  
  app.post('/api/games', async (req: Request, res: Response) => {
    try {
      const validatedData = insertGameSchema.parse(req.body);
      const newGame = await storage.createGame(validatedData);
      res.status(201).json(newGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid game data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create game' });
    }
  });
  
  app.patch('/api/games/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertGameSchema.partial().parse(req.body);
      const updatedGame = await storage.updateGame(id, validatedData);
      
      if (!updatedGame) {
        return res.status(404).json({ message: 'Game not found' });
      }
      
      res.json(updatedGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid game data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update game' });
    }
  });
  
  app.post('/api/games/:id/toggle-favorite', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updatedGame = await storage.toggleGameFavorite(id);
      
      if (!updatedGame) {
        return res.status(404).json({ message: 'Game not found' });
      }
      
      res.json(updatedGame);
    } catch (error) {
      res.status(500).json({ message: 'Failed to toggle favorite status' });
    }
  });
  
  app.post('/api/games/:id/toggle-installed', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updatedGame = await storage.toggleGameInstalled(id);
      
      if (!updatedGame) {
        return res.status(404).json({ message: 'Game not found' });
      }
      
      res.json(updatedGame);
    } catch (error) {
      res.status(500).json({ message: 'Failed to toggle installed status' });
    }
  });
  
  // Navigation routes
  app.get('/api/navigation', async (req: Request, res: Response) => {
    try {
      const navItems = await storage.getNavigationItems();
      res.json(navItems);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch navigation items' });
    }
  });
  
  app.get('/api/navigation/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const navItem = await storage.getNavigationItem(id);
      
      if (!navItem) {
        return res.status(404).json({ message: 'Navigation item not found' });
      }
      
      res.json(navItem);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch navigation item' });
    }
  });
  
  app.post('/api/navigation', async (req: Request, res: Response) => {
    try {
      const validatedData = insertNavigationItemSchema.parse(req.body);
      const newNavItem = await storage.createNavigationItem(validatedData);
      res.status(201).json(newNavItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid navigation item data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create navigation item' });
    }
  });
  
  app.patch('/api/navigation/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNavigationItemSchema.partial().parse(req.body);
      const updatedNavItem = await storage.updateNavigationItem(id, validatedData);
      
      if (!updatedNavItem) {
        return res.status(404).json({ message: 'Navigation item not found' });
      }
      
      res.json(updatedNavItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid navigation item data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update navigation item' });
    }
  });
  
  app.delete('/api/navigation/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNavigationItem(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Navigation item not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete navigation item' });
    }
  });
  
  // Layout routes
  app.get('/api/layouts', async (req: Request, res: Response) => {
    try {
      const layouts = await storage.getLayouts();
      res.json(layouts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch layouts' });
    }
  });
  
  app.get('/api/layouts/active', async (req: Request, res: Response) => {
    try {
      const activeLayout = await storage.getActiveLayout();
      
      if (!activeLayout) {
        return res.status(404).json({ message: 'No active layout found' });
      }
      
      res.json(activeLayout);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch active layout' });
    }
  });
  
  app.get('/api/layouts/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const layout = await storage.getLayout(id);
      
      if (!layout) {
        return res.status(404).json({ message: 'Layout not found' });
      }
      
      res.json(layout);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch layout' });
    }
  });
  
  app.post('/api/layouts', async (req: Request, res: Response) => {
    try {
      const validatedData = insertLayoutSchema.parse(req.body);
      const newLayout = await storage.createLayout(validatedData);
      res.status(201).json(newLayout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid layout data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create layout' });
    }
  });
  
  app.patch('/api/layouts/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertLayoutSchema.partial().parse(req.body);
      const updatedLayout = await storage.updateLayout(id, validatedData);
      
      if (!updatedLayout) {
        return res.status(404).json({ message: 'Layout not found' });
      }
      
      res.json(updatedLayout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid layout data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update layout' });
    }
  });
  
  app.post('/api/layouts/:id/set-active', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const activeLayout = await storage.setActiveLayout(id);
      
      if (!activeLayout) {
        return res.status(404).json({ message: 'Layout not found' });
      }
      
      res.json(activeLayout);
    } catch (error) {
      res.status(500).json({ message: 'Failed to set active layout' });
    }
  });
  
  app.delete('/api/layouts/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteLayout(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Layout not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete layout' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
