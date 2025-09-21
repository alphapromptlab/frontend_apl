import { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus,
  Search,
  Filter,
  ArrowLeft,
  User,
  Bell,
  Settings,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  Database,
  Zap,
  Sparkles,
  Link,
  ExternalLink,
  Info,
  Hash,
  Eye,
  UserPlus,
  DollarSign,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { LoadingSpinner } from './ui/loading-spinner';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { CampaignDashboard } from './CampaignDashboard';
import { CampaignCreationDialog } from './campaign-dashboard/CampaignCreationDialog';
import { LinkExternalAdsDialog } from './campaign-dashboard/LinkExternalAdsDialog';
import { DateHighlight } from './common/DateHighlight';

interface ExternalCampaign {
  id: string;
  name: string;
  platform: 'meta' | 'google' | 'linkedin' | 'youtube' | 'twitter';
  platformName: string;
  status: 'active' | 'paused' | 'completed';
  startDate: string;
  spend: number;
  currency: string;
  isAutoLinked: boolean;
  linkedDate?: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'Draft' | 'Active' | 'Completed' | 'Paused';
  progress: number;
  startDate: string;
  endDate: string;
  type: 'Online' | 'Offline' | 'PR' | 'Hybrid';
  budget: number;
  spent: number;
  assignedMembers: Array<{
    id: string;
    name: string;
    avatar: string;
    initials: string;
  }>;
  platforms: string[];
  priority: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
  stage: 'intake' | 'goals' | 'audience' | 'budget' | 'planning' | 'timeline' | 'production' | 'launch' | 'optimization';
  uniqueId: string;
  linkedExternalCampaigns: ExternalCampaign[];
  autoLinkedCount: number;
  digitalMetrics?: {
    connectedPlatforms: string[];
    lastSyncDate?: string;
    apiStatus: 'connected' | 'disconnected' | 'syncing' | 'error';
  };
  offlineMetrics?: {
    attributionMethods: string[];
    lastDataEntry?: string;
    manualEntryStatus: 'current' | 'overdue' | 'incomplete';
  };
}

// Mock external campaigns that could be linked
const mockUnlinkedExternalCampaigns: ExternalCampaign[] = [
  {
    id: 'ext-1',
    name: 'Summer Sale Facebook Campaign',
    platform: 'meta',
    platformName: 'Meta Ads',
    status: 'active',
    startDate: '2024-07-15',
    spend: 2500,
    currency: 'USD',
    isAutoLinked: false
  },
  {
    id: 'ext-2',
    name: 'Brand Awareness Google Ads',
    platform: 'google',
    platformName: 'Google Ads',
    status: 'active',
    startDate: '2024-07-20',
    spend: 1800,
    currency: 'USD',
    isAutoLinked: false
  },
  {
    id: 'ext-3',
    name: 'LinkedIn Professional Services',
    platform: 'linkedin',
    platformName: 'LinkedIn Ads',
    status: 'paused',
    startDate: '2024-07-10',
    spend: 950,
    currency: 'USD',
    isAutoLinked: false
  },
  {
    id: 'ext-4',
    name: 'YouTube Video Campaign Q3',
    platform: 'youtube',
    platformName: 'YouTube Ads',
    status: 'active',
    startDate: '2024-07-25',
    spend: 3200,
    currency: 'USD',
    isAutoLinked: false
  }
];

// Enhanced mock data with unique IDs and external campaign linking
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Product Launch',
    description: 'Multi-platform campaign for new product line launch targeting millennials',
    status: 'Active',
    progress: 68,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    type: 'Hybrid',
    budget: 50000,
    spent: 34000,
    assignedMembers: [
      { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
      { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' },
      { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' }
    ],
    platforms: ['Instagram', 'Facebook', 'TikTok', 'Print', 'Radio'],
    priority: 'High',
    lastUpdated: '2024-07-28',
    stage: 'launch',
    uniqueId: 'CP-2401',
    linkedExternalCampaigns: [
      {
        id: 'ext-linked-1',
        name: 'Summer Launch Meta CP-2401',
        platform: 'meta',
        platformName: 'Meta Ads',
        status: 'active',
        startDate: '2024-06-01',
        spend: 12500,
        currency: 'USD',
        isAutoLinked: true,
        linkedDate: '2024-06-01T08:00:00Z'
      },
      {
        id: 'ext-linked-2',
        name: 'Google Ads Summer Launch',
        platform: 'google',
        platformName: 'Google Ads',
        status: 'active',
        startDate: '2024-06-05',
        spend: 8300,
        currency: 'USD',
        isAutoLinked: false,
        linkedDate: '2024-06-05T14:30:00Z'
      }
    ],
    autoLinkedCount: 1,
    digitalMetrics: {
      connectedPlatforms: ['Facebook', 'Instagram', 'TikTok'],
      lastSyncDate: '2024-07-28T10:30:00Z',
      apiStatus: 'connected'
    },
    offlineMetrics: {
      attributionMethods: ['phone', 'promo'],
      lastDataEntry: '2024-07-27T16:00:00Z',
      manualEntryStatus: 'current'
    }
  },
  {
    id: '2',
    name: 'Brand Awareness Campaign',
    description: 'Increase brand visibility through influencer partnerships and content marketing',
    status: 'Draft',
    progress: 25,
    startDate: '2024-08-15',
    endDate: '2024-10-15',
    type: 'Online',
    budget: 30000,
    spent: 2500,
    assignedMembers: [
      { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' },
      { id: '4', name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', initials: 'AK' }
    ],
    platforms: ['Instagram', 'YouTube', 'LinkedIn'],
    priority: 'Medium',
    lastUpdated: '2024-07-25',
    stage: 'planning',
    uniqueId: 'CP-2402',
    linkedExternalCampaigns: [],
    autoLinkedCount: 0,
    digitalMetrics: {
      connectedPlatforms: ['Instagram', 'LinkedIn'],
      lastSyncDate: '2024-07-25T14:20:00Z',
      apiStatus: 'syncing'
    }
  },
  {
    id: '3',
    name: 'Holiday PR Blitz',
    description: 'Strategic PR campaign for holiday season featuring media outreach and events',
    status: 'Completed',
    progress: 100,
    startDate: '2023-11-01',
    endDate: '2024-01-15',
    type: 'PR',
    budget: 75000,
    spent: 72000,
    assignedMembers: [
      { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' },
      { id: '5', name: 'David Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', initials: 'DP' }
    ],
    platforms: ['Media Outlets', 'Events', 'Press'],
    priority: 'High',
    lastUpdated: '2024-01-20',
    stage: 'optimization',
    uniqueId: 'CP-2303',
    linkedExternalCampaigns: [],
    autoLinkedCount: 0,
    offlineMetrics: {
      attributionMethods: ['surveys', 'events'],
      lastDataEntry: '2024-01-18T12:00:00Z',
      manualEntryStatus: 'current'
    }
  },
  {
    id: '4',
    name: 'Local Store Opening',
    description: 'Grand opening campaign for new flagship store with local community engagement',
    status: 'Active',
    progress: 45,
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    type: 'Offline',
    budget: 25000,
    spent: 11250,
    assignedMembers: [
      { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
      { id: '6', name: 'Lisa Thompson', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', initials: 'LT' }
    ],
    platforms: ['Print', 'Radio', 'Outdoor', 'Events'],
    priority: 'Medium',
    lastUpdated: '2024-07-26',
    stage: 'production',
    uniqueId: 'CP-2404',
    linkedExternalCampaigns: [],
    autoLinkedCount: 0,
    offlineMetrics: {
      attributionMethods: ['phone', 'foot-traffic', 'promo'],
      lastDataEntry: '2024-07-24T09:30:00Z',
      manualEntryStatus: 'overdue'
    }
  },
  {
    id: '5',
    name: 'Q4 Performance Campaign',
    description: 'Data-driven performance marketing campaign to boost Q4 sales and conversions',
    status: 'Paused',
    progress: 15,
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    type: 'Online',
    budget: 60000,
    spent: 9000,
    assignedMembers: [
      { id: '4', name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', initials: 'AK' },
      { id: '7', name: 'Rachel Wong', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150', initials: 'RW' }
    ],
    platforms: ['Google Ads', 'Facebook', 'Instagram', 'LinkedIn'],
    priority: 'High',
    lastUpdated: '2024-07-20',
    stage: 'goals',
    uniqueId: 'CP-2405',
    linkedExternalCampaigns: [
      {
        id: 'ext-linked-3',
        name: 'Q4 Performance CP-2405 Google',
        platform: 'google',
        platformName: 'Google Ads',
        status: 'paused',
        startDate: '2024-07-15',
        spend: 4200,
        currency: 'USD',
        isAutoLinked: true,
        linkedDate: '2024-07-15T10:00:00Z'
      }
    ],
    autoLinkedCount: 1,
    digitalMetrics: {
      connectedPlatforms: ['Google Ads', 'Facebook'],
      lastSyncDate: '2024-07-19T08:00:00Z',
      apiStatus: 'error'
    }
  }
];

interface CampaignPlannerProps {
  onNavigateBack?: () => void;
}

// Optimized Campaign Card Component with memoization
const CampaignCard = memo<{
  campaign: Campaign;
  index: number;
  onCampaignClick: (id: string) => void;
  onCopyId: (id: string) => void;
  getStatusColor: (status: Campaign['status']) => string;
  getPriorityColor: (priority: Campaign['priority']) => string;
  getExternalLinkingStatus: (campaign: Campaign) => { text: string; color: string };
}>(({ campaign, index, onCampaignClick, onCopyId, getStatusColor, getPriorityColor, getExternalLinkingStatus }) => {
  const handleClick = useCallback(() => {
    onCampaignClick(campaign.id);
  }, [campaign.id, onCampaignClick]);

  const handleCopyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyId(campaign.uniqueId);
  }, [campaign.uniqueId, onCopyId]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        delay: index * 0.02,
        duration: 0.2
      }}
      layout
    >
      <Card 
        className="glass-card border-0 p-4 hover:bg-white/10 transition-all duration-150 cursor-pointer group will-change-transform"
        onClick={handleClick}
      >
        <div className="flex items-center gap-4">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 w-24">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status)}`} />
            <span className="text-sm font-medium">{campaign.status}</span>
          </div>

          {/* Campaign Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold group-hover:text-purple-400 transition-colors truncate">
                {campaign.name}
              </h3>
              <Badge className={`${getPriorityColor(campaign.priority)} border-0 text-xs`}>
                {campaign.priority}
              </Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 glass-card border-0 bg-purple-500/10 text-purple-400 border-purple-500/20 font-mono cursor-help"
                    onClick={handleCopyClick}
                  >
                    {campaign.uniqueId}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="glass-card border-0 bg-black/90 max-w-xs">
                  <p className="text-xs">
                    Campaign ID - Click to copy
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-muted-foreground truncate">{campaign.description}</p>
          </div>

          {/* External Ads Status */}
          <div className="w-48 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-muted-foreground">External Ads:</span>
              <span className={getExternalLinkingStatus(campaign).color}>
                {campaign.linkedExternalCampaigns.length || 'None'}
              </span>
            </div>
            {campaign.autoLinkedCount > 0 && (
              <Badge variant="outline" className="text-xs px-1 py-0 bg-green-500/10 text-green-400 border-green-500/20">
                {campaign.autoLinkedCount} Auto-linked
              </Badge>
            )}
          </div>

          {/* Progress */}
          <div className="w-32">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{campaign.progress}%</span>
            </div>
            <Progress value={campaign.progress} className="h-2" />
          </div>

          {/* Campaign Dates */}
          <div className="flex items-center gap-4 w-48">
            <DateHighlight 
              date={campaign.startDate}
              label="Start"
              isStart={true}
              className="scale-90"
            />
            <DateHighlight 
              date={campaign.endDate}
              label="End"
              isStart={false}
              className="scale-90"
            />
          </div>

          {/* Team */}
          <div className="flex -space-x-2 w-24">
            {campaign.assignedMembers.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
              </Avatar>
            ))}
            {campaign.assignedMembers.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs text-muted-foreground">+{campaign.assignedMembers.length - 3}</span>
              </div>
            )}
          </div>

          {/* Actions */}
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
                <MoreHorizontal className="w-4 h-4 text-white" />
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
                <span>Edit the Campaign</span>
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
      </Card>
    </motion.div>
  );
});

CampaignCard.displayName = 'CampaignCard';

export const CampaignPlanner = memo<CampaignPlannerProps>(({ onNavigateBack }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreationDialogOpen, setIsCreationDialogOpen] = useState(false);
  const [isDataSyncing, setIsDataSyncing] = useState(false);
  const [syncingCampaignIds, setSyncingCampaignIds] = useState<Set<string>>(new Set());
  const [isLinkAdsDialogOpen, setIsLinkAdsDialogOpen] = useState(false);
  const [selectedCampaignForLinking, setSelectedCampaignForLinking] = useState<Campaign | null>(null);
  const [unlinkedExternalCampaigns, setUnlinkedExternalCampaigns] = useState<ExternalCampaign[]>(mockUnlinkedExternalCampaigns);

  const selectedCampaign = selectedCampaignId ? campaigns.find(c => c.id === selectedCampaignId) : null;

  // Memoized filtered campaigns for better performance
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  // Generate unique campaign ID
  const generateUniqueId = () => {
    const prefix = 'CP';
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}-${year}${random}`;
  };

  // Data Integration Functions
  const simulateDataSync = useCallback(async (campaignId: string) => {
    setSyncingCampaignIds(prev => new Set(prev).add(campaignId));
    
    // Update campaign sync status
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId && campaign.digitalMetrics
        ? {
            ...campaign,
            digitalMetrics: {
              ...campaign.digitalMetrics,
              apiStatus: 'syncing'
            }
          }
        : campaign
    ));

    // Simulate API fetch delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update with success
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId && campaign.digitalMetrics
        ? {
            ...campaign,
            digitalMetrics: {
              ...campaign.digitalMetrics,
              apiStatus: 'connected',
              lastSyncDate: new Date().toISOString()
            },
            lastUpdated: new Date().toISOString()
          }
        : campaign
    ));
    
    setSyncingCampaignIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(campaignId);
      return newSet;
    });
    
    toast.success('Campaign data synced successfully', {
      description: 'Digital metrics updated from connected platforms'
    });
  }, []);

  const handleBulkSync = useCallback(async () => {
    setIsDataSyncing(true);
    
    // Simulate bulk sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsDataSyncing(false);
    toast.success('All campaigns synced', {
      description: 'Digital metrics updated across all active campaigns'
    });
  }, []);

  const handleCampaignCreated = useCallback((newCampaign: Campaign) => {
    // Ensure the new campaign has a unique ID
    const campaignWithUniqueId = {
      ...newCampaign,
      uniqueId: generateUniqueId(),
      linkedExternalCampaigns: [],
      autoLinkedCount: 0
    };
    
    setCampaigns(prev => [campaignWithUniqueId, ...prev]);
    toast.success('Campaign created successfully!', {
      description: `${newCampaign.name} is ready for setup and launch`,
      action: {
        label: 'View Campaign',
        onClick: () => setSelectedCampaignId(newCampaign.id)
      }
    });
  }, []);

  const handleLinkExternalAds = (campaign?: Campaign) => {
    // If no campaign provided, use the first active campaign or null
    const targetCampaign = campaign || campaigns.find(c => c.status === 'Active') || null;
    setSelectedCampaignForLinking(targetCampaign);
    setIsLinkAdsDialogOpen(true);
  };

  const handleExternalCampaignsLinked = (campaignId: string, linkedCampaigns: ExternalCampaign[]) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId
        ? {
            ...campaign,
            linkedExternalCampaigns: [...campaign.linkedExternalCampaigns, ...linkedCampaigns],
            lastUpdated: new Date().toISOString()
          }
        : campaign
    ));

    // Remove linked campaigns from unlinked list
    setUnlinkedExternalCampaigns(prev => 
      prev.filter(unlinked => !linkedCampaigns.some(linked => linked.id === unlinked.id))
    );

    toast.success(`${linkedCampaigns.length} external campaign(s) linked successfully!`, {
      description: 'External ad data will now be included in campaign analytics'
    });
  };

  const handleAssignUnlinkedCampaign = (externalCampaign: ExternalCampaign, targetCampaign?: Campaign) => {
    // For demo purposes, assign to first active campaign or create a selection modal
    const activeCampaign = targetCampaign || campaigns.find(c => c.status === 'Active');
    if (activeCampaign) {
      handleExternalCampaignsLinked(activeCampaign.id, [externalCampaign]);
    }
  };

  // Memoized helper functions to prevent recreation on every render
  const copyUniqueId = useCallback((uniqueId: string) => {
    navigator.clipboard.writeText(uniqueId);
    toast.success('Campaign ID copied to clipboard!', {
      description: 'You can now paste this into your external ad campaign names'
    });
  }, []);

  const getStatusColor = useCallback((status: Campaign['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Draft': return 'bg-yellow-500';
      case 'Completed': return 'bg-blue-500';
      case 'Paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  }, []);

  const getPriorityColor = useCallback((priority: Campaign['priority']) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-500/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'Low': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  }, []);

  const getExternalLinkingStatus = useCallback((campaign: Campaign) => {
    const linkedCount = campaign.linkedExternalCampaigns.length;
    if (linkedCount === 0) {
      return { text: 'No external ads linked yet', color: 'text-muted-foreground' };
    }
    return { 
      text: `${linkedCount} external campaign${linkedCount > 1 ? 's' : ''} linked`, 
      color: 'text-green-400' 
    };
  }, []);

  const handleCampaignClick = useCallback((campaignId: string) => {
    setSelectedCampaignId(campaignId);
  }, []);

  const handleBackToOverview = useCallback(() => {
    setSelectedCampaignId(null);
  }, []);

  const handleNewCampaign = useCallback(() => {
    setIsCreationDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    if (onNavigateBack) {
      onNavigateBack();
    }
  }, [onNavigateBack]);

  // If a campaign is selected, show the dashboard
  if (selectedCampaign) {
    return (
      <CampaignDashboard
        campaign={selectedCampaign}
        campaigns={campaigns}
        unlinkedExternalCampaigns={unlinkedExternalCampaigns}
        onBack={handleBackToOverview}
        onCampaignSelect={handleCampaignClick}
        onNewCampaign={handleNewCampaign}
        onExternalCampaignsLinked={handleExternalCampaignsLinked}
      />
    );
  }

  // Main campaign overview screen
  return (
    <TooltipProvider>
      <div className="h-screen bg-background text-foreground overflow-hidden">
        {/* Top Navigation */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-header border-b border-white/10 px-6 py-4"
        >
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {onNavigateBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNavigateBack}
                  className="sidebar-button"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-semibold">Campaign Planner</h1>
                <p className="text-sm text-muted-foreground">
                  Manage campaigns with integrated digital and offline data tracking
                </p>
              </div>
            </div>

            {/* Right side - Single Create New Campaign Button */}
            <div className="flex items-center">
              <Button
                onClick={handleNewCampaign}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Campaign
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="p-6 h-full">
            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between mb-6"
            >
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 glass-card border-0 bg-white/5"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                      <Filter className="w-4 h-4 mr-2" />
                      {statusFilter === 'all' ? 'All Status' : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass-card border-0 bg-black/90">
                    <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('draft')}>Draft</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('completed')}>Completed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter('paused')}>Paused</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            {/* Campaign List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide"
            >
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  {filteredCampaigns.map((campaign, index) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      index={index}
                      onCampaignClick={handleCampaignClick}
                      onCopyId={copyUniqueId}
                      getStatusColor={getStatusColor}
                      getPriorityColor={getPriorityColor}
                      getExternalLinkingStatus={getExternalLinkingStatus}
                    />
                  ))}
                </AnimatePresence>

                {filteredCampaigns.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                    <Button onClick={handleNewCampaign} className="bg-gradient-to-r from-purple-600 to-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Campaign
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Campaign Creation Dialog */}
        <CampaignCreationDialog
          isOpen={isCreationDialogOpen}
          onClose={() => setIsCreationDialogOpen(false)}
          onCampaignCreated={handleCampaignCreated}
        />

        {/* Link External Ads Dialog */}
        <LinkExternalAdsDialog
          isOpen={isLinkAdsDialogOpen}
          onClose={() => {
            setIsLinkAdsDialogOpen(false);
            setSelectedCampaignForLinking(null);
          }}
          campaign={selectedCampaignForLinking}
          availableExternalCampaigns={unlinkedExternalCampaigns}
          onExternalCampaignsLinked={handleExternalCampaignsLinked}
        />
      </div>
    </TooltipProvider>
  );
});

CampaignPlanner.displayName = 'CampaignPlanner';