import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Bell, Search, Plus, User, MessageSquare, Filter, Flag, Wand2, Zap, Settings, Clock, Edit3, UserPlus, Trash2, ChevronDown, Video, Mic, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";

type GeneratorMode = 'video' | 'speak' | 'ugc';
type AudioMode = 'speech' | 'soundeffects';

interface HeaderProps {
  currentPage: string;
  onNewResearchChat?: () => void;
  filterStatus?: string;
  onFilterStatusChange?: (status: string) => void;
  filterPriority?: string;
  onFilterPriorityChange?: (priority: string) => void;
  onNewTask?: () => void;
  onNewCampaign?: () => void;
  imagePrompt?: string;
  onImagePromptChange?: (prompt: string) => void;
  onImageGenerate?: () => void;
  isImageGenerating?: boolean;
  // Video Generator mode props
  videoGeneratorMode?: GeneratorMode;
  onVideoGeneratorModeChange?: (mode: GeneratorMode) => void;
  // Audio Generator mode props
  audioGeneratorMode?: AudioMode;
  onAudioGeneratorModeChange?: (mode: AudioMode) => void;
}

const getPageIcon = (page: string) => {
  switch (page) {
    case "Research":
      return <Search className="w-4 h-4" />;
    case "Task Manager":
      return <Flag className="w-4 h-4" />;
    case "Image Generator":
      return <Wand2 className="w-4 h-4" />;
    case "Video Generator":
      return <Video className="w-4 h-4" />;
    case "Audio Generator":
      return <Mic className="w-4 h-4" />;
    default:
      return null;
  }
};

const getPageAction = (page: string, onNewResearchChat?: () => void, onNewTask?: () => void, onNewCampaign?: () => void) => {
  switch (page) {
    case "Research":
      return null;
    case "Task Manager":
      return (
        <Button 
          size="sm" 
          onClick={onNewTask}
          className="bg-purple-600 hover:bg-purple-700 text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      );
    case "Campaign Planner":
      return (
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={onNewCampaign}
            className="bg-purple-600 hover:bg-purple-700 text-white border-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-md transition-colors hover:bg-white/10"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none'
                }}
              >
                <ChevronDown className="w-4 h-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-popup min-w-[180px]">
              <DropdownMenuItem 
                className="flex items-center gap-2 px-3 py-2 text-white cursor-pointer hover:bg-white/10 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info('Edit campaign functionality coming soon!');
                }}
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Campaign</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center gap-2 px-3 py-2 text-white cursor-pointer hover:bg-white/10 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info('Add team members functionality coming soon!');
                }}
              >
                <UserPlus className="w-4 h-4" />
                <span>Add team members</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 h-px bg-white/20" />
              <DropdownMenuItem 
                className="flex items-center gap-2 px-3 py-2 text-red-400 cursor-pointer hover:bg-red-500/10 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toast.info('Delete campaign functionality coming soon!');
                }}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Campaign</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    default:
      return null;
  }
};

export function Header({
  currentPage,
  onNewResearchChat,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  onNewTask,
  onNewCampaign,
  imagePrompt,
  onImagePromptChange,
  onImageGenerate,
  isImageGenerating,
  videoGeneratorMode = 'video',
  onVideoGeneratorModeChange,
  audioGeneratorMode = 'speech',
  onAudioGeneratorModeChange
}: HeaderProps) {
  const pageIcon = getPageIcon(currentPage);
  const pageAction = getPageAction(currentPage, onNewResearchChat, onNewTask, onNewCampaign);

  const handleVideoModeChange = (mode: GeneratorMode) => {
    if (onVideoGeneratorModeChange) {
      onVideoGeneratorModeChange(mode);
    }
  };

  const handleAudioModeChange = (mode: AudioMode) => {
    if (onAudioGeneratorModeChange) {
      onAudioGeneratorModeChange(mode);
    }
  };

  return (
    <header className="glass-sidebar border-b border-white/10 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Page Title - Always on Left */}
        <div className="flex items-center gap-3">
          {pageIcon}
          <h1 className="text-xl font-semibold">
            {currentPage === "Video Generator" ? (
              videoGeneratorMode === 'video' ? 'Video Generator' : 
              videoGeneratorMode === 'speak' ? 'Speech Generator' : 
              'UGC Content Builder'
            ) : currentPage === "Audio Generator" ? (
              audioGeneratorMode === 'speech' ? 'Audio Generator - Speech' : 'Audio Generator - Sound Effects'
            ) : currentPage}
          </h1>
        </div>
      </div>

      {/* Task Manager Filters */}
      {currentPage === "Task Manager" && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={onFilterStatusChange}>
              <SelectTrigger className="w-32 glass-subtle border-0 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="glass-card border-0">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPriority} onValueChange={onFilterPriorityChange}>
              <SelectTrigger className="w-32 glass-subtle border-0 text-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="glass-card border-0">
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Video Generator Mode Switcher */}
        {currentPage === "Video Generator" && (
          <div className="flex bg-muted/30 rounded-xl p-1 gap-1">
            <Button
              variant="ghost"
              onClick={() => handleVideoModeChange('video')}
              className={`px-6 h-10 text-sm font-medium transition-all duration-200 ${
                videoGeneratorMode === 'video' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleVideoModeChange('speak')}
              className={`px-6 h-10 text-sm font-medium transition-all duration-200 ${
                videoGeneratorMode === 'speak' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <Mic className="w-4 h-4 mr-2" />
              Speak
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleVideoModeChange('ugc')}
              className={`px-6 h-10 text-sm font-medium transition-all duration-200 ${
                videoGeneratorMode === 'ugc' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <Users className="w-4 h-4 mr-2" />
              UGC builder
            </Button>
          </div>
        )}

        {/* Audio Generator Mode Switcher */}
        {currentPage === "Audio Generator" && (
          <div className="flex bg-muted/30 rounded-xl p-1 gap-1">
            <Button
              variant="ghost"
              onClick={() => handleAudioModeChange('speech')}
              className={`px-6 h-10 text-sm font-medium transition-all duration-200 ${
                audioGeneratorMode === 'speech' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Speech
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleAudioModeChange('soundeffects')}
              className={`px-6 h-10 text-sm font-medium transition-all duration-200 ${
                audioGeneratorMode === 'soundeffects' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <Zap className="w-4 h-4 mr-2" />
              Sound Effects
            </Button>
          </div>
        )}

        {pageAction}

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10">
            <Bell className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
              <AvatarFallback className="bg-blue-600 text-white text-sm">JD</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}