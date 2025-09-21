import React, { useRef, lazy, Suspense, useMemo, useCallback, useState, memo } from 'react';
import { AnimatePresence } from 'motion/react';
import { SplashScreen } from './components/SplashScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardContent } from './components/DashboardContent';
import { NoiseOverlay } from './components/NoiseOverlay';
import { AnimatedPageWrapper } from './components/common/AnimatedPageWrapper';
import { ComingSoonPage } from './components/common/ComingSoonPage';
import { VideoGenerator } from './components/VideoGenerator';
import { ImageGenerator } from './components/ImageGenerator';
import { 
  useTaskManagerState, 
  useImageGeneratorState, 
  useSidebarState, 
  usePageNavigation,
  useLoadingState 
} from './hooks/useAppState';
import type { ResearchRef } from './types';

type GeneratorMode = 'video' | 'speak' | 'ugc';
type AudioMode = 'speech' | 'soundeffects';

// Optimized lazy loading with better chunk naming
const Projects = lazy(() => import('./components/Projects').then(module => ({ default: module.Projects })));
const Library = lazy(() => import('./components/Library').then(module => ({ default: module.Library })));
const Research = lazy(() => import('./components/Research'));
const ContentGenerator = lazy(() => import('./components/ContentGenerator').then(module => ({ default: module.ContentGenerator })));
const CampaignPlanner = lazy(() => import('./components/CampaignPlanner').then(module => ({ default: module.CampaignPlanner })));
const TaskManager = lazy(() => import('./components/TaskManager').then(module => ({ default: module.TaskManager })));
const SocialMediaScheduler = lazy(() => import('./components/SocialMediaScheduler').then(module => ({ default: module.default })));
const AudioGenerator = lazy(() => import('./components/AudioGenerator').then(module => ({ default: module.AudioGenerator })));

// Optimized loading fallback component
const LoadingFallback = memo(() => (
  <div className="h-full flex items-center justify-center">
    <div className="glass-card rounded-lg p-8 text-center animate-in fade-in duration-300">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4 will-change-transform" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
));

LoadingFallback.displayName = 'LoadingFallback';

// Memoized page renderer with optimized dependencies
const PageRenderer = memo<{
  currentPage: string;
  taskManager: ReturnType<typeof useTaskManagerState>;
  imageGenerator: ReturnType<typeof useImageGeneratorState>;
  researchRef: React.RefObject<ResearchRef>;
  onNavigateToCampaign: () => void;
  onNavigateToPage: (page: string) => void;
  videoGeneratorMode: GeneratorMode;
  onVideoGeneratorModeChange: (mode: GeneratorMode) => void;
  audioGeneratorMode: AudioMode;
  onAudioGeneratorModeChange: (mode: AudioMode) => void;
}>(({ 
  currentPage, 
  taskManager, 
  imageGenerator, 
  researchRef, 
  onNavigateToCampaign, 
  onNavigateToPage,
  videoGeneratorMode,
  onVideoGeneratorModeChange,
  audioGeneratorMode,
  onAudioGeneratorModeChange 
}) => {
  // Memoized page content with optimized switch
  const pageContent = useMemo(() => {
    switch (currentPage) {
      case "Dashboard":
        return <DashboardContent onNavigateToPage={onNavigateToPage} />;
      case "Projects":
        return <Projects onNavigateToCampaign={onNavigateToCampaign} />;
      case "Library":
        return <Library />;
      case "Research":
        return <Research ref={researchRef} />;
      case "Content Generator":
        return <ContentGenerator />;
      case "Task Manager":
        return (
          <TaskManager 
            filterStatus={taskManager.filterStatus}
            filterPriority={taskManager.filterPriority}
            isCreateDialogOpen={taskManager.isCreateDialogOpen}
            onCreateDialogChange={taskManager.setIsCreateDialogOpen}
          />
        );
      case "Social Media Scheduler":
        return <SocialMediaScheduler />;
      case "Video Generator":
        return <VideoGenerator currentMode={videoGeneratorMode} onModeChange={onVideoGeneratorModeChange} />;
      case "Image Generator":
        return <ImageGenerator />;
      case "Audio Generator":
        return <AudioGenerator currentMode={audioGeneratorMode} onModeChange={onAudioGeneratorModeChange} />;
      case "Design Studio":
      case "Video Studio":
      case "Audio Studio":
        return <ComingSoonPage pageName={currentPage} />;
      default:
        return <ComingSoonPage pageName={currentPage} />;
    }
  }, [
    currentPage, 
    taskManager.filterStatus, 
    taskManager.filterPriority, 
    taskManager.isCreateDialogOpen, 
    taskManager.setIsCreateDialogOpen,
    onNavigateToCampaign, 
    onNavigateToPage,
    videoGeneratorMode,
    onVideoGeneratorModeChange,
    audioGeneratorMode,
    onAudioGeneratorModeChange,
    researchRef
  ]);

  return (
    <main className="flex-1 overflow-hidden">
      <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
        <AnimatePresence mode="wait" initial={false}>
          <AnimatedPageWrapper pageKey={currentPage}>
            {pageContent}
          </AnimatedPageWrapper>
        </AnimatePresence>
      </div>
    </main>
  );
});

PageRenderer.displayName = 'PageRenderer';

// Optimized Campaign Planner layout
const CampaignPlannerLayout = memo<{ onNavigateBack: () => void }>(({ onNavigateBack }) => (
  <div className="h-screen bg-background text-foreground dark clean-font relative overflow-hidden will-change-transform">
    <NoiseOverlay intensity="light" />
    <div className="h-full relative z-10">
      <Suspense fallback={<LoadingFallback />}>
        <CampaignPlanner onNavigateBack={onNavigateBack} />
      </Suspense>
    </div>
  </div>
));

