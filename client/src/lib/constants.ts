import { NavIconMapping, FilterOption } from "./types";

export const GAME_CATEGORIES: FilterOption[] = [
  { label: "All Games", value: "" },
  { label: "RPG", value: "RPG" },
  { label: "Action", value: "Action" },
  { label: "Adventure", value: "Adventure" },
  { label: "Puzzle", value: "Puzzle" },
  { label: "Racing", value: "Racing" },
  { label: "Fantasy", value: "Fantasy" },
];

export const SORT_OPTIONS: FilterOption[] = [
  { label: "Recently Added", value: "recentlyAdded" },
  { label: "Alphabetical", value: "title" },
  { label: "Highest Rated", value: "rating" },
];

export const PLAY_MODE_OPTIONS: FilterOption[] = [
  { label: "All", value: "" },
  { label: "Single Player", value: "Single Player" },
  { label: "Multiplayer", value: "Multiplayer" },
  { label: "Co-op", value: "Co-op" },
  { label: "MMO", value: "MMO" },
];

export const BUILDER_COMPONENTS = [
  {
    type: "section",
    label: "Section",
    icon: "layer-group",
    category: "Layout"
  },
  {
    type: "container",
    label: "Container",
    icon: "square-full",
    category: "Layout"
  },
  {
    type: "grid",
    label: "Grid",
    icon: "th",
    category: "Layout"
  },
  {
    type: "game-card",
    label: "Game Card",
    icon: "gamepad",
    category: "Content"
  },
  {
    type: "hero-banner",
    label: "Hero Banner",
    icon: "image",
    category: "Content"
  },
  {
    type: "text-block",
    label: "Text Block",
    icon: "font",
    category: "Content"
  },
  {
    type: "button",
    label: "Button",
    icon: "square",
    category: "UI Elements"
  },
  {
    type: "form",
    label: "Form",
    icon: "list-alt",
    category: "UI Elements"
  },
  {
    type: "tabs",
    label: "Tabs",
    icon: "folder",
    category: "UI Elements"
  }
];

export const NAV_ICON_MAPPING: NavIconMapping = {
  'home': 'home',
  'gamepad': 'gamepad',
  'store': 'store',
  'user-friends': 'users',
  'tools': 'wrench',
  'sitemap': 'sitemap',
  'cog': 'settings'
};

export const DEFAULT_COMPONENT_PROPS = {
  'section': {
    title: 'New Section',
    description: 'This is a section component'
  },
  'container': {
    width: 'full'
  },
  'grid': {
    columns: 3
  },
  'game-card': {
    title: 'Game Title',
    category: 'Category',
    image: ''
  },
  'hero-banner': {
    title: 'Hero Banner',
    subtitle: 'This is a hero banner',
    image: ''
  },
  'text-block': {
    content: 'This is a text block',
    size: 'md'
  },
  'button': {
    label: 'Button',
    variant: 'primary'
  },
  'form': {
    title: 'Form',
    fields: []
  },
  'tabs': {
    tabs: [
      { label: 'Tab 1', content: 'Tab 1 content' },
      { label: 'Tab 2', content: 'Tab 2 content' }
    ]
  }
};
