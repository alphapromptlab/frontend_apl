import { useState, useCallback, useMemo, useEffect } from 'react';
import type { TaskManagerHook, ImageGeneratorHook, PageType } from '../types';

/**
 * Custom hook for Task Manager state management
 */
export const useTaskManagerState = (): TaskManagerHook => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return useMemo(() => ({
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    isCreateDialogOpen,
    setIsCreateDialogOpen
  }), [filterStatus, filterPriority, isCreateDialogOpen]);
};

/**
 * Custom hook for Image Generator state management
 */
export const useImageGeneratorState = (): ImageGeneratorHook => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => setIsGenerating(false), 3000);
  }, [prompt]);

  const setPromptCallback = useCallback((newPrompt: string) => {
    setPrompt(newPrompt);
  }, []);

  return useMemo(() => ({
    prompt,
    setPrompt: setPromptCallback,
    isGenerating,
    handleGenerate
  }), [prompt, setPromptCallback, isGenerating, handleGenerate]);
};

/**
 * Custom hook for sidebar state management
 */
export const useSidebarState = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggle = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  return useMemo(() => ({
    isCollapsed,
    toggle
  }), [isCollapsed, toggle]);
};

/**
 * Custom hook for page navigation
 */
export const usePageNavigation = () => {
  const [currentPage, setCurrentPage] = useState<string>("Dashboard");

  const navigateToPage = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  const navigateToDashboard = useCallback(() => {
    setCurrentPage("Dashboard");
  }, []);

  const navigateToCampaign = useCallback(() => {
    setCurrentPage("Campaign Planner");
  }, []);

  return useMemo(() => ({
    currentPage,
    navigateToPage,
    navigateToDashboard,
    navigateToCampaign
  }), [currentPage, navigateToPage, navigateToDashboard, navigateToCampaign]);
};

/**
 * Custom hook for loading states
 */
export const useLoadingState = (duration: number = 3000) => {
  const [isLoading, setIsLoading] = useState(true);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Auto-stop loading after duration using useEffect (not inside useState)
  useEffect(() => {
    const timer = setTimeout(stopLoading, duration);
    return () => clearTimeout(timer);
  }, [duration, stopLoading]);

  return useMemo(() => ({
    isLoading,
    startLoading,
    stopLoading
  }), [isLoading, startLoading, stopLoading]);
};