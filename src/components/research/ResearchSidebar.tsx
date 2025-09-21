import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Brain, 
  BookOpen,
  Plus,
  ChevronDown,
  Trash2,
  Save
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '../ui/dialog';
import { toast } from 'sonner@2.0.3';

interface ResearchSidebarProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
  onNewChat: () => void;
  onChatSelect: (chatId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onSaveToLibrary: (content: string, filename: string) => void;
  savedChats: Array<{
    id: string;
    title: string;
    type: string;
    messages: any[];
    lastActivity: Date;
  }>;
  currentChatId: string | null;
  currentContent: string;
}

const researchTypes = [
  {
    id: 'market-research',
    label: 'Market Research',
    icon: TrendingUp,
    description: 'Market trends and analysis',
    color: 'text-blue-500'
  },
  {
    id: 'consumer-research',
    label: 'Consumer Research',
    icon: Users,
    description: 'Consumer behavior insights',
    color: 'text-green-500'
  },
  {
    id: 'competitor-analysis',
    label: 'Competitor Analysis',
    icon: BarChart3,
    description: 'Competitive landscape',
    color: 'text-purple-500'
  },
  {
    id: 'trend-analysis',
    label: 'Trend Analysis',
    icon: TrendingUp,
    description: 'Industry trends tracking',
    color: 'text-orange-500'
  }
];

export function ResearchSidebar({
  selectedType,
  onTypeSelect,
  onNewChat,
  onChatSelect,
  onDeleteSession,
  onSaveToLibrary,
  savedChats,
  currentChatId,
  currentContent
}: ResearchSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'type' | 'alphabetical'>('recent');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filename, setFilename] = useState('');

  // Filter and sort chats
  const filteredChats = savedChats
    .filter(chat => 
      chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });



  const getTypeLabel = (typeId: string) => {
    const type = researchTypes.find(t => t.id === typeId);
    return type ? type.label : typeId.replace('-', ' ');
  };

  const getTypeIcon = (typeId: string) => {
    const type = researchTypes.find(t => t.id === typeId);
    return type ? type.icon : Search;
  };

  const handleDeleteClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    onDeleteSession(sessionId);
  };

  const handleSaveClick = () => {
    if (!currentContent.trim()) {
      toast.error('No content to save');
      return;
    }
    
    // Generate default filename based on current research type and first few words
    const typeLabel = getTypeLabel(selectedType);
    const firstWords = currentContent.trim().split(' ').slice(0, 5).join(' ');
    const defaultFilename = `${typeLabel} - ${firstWords}`.substring(0, 50);
    
    setFilename(defaultFilename);
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = () => {
    if (!filename.trim()) {
      toast.error('Please enter a filename');
      return;
    }
    
    const finalFilename = filename.trim().endsWith('.txt') ? filename.trim() : `${filename.trim()}.txt`;
    onSaveToLibrary(currentContent, finalFilename);
    setShowSaveDialog(false);
    setFilename('');
    toast.success(`Research saved as "${finalFilename}" to Library!`);
  };

  return (
    <div className="w-64 h-full glass-sidebar flex flex-col">
      {/* Header */}
      <div className="p-4 space-y-2">
        {/* New Research Button */}
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-3 h-10 bg-purple-600 hover:bg-purple-700 text-white shadow-[0_2px_6px_rgba(147,51,234,0.3)]"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Research</span>
        </Button>

        {/* Save to Library Button */}
        <Button 
          onClick={handleSaveClick}
          disabled={!currentContent.trim()}
          className="w-full justify-start gap-3 h-10 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white shadow-[0_2px_6px_rgba(107,114,128,0.3)]"
        >
          <Save className="w-4 h-4" />
          <span className="font-medium">Save to Library</span>
        </Button>
      </div>

      {/* Research Types */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Research Types</h3>
        <div className="space-y-1">
          {researchTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => onTypeSelect(type.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                  isSelected 
                    ? 'form-card shadow-[0_2px_6px_rgba(99,102,241,0.2)] ring-2 ring-blue-500/30' 
                    : 'form-card hover:shadow-[0_2px_6px_rgba(0,0,0,0.15)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-500' : type.color}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--form-text)]'}`}>
                    {type.label}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {type.description}
                  </div>
                </div>
                {isSelected && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Saved Chats Section */}
      <div className="flex-1 flex flex-col px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Research History</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => setSortBy('recent')}>
                Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('type')}>
                By Type
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
                A-Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search research..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-8 text-sm form-input"
          />
        </div>

        {/* Chats List */}
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-2">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full glass-subtle flex items-center justify-center">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'No research found' : 'No research history yet'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchTerm ? 'Try a different search term' : 'Start researching to see your history here'}
                </p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const TypeIcon = getTypeIcon(chat.type);
                const isActive = currentChatId === chat.id;
                
                return (
                  <motion.div
                    key={chat.id}
                    className={`relative group w-full text-left p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'form-card shadow-[0_2px_6px_rgba(99,102,241,0.2)] ring-2 ring-blue-500/30 bg-blue-50 dark:bg-blue-500/10' 
                        : 'form-card hover:shadow-[0_2px_6px_rgba(0,0,0,0.15)]'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -1 }}
                    onClick={() => onChatSelect(chat.id)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <TypeIcon className={`w-3 h-3 mt-0.5 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-muted-foreground'}`} />
                      <div className="flex-1 min-w-0">
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-auto">
                          {getTypeLabel(chat.type)}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className={`text-sm line-clamp-2 mb-2 ${isActive ? 'text-blue-900 dark:text-blue-100' : 'text-[var(--form-text)]'}`}>
                      {chat.title}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {chat.messages.length} messages
                      </span>
                      {isActive && (
                        <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span>Active</span>
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(e, chat.id)}
                      className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 sidebar-button hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </motion.div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Save to Library Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="glass-popup">
          <DialogHeader>
            <DialogTitle>Save Research to Library</DialogTitle>
            <DialogDescription>
              Enter a filename for your research. It will be saved as a text file in the Library.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm font-medium text-[var(--form-text)] mb-2 block">
                Filename
              </label>
              <Input
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename..."
                className="form-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveConfirm();
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                File will be saved as .txt format
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
                className="form-button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveConfirm}
                disabled={!filename.trim()}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Save to Library
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}