import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Clock,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowLeft
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  progress: number;
  lastModified: Date;
  createdDate: Date;
  goal: string;
  audience: string;
  budget: string;
  platforms: string[];
  contentCount: number;
  aiScore?: number;
}

interface CampaignOverviewProps {
  onNavigateBack?: () => void;
  onOpenCampaign?: (campaignId: string) => void;
  onCreateCampaign?: () => void;
}

const SAMPLE_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    name: 'Q1 Product Launch Campaign',
    description: 'Complete launch strategy for our new AI-powered productivity tool',
    status: 'active',
    progress: 75,
    lastModified: new Date('2024-01-15T10:30:00'),
    createdDate: new Date('2024-01-01T09:00:00'),
    goal: 'Drive 1000+ sign-ups and increase brand awareness',
    audience: 'Tech-savvy professionals aged 25-40',
    budget: '$5,000',
    platforms: ['instagram', 'facebook', 'website'],
    contentCount: 12,
    aiScore: 87
  },
  {
    id: '2',
    name: 'Holiday Marketing Campaign',
    description: 'Seasonal promotional campaign for holiday sales',
    status: 'completed',
    progress: 100,
    lastModified: new Date('2023-12-25T16:45:00'),
    createdDate: new Date('2023-11-15T14:20:00'),
    goal: 'Increase holiday season sales by 30%',
    audience: 'Existing customers and holiday shoppers',
    budget: '$8,000',
    platforms: ['instagram', 'facebook', 'twitter', 'website'],
    contentCount: 24,
    aiScore: 92
  },
  {
    id: '3',
    name: 'Brand Awareness Q1',
    description: 'First quarter brand building and recognition campaign',
    status: 'planning',
    progress: 25,
    lastModified: new Date('2024-01-10T11:15:00'),
    createdDate: new Date('2024-01-05T08:30:00'),
    goal: 'Establish brand presence in new markets',
    audience: 'Young professionals and entrepreneurs',
    budget: '$3,500',
    platforms: ['instagram', 'youtube'],
    contentCount: 6,
    aiScore: 78
  },
  {
    id: '4',
    name: 'Spring Product Refresh',
    description: 'Refresh and reposition existing products for spring season',
    status: 'paused',
    progress: 45,
    lastModified: new Date('2024-01-08T09:20:00'),
    createdDate: new Date('2023-12-20T13:45:00'),
    goal: 'Revitalize product line and boost Q2 sales',
    audience: 'Existing customers and new market segments',
    budget: '$4,200',
    platforms: ['instagram', 'facebook', 'website'],
    contentCount: 15,
    aiScore: 83
  },
  {
    id: '5',
    name: 'Influencer Collaboration Series',
    description: 'Multi-phase influencer partnership campaign',
    status: 'active',
    progress: 60,
    lastModified: new Date('2024-01-12T14:10:00'),
    createdDate: new Date('2023-12-28T10:00:00'),
    goal: 'Expand reach through strategic partnerships',
    audience: 'Social media users aged 18-35',
    budget: '$6,500',
    platforms: ['instagram', 'youtube', 'twitter'],
    contentCount: 18,
    aiScore: 89
  },
  {
    id: '6',
    name: 'Customer Retention Campaign',
    description: 'Focus on keeping existing customers engaged and loyal',
    status: 'planning',
    progress: 15,
    lastModified: new Date('2024-01-14T08:45:00'),
    createdDate: new Date('2024-01-12T16:30:00'),
    goal: 'Reduce churn rate and increase customer lifetime value',
    audience: 'Existing customer base',
    budget: '$2,800',
    platforms: ['website', 'facebook'],
    contentCount: 4,
    aiScore: 74
  }
];

const STATUS_CONFIG = {
  planning: { label: 'Planning', color: '#6B7280', bgColor: '#6B7280' },
  active: { label: 'Active', color: '#10B981', bgColor: '#10B981' },
  completed: { label: 'Completed', color: '#3B82F6', bgColor: '#3B82F6' },
  paused: { label: 'Paused', color: '#F59E0B', bgColor: '#F59E0B' }
};

