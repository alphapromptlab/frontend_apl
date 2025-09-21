/**
 * Shared TypeScript types for the application
 */

// Page types
export const MAIN_PAGES = [
  "Dashboard", "Projects", "Library", "Research", "Content Generator", 
  "Campaign Planner", "Task Manager", "Social Media Scheduler", "Image Generator"
] as const;

export type PageType = typeof MAIN_PAGES[number];

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Animation prop types
export interface AnimatedPageProps extends BaseComponentProps {
  pageKey: string;
}

// Task Manager types
export interface TaskManagerState {
  filterStatus: string;
  filterPriority: string;
  isCreateDialogOpen: boolean;
}

export interface TaskManagerActions {
  setFilterStatus: (status: string) => void;
  setFilterPriority: (priority: string) => void;
  setIsCreateDialogOpen: (open: boolean) => void;
}

export type TaskManagerHook = TaskManagerState & TaskManagerActions;

// Image Generator types
export interface ImageGeneratorState {
  prompt: string;
  isGenerating: boolean;
}

export interface ImageGeneratorActions {
  setPrompt: (prompt: string) => void;
  handleGenerate: () => void;
}

export type ImageGeneratorHook = ImageGeneratorState & ImageGeneratorActions;

// Navigation types
export interface NavigationProps {
  currentPage: string;
  onMenuItemClick: (item: string) => void;
}

// Header types
export interface HeaderProps {
  currentPage: string;
  onNewResearchChat: () => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (priority: string) => void;
  onNewTask: () => void;
  onNewCampaign: () => void;
  imagePrompt: string;
  onImagePromptChange: (prompt: string) => void;
  onImageGenerate: () => void;
  isImageGenerating: boolean;
}

// Sidebar types
export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentPage: string;
  onMenuItemClick: (item: string) => void;
}

// Research component ref type
export interface ResearchRef {
  createNewSession: () => void;
}

// Theme types
export type ThemeMode = 'light' | 'dark';
export type NoiseIntensity = 'light' | 'medium' | 'heavy';