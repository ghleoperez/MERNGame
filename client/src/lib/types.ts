import { Game, NavigationItem, Layout } from "@shared/schema";

export type ComponentType = 
  | "section" 
  | "container" 
  | "grid" 
  | "game-card" 
  | "hero-banner" 
  | "text-block"
  | "button"
  | "form"
  | "tabs";

export interface DraggableItem {
  type: ComponentType;
  id: string;
}

export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props?: Record<string, any>;
  children?: BuilderComponent[];
}

export interface LayoutComponents {
  components: BuilderComponent[];
}

export interface GameFilter {
  category?: string;
  installed?: boolean;
  favorites?: boolean;
  searchQuery?: string;
  sortBy?: 'title' | 'rating' | 'recentlyAdded';
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface NavIconMapping {
  [key: string]: string;
}