CampaignPlannerLayout.displayName = 'CampaignPlannerLayout';

// Optimized main dashboard layout
const DashboardLayout = memo<{
  currentPage: string;
  sidebar: ReturnType<typeof useSidebarState>;
  taskManager: ReturnType<typeof useTaskManagerState>;
  imageGenerator: ReturnType<typeof useImageGeneratorState>;
  researchRef: React.RefObject<ResearchRef>;
  onNewResearchChat: () => void;
  onNewTask: () => void;
  onNewCampaign: () => void;
  onNavigateToPage: (page: string) => void;
  onNavigateToCampaign: () => void;
  videoGeneratorMode: GeneratorMode;
  onVideoGeneratorModeChange: (mode: GeneratorMode) => void;
  audioGeneratorMode: AudioMode;
  onAudioGeneratorModeChange: (mode: AudioMode) => void;
}>(({
  currentPage,
  sidebar,
  taskManager,
  imageGenerator,
  researchRef,
  onNewResearchChat,
  onNewTask,
  onNewCampaign,
  onNavigateToPage,
  onNavigateToCampaign,
  videoGeneratorMode,
  onVideoGeneratorModeChange,
  audioGeneratorMode,
  onAudioGeneratorModeChange
}) => {
  return (
    <div className="h-screen bg-background text-foreground dark clean-font relative overflow-hidden will-change-transform">
      <NoiseOverlay intensity="light" />
      
      <div className="flex h-full relative z-10 overflow-hidden">
        {/* Optimized Sidebar */}
        <Sidebar 
          isCollapsed={sidebar.isCollapsed}
          onToggle={sidebar.toggle}
          currentPage={currentPage}
          onMenuItemClick={onNavigateToPage}
        />

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col transition-all duration-200 overflow-hidden will-change-transform">
          {/* Optimized Header */}
          <Header 
            currentPage={currentPage} 
            onNewResearchChat={onNewResearchChat}
            filterStatus={taskManager.filterStatus}
            onFilterStatusChange={taskManager.setFilterStatus}
            filterPriority={taskManager.filterPriority}
            onFilterPriorityChange={taskManager.setFilterPriority}
            onNewTask={onNewTask}
            onNewCampaign={onNewCampaign}
            imagePrompt={imageGenerator.prompt}
            onImagePromptChange={imageGenerator.setPrompt}
            onImageGenerate={imageGenerator.handleGenerate}
            isImageGenerating={imageGenerator.isGenerating}
            videoGeneratorMode={videoGeneratorMode}
            onVideoGeneratorModeChange={onVideoGeneratorModeChange}
            audioGeneratorMode={audioGeneratorMode}
            onAudioGeneratorModeChange={onAudioGeneratorModeChange}
          />

          {/* Optimized Page Content */}
          <PageRenderer
            currentPage={currentPage}
            taskManager={taskManager}
            imageGenerator={imageGenerator}
            researchRef={researchRef}
            onNavigateToCampaign={onNavigateToCampaign}
            onNavigateToPage={onNavigateToPage}
            videoGeneratorMode={videoGeneratorMode}
            onVideoGeneratorModeChange={onVideoGeneratorModeChange}
            audioGeneratorMode={audioGeneratorMode}
            onAudioGeneratorModeChange={onAudioGeneratorModeChange}
          />
        </div>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

/**
 * Optimized Main App Component
 * - Reduced loading time to 1.5s for faster UX
 * - Memoized components for better performance
 * - Cleaned up unused imports and code
 * - Streamlined state management
 */
export default function App() {
  // Optimized refs
  const researchRef = useRef<ResearchRef | null>(null);
  
  // Optimized state management hooks
  const { isLoading } = useLoadingState(1500);
  const { currentPage, navigateToPage, navigateToDashboard, navigateToCampaign } = usePageNavigation();
  const sidebar = useSidebarState();
  const taskManager = useTaskManagerState();
  const imageGenerator = useImageGeneratorState();

  // Video Generator mode state
  const [videoGeneratorMode, setVideoGeneratorMode] = useState<GeneratorMode>('video');

  // Audio Generator mode state
  const [audioGeneratorMode, setAudioGeneratorMode] = useState<AudioMode>('speech');

  // Optimized event handlers with useCallback
  const handleNewResearchChat = useCallback(() => {
    researchRef.current?.createNewSession();
  }, []);

  const handleNewTask = useCallback(() => {
    taskManager.setIsCreateDialogOpen(true);
  }, [taskManager]);

  const handleVideoGeneratorModeChange = useCallback((mode: GeneratorMode) => {
    setVideoGeneratorMode(mode);
  }, []);

  const handleAudioGeneratorModeChange = useCallback((mode: AudioMode) => {
    setAudioGeneratorMode(mode);
  }, []);

  // Early return for loading state
  if (isLoading) {
    return <SplashScreen />;
  }

  // Full screen Campaign Planner
  if (currentPage === "Campaign Planner") {
    return <CampaignPlannerLayout onNavigateBack={navigateToDashboard} />;
  }

  // Main dashboard layout
  return (
    <DashboardLayout
      currentPage={currentPage}
      sidebar={sidebar}
      taskManager={taskManager}
      imageGenerator={imageGenerator}
      researchRef={researchRef}
      onNewResearchChat={handleNewResearchChat}
      onNewTask={handleNewTask}
      onNewCampaign={navigateToCampaign}
      onNavigateToPage={navigateToPage}
      onNavigateToCampaign={navigateToCampaign}
      videoGeneratorMode={videoGeneratorMode}
      onVideoGeneratorModeChange={handleVideoGeneratorModeChange}
      audioGeneratorMode={audioGeneratorMode}
      onAudioGeneratorModeChange={handleAudioGeneratorModeChange}
    />
  );
}