export function CampaignOverview({ 
  onNavigateBack,
  onOpenCampaign,
  onCreateCampaign
}: CampaignOverviewProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(SAMPLE_CAMPAIGNS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignDescription, setNewCampaignDescription] = useState('');

  // Filter campaigns based on search and status
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort campaigns by last modified (most recent first)
  const sortedCampaigns = filteredCampaigns.sort((a, b) => 
    new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );

  const handleCreateCampaign = useCallback(() => {
    if (!newCampaignName.trim()) return;

    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: newCampaignName.trim(),
      description: newCampaignDescription.trim() || 'New campaign description...',
      status: 'planning',
      progress: 0,
      lastModified: new Date(),
      createdDate: new Date(),
      goal: 'Define your campaign goal...',
      audience: 'Define your target audience...',
      budget: '$0',
      platforms: [],
      contentCount: 0,
      aiScore: 65
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setNewCampaignName('');
    setNewCampaignDescription('');
    setShowCreateDialog(false);

    // Navigate to the new campaign
    if (onOpenCampaign) {
      onOpenCampaign(newCampaign.id);
    }
  }, [newCampaignName, newCampaignDescription, onOpenCampaign]);

  const handleDeleteCampaign = useCallback((campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
  }, []);

  const handleDuplicateCampaign = useCallback((campaignId: string) => {
    const originalCampaign = campaigns.find(c => c.id === campaignId);
    if (!originalCampaign) return;

    const duplicatedCampaign: Campaign = {
      ...originalCampaign,
      id: `campaign-${Date.now()}`,
      name: `${originalCampaign.name} (Copy)`,
      status: 'planning',
      progress: 0,
      lastModified: new Date(),
      createdDate: new Date()
    };

    setCampaigns(prev => [duplicatedCampaign, ...prev]);
  }, [campaigns]);

  const renderCampaignCard = (campaign: Campaign) => {
    const status = STATUS_CONFIG[campaign.status];
    const daysAgo = Math.floor((Date.now() - campaign.lastModified.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <motion.div
        key={campaign.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group"
      >
        <Card className="bg-gray-800/50 border-gray-700 p-6 hover:border-gray-600 transition-all duration-200 cursor-pointer h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-lg mb-1 truncate">
                {campaign.name}
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                {campaign.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Badge 
                className="text-xs px-2 py-1 text-white"
                style={{ backgroundColor: status.bgColor }}
              >
                {status.label}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-600">
                  <DropdownMenuItem 
                    className="text-white hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenCampaign) onOpenCampaign(campaign.id);
                    }}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Campaign
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-white hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateCampaign(campaign.id);
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-600" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:bg-red-900/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCampaign(campaign.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Progress</div>
              <div className="flex items-center gap-2">
                <Progress value={campaign.progress} className="h-1.5 flex-1" />
                <span className="text-sm font-medium text-white">{campaign.progress}%</span>
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Content</div>
              <div className="text-sm font-medium text-white">{campaign.contentCount} pieces</div>
            </div>
          </div>

          {/* AI Score */}
          {campaign.aiScore && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400">AI Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-white">{campaign.aiScore}%</div>
                <div 
                  className={`w-2 h-2 rounded-full ${
                    campaign.aiScore >= 85 ? 'bg-green-400' :
                    campaign.aiScore >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>
                {daysAgo === 0 ? 'Today' : 
                 daysAgo === 1 ? '1 day ago' : 
                 `${daysAgo} days ago`}
              </span>
            </div>
            <div className="flex items-center gap-1 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Open Campaign</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Click handler */}
          <div 
            className="absolute inset-0 rounded-lg"
            onClick={() => {
              if (onOpenCampaign) onOpenCampaign(campaign.id);
            }}
          />
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="h-screen text-white" style={{ backgroundColor: '#121212' }}>
      {/* Header */}
      <div className="h-16 glass-header border-b border-gray-700 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {onNavigateBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateBack}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-xl font-semibold">Campaign Planner</h1>
            <p className="text-sm text-gray-400">{campaigns.length} campaigns</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-gray-800/50 border-gray-600 text-white"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-gray-800/50 border-gray-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-white hover:bg-gray-700">All Status</SelectItem>
                <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
                <SelectItem value="planning" className="text-white hover:bg-gray-700">Planning</SelectItem>
                <SelectItem value="completed" className="text-white hover:bg-gray-700">Completed</SelectItem>
                <SelectItem value="paused" className="text-white hover:bg-gray-700">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="p-2"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Campaigns Grid */}
        <AnimatePresence mode="wait">
          {sortedCampaigns.length > 0 ? (
            <motion.div
              key="campaigns-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {sortedCampaigns.map(renderCampaignCard)}
            </motion.div>
          ) : (
            <motion.div
              key="no-campaigns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="glass-card rounded-xl p-12 max-w-md mx-auto">
                <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No campaigns found</h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Create your first campaign to get started'
                  }
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-gray-800 border-gray-600 text-white">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription className="text-gray-400">
              Start planning your next marketing campaign
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300 mb-2 block">Campaign Name</Label>
              <Input
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                placeholder="Enter campaign name..."
                className="bg-gray-700 border-gray-600 text-white"
                maxLength={60}
              />
            </div>

            <div>
              <Label className="text-gray-300 mb-2 block">Description</Label>
              <Textarea
                value={newCampaignDescription}
                onChange={(e) => setNewCampaignDescription(e.target.value)}
                placeholder="Describe your campaign goals and strategy..."
                className="bg-gray-700 border-gray-600 text-white resize-none"
                rows={3}
                maxLength={200}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewCampaignName('');
                  setNewCampaignDescription('');
                }}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCampaign}
                disabled={!newCampaignName.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 disabled:opacity-50"
              >
                Create Campaign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}