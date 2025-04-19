import { 
  users, type User, type InsertUser,
  games, type Game, type InsertGame,
  navigationItems, type NavigationItem, type InsertNavigationItem,
  layouts, type Layout, type InsertLayout
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game operations
  getGames(): Promise<Game[]>;
  getGame(id: number): Promise<Game | undefined>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: Partial<InsertGame>): Promise<Game | undefined>;
  toggleGameFavorite(id: number): Promise<Game | undefined>;
  toggleGameInstalled(id: number): Promise<Game | undefined>;
  
  // Navigation operations
  getNavigationItems(): Promise<NavigationItem[]>;
  getNavigationItem(id: number): Promise<NavigationItem | undefined>;
  createNavigationItem(item: InsertNavigationItem): Promise<NavigationItem>;
  updateNavigationItem(id: number, item: Partial<InsertNavigationItem>): Promise<NavigationItem | undefined>;
  deleteNavigationItem(id: number): Promise<boolean>;
  
  // Layout operations
  getLayouts(): Promise<Layout[]>;
  getActiveLayout(): Promise<Layout | undefined>;
  getLayout(id: number): Promise<Layout | undefined>;
  createLayout(layout: InsertLayout): Promise<Layout>;
  updateLayout(id: number, layout: Partial<InsertLayout>): Promise<Layout | undefined>;
  setActiveLayout(id: number): Promise<Layout | undefined>;
  deleteLayout(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private games: Map<number, Game>;
  private navigationItems: Map<number, NavigationItem>;
  private layouts: Map<number, Layout>;
  
  private userIdCounter: number;
  private gameIdCounter: number;
  private navigationItemIdCounter: number;
  private layoutIdCounter: number;

  constructor() {
    this.users = new Map();
    this.games = new Map();
    this.navigationItems = new Map();
    this.layouts = new Map();
    
    this.userIdCounter = 1;
    this.gameIdCounter = 1;
    this.navigationItemIdCounter = 1;
    this.layoutIdCounter = 1;
    
    // Initialize with sample admin user
    this.createUser({
      username: "admin",
      password: "admin",
      isAdmin: true
    });
    
    // Initialize with default navigation
    this.initializeDefaultNavigation();
    
    // Initialize with sample games
    this.initializeSampleGames();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      status: "online",
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // Game methods
  async getGames(): Promise<Game[]> {
    return Array.from(this.games.values());
  }
  
  async getGame(id: number): Promise<Game | undefined> {
    return this.games.get(id);
  }
  
  async createGame(insertGame: InsertGame): Promise<Game> {
    const id = this.gameIdCounter++;
    const now = new Date();
    const game: Game = {
      ...insertGame,
      id,
      createdAt: now,
    };
    this.games.set(id, game);
    return game;
  }
  
  async updateGame(id: number, updateData: Partial<InsertGame>): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame: Game = { ...game, ...updateData };
    this.games.set(id, updatedGame);
    return updatedGame;
  }
  
  async toggleGameFavorite(id: number): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame: Game = { ...game, isFavorite: !game.isFavorite };
    this.games.set(id, updatedGame);
    return updatedGame;
  }
  
  async toggleGameInstalled(id: number): Promise<Game | undefined> {
    const game = this.games.get(id);
    if (!game) return undefined;
    
    const updatedGame: Game = { ...game, isInstalled: !game.isInstalled };
    this.games.set(id, updatedGame);
    return updatedGame;
  }
  
  // Navigation methods
  async getNavigationItems(): Promise<NavigationItem[]> {
    return Array.from(this.navigationItems.values())
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  
  async getNavigationItem(id: number): Promise<NavigationItem | undefined> {
    return this.navigationItems.get(id);
  }
  
  async createNavigationItem(item: InsertNavigationItem): Promise<NavigationItem> {
    const id = this.navigationItemIdCounter++;
    const now = new Date();
    const navItem: NavigationItem = {
      ...item,
      id,
      createdAt: now,
    };
    this.navigationItems.set(id, navItem);
    return navItem;
  }
  
  async updateNavigationItem(id: number, updateData: Partial<InsertNavigationItem>): Promise<NavigationItem | undefined> {
    const navItem = this.navigationItems.get(id);
    if (!navItem) return undefined;
    
    const updatedNavItem: NavigationItem = { ...navItem, ...updateData };
    this.navigationItems.set(id, updatedNavItem);
    return updatedNavItem;
  }
  
  async deleteNavigationItem(id: number): Promise<boolean> {
    return this.navigationItems.delete(id);
  }
  
  // Layout methods
  async getLayouts(): Promise<Layout[]> {
    return Array.from(this.layouts.values());
  }
  
  async getActiveLayout(): Promise<Layout | undefined> {
    return Array.from(this.layouts.values()).find(layout => layout.isActive);
  }
  
  async getLayout(id: number): Promise<Layout | undefined> {
    return this.layouts.get(id);
  }
  
  async createLayout(insertLayout: InsertLayout): Promise<Layout> {
    const id = this.layoutIdCounter++;
    const now = new Date();
    const layout: Layout = {
      ...insertLayout,
      id,
      createdAt: now,
    };
    this.layouts.set(id, layout);
    
    // If this is set as active, deactivate other layouts
    if (layout.isActive) {
      for (const [key, existingLayout] of this.layouts.entries()) {
        if (key !== id && existingLayout.isActive) {
          this.layouts.set(key, { ...existingLayout, isActive: false });
        }
      }
    }
    
    return layout;
  }
  
  async updateLayout(id: number, updateData: Partial<InsertLayout>): Promise<Layout | undefined> {
    const layout = this.layouts.get(id);
    if (!layout) return undefined;
    
    const updatedLayout: Layout = { ...layout, ...updateData };
    this.layouts.set(id, updatedLayout);
    
    // If this is set as active, deactivate other layouts
    if (updatedLayout.isActive) {
      for (const [key, existingLayout] of this.layouts.entries()) {
        if (key !== id && existingLayout.isActive) {
          this.layouts.set(key, { ...existingLayout, isActive: false });
        }
      }
    }
    
    return updatedLayout;
  }
  
  async setActiveLayout(id: number): Promise<Layout | undefined> {
    const layout = this.layouts.get(id);
    if (!layout) return undefined;
    
    // Deactivate all layouts
    for (const [key, existingLayout] of this.layouts.entries()) {
      if (existingLayout.isActive) {
        this.layouts.set(key, { ...existingLayout, isActive: false });
      }
    }
    
    // Set the new active layout
    const updatedLayout: Layout = { ...layout, isActive: true };
    this.layouts.set(id, updatedLayout);
    return updatedLayout;
  }
  
  async deleteLayout(id: number): Promise<boolean> {
    return this.layouts.delete(id);
  }
  
  // Helper methods for initialization
  private initializeDefaultNavigation() {
    const defaultNavItems: InsertNavigationItem[] = [
      { label: "Home", path: "/", icon: "home", isAdminOnly: false, sortOrder: 1, parentId: null },
      { label: "Library", path: "/library", icon: "gamepad", isAdminOnly: false, sortOrder: 2, parentId: null },
      { label: "Store", path: "/store", icon: "store", isAdminOnly: false, sortOrder: 3, parentId: null },
      { label: "Friends", path: "/friends", icon: "user-friends", isAdminOnly: false, sortOrder: 4, parentId: null },
      { label: "UI Builder", path: "/admin/builder", icon: "tools", isAdminOnly: true, sortOrder: 5, parentId: null },
      { label: "Navigation", path: "/admin/navigation", icon: "sitemap", isAdminOnly: true, sortOrder: 6, parentId: null },
      { label: "Settings", path: "/admin/settings", icon: "cog", isAdminOnly: true, sortOrder: 7, parentId: null },
    ];
    
    for (const item of defaultNavItems) {
      this.createNavigationItem(item);
    }
  }
  
  private initializeSampleGames() {
    const sampleGames: InsertGame[] = [
      {
        title: "Cyber Odyssey 2077",
        description: "A futuristic RPG set in a dystopian world where cyberware modifications are commonplace.",
        category: "RPG",
        coverImage: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 48,
        isInstalled: true,
        isFavorite: false,
        playMode: "Single Player"
      },
      {
        title: "Space Explorer",
        description: "Explore the vast unknown universe and discover new planets and species.",
        category: "Adventure",
        coverImage: "https://images.unsplash.com/photo-1552083375-1447ce886485?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 45,
        isInstalled: false,
        isFavorite: false,
        playMode: "Co-op"
      },
      {
        title: "Battle Royale Arena",
        description: "Fight to be the last one standing in this action-packed battle royale.",
        category: "Action",
        coverImage: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 42,
        isInstalled: true,
        isFavorite: true,
        playMode: "Multiplayer"
      },
      {
        title: "Puzzle Quest",
        description: "Challenge your mind with increasingly difficult puzzles in a fantasy setting.",
        category: "Puzzle",
        coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 47,
        isInstalled: true,
        isFavorite: false,
        playMode: "Single Player"
      },
      {
        title: "Racing Legends",
        description: "Race against the best drivers across famous tracks from around the world.",
        category: "Racing",
        coverImage: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 43,
        isInstalled: true,
        isFavorite: false,
        playMode: "Multiplayer"
      },
      {
        title: "Fantasy Quest",
        description: "Embark on an epic journey through magical lands in this massively multiplayer online role-playing game.",
        category: "Fantasy",
        coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        rating: 49,
        isInstalled: false,
        isFavorite: false,
        playMode: "MMO"
      }
    ];
    
    for (const game of sampleGames) {
      this.createGame(game);
    }
  }
}

export const storage = new MemStorage();
