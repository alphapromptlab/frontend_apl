import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft,
  Plus,
  BarChart3,
  Calendar,
  Users,
  DollarSign,
  FileText,
  Settings,
  MoreHorizontal,
  Play,
  Pause,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  MessageSquare,
  FolderOpen,
  Download,
  Link,
  Hash,
  Info,
  Copy,
  ExternalLink,
  UserPlus
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { LoadingSpinner } from './ui/loading-spinner';
import { toast } from 'sonner@2.0.3';
import { CampaignOverviewTab } from './campaign-dashboard/CampaignOverviewTab';
import { CampaignTimelineTasksTab } from './campaign-dashboard/CampaignTimelineTasksTab';
import { CampaignAudienceMessagingTab } from './campaign-dashboard/CampaignAudienceMessagingTab';
import { CampaignBudgetTab } from './campaign-dashboard/CampaignBudgetTab';
import { CampaignAnalyticsTab } from './campaign-dashboard/CampaignAnalyticsTab';
import { CampaignFilesApprovalsTab } from './campaign-dashboard/CampaignFilesApprovalsTab';
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
  stage: string;
  uniqueId: string;
  linkedExternalCampaigns: ExternalCampaign[];
  autoLinkedCount: number;
}

interface CampaignDashboardProps {
  campaign: Campaign;
  campaigns: Campaign[];
  unlinkedExternalCampaigns: ExternalCampaign[];
  onBack: () => void;
  onCampaignSelect: (campaignId: string) => void;
  onNewCampaign: () => void;
  onExternalCampaignsLinked: (campaignId: string, linkedCampaigns: ExternalCampaign[]) => void;
}

const platformIcons = {
  meta: '🔵',
  google: '🟢',
  linkedin: '🔷',
  youtube: '🔴',
  twitter: '⚫'
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'paused': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

export function CampaignDashboard({ 
  campaign, 
  campaigns, 
  unlinkedExternalCampaigns = [], // Default to empty array to prevent filter errors
  onBack, 
  onCampaignSelect, 
  onNewCampaign,
  onExternalCampaignsLinked
}: CampaignDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isLinkAdsDialogOpen, setIsLinkAdsDialogOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getCampaignStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Draft': return 'bg-yellow-500';
      case 'Completed': return 'bg-blue-500';
      case 'Paused': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageDisplayName = (stage: string) => {
    const stageMap: { [key: string]: string } = {
      'intake': 'Intake & Audit',
      'goals': 'Goal Definition',
      'audience': 'Audience Mapping',
      'budget': 'Budget Planning',
      'planning': 'Campaign Planning',
      'timeline': 'Timeline Setup',
      'production': 'Asset Production',
      'launch': 'Launch & Distribution',
      'optimization': 'Performance & Optimization'
    };
    return stageMap[stage] || stage;
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    
    toast.loading('Generating campaign report...', { 
      id: 'pdf-generation',
      description: 'This may take a few moments'
    });

    // Simulate PDF generation time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Simulate PDF download - Fixed regex escaping
    const fileName = campaign.name.replace(/[^a-zA-Z0-9]/g, '_') + '_Campaign_Report.pdf';
    
    setIsDownloadingPDF(false);
    
    toast.success('Campaign report downloaded successfully!', {
      id: 'pdf-generation',
      description: `${fileName} has been saved to your downloads`,
      action: {
        label: 'Open Folder',
        onClick: () => {
          console.log('Opening downloads folder...');
        }
      }
    });
  };

  const handleLinkExternalAds = () => {
    setIsLinkAdsDialogOpen(true);
  };

  const handleAssignUnlinkedCampaign = (externalCampaign: ExternalCampaign) => {
    // In a real implementation, this would open a campaign selection modal
    // For now, we'll automatically assign to the current campaign
    onExternalCampaignsLinked(campaign.id, [externalCampaign]);
  };

  // Scroll detection for optimized layout changes
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        setScrollY(scrollTop);
        setIsScrolled(scrollTop > 30); // Trigger at 30px scroll
      }
    };

    const timer = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const container = scrollContainerRef.current;
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeTab]);

  // Calculate animation values based on scroll state
  const statsHeight = isScrolled ? 0 : 88;
  const statsOpacity = isScrolled ? 0 : 1;
  const statsScale = isScrolled ? 0.95 : 1;
  const statsTranslateY = isScrolled ? -10 : 0;
  
  // Dramatically reduced spacing for cleaner, tighter design
  const tabsMarginTop = isScrolled ? 0 : 2; // Reduced from 12px to 2px
  const tabsPaddingY = isScrolled ? 4 : 6; // Reduced from 12px/8px to 6px/4px

  // Individual stat items for staggered animation
  const statItems = [
    {
      label: 'Current Stage',
      value: getStageDisplayName(campaign.stage),
      delay: 0
    },
    {
      label: 'Budget Used',
      value: `$${campaign.spent.toLocaleString()} / $${campaign.budget.toLocaleString()}`,
      delay: 0.05
    },
    {
      label: 'Platforms',
      value: `${campaign.platforms.length} Active`,
      delay: 0.1
    },
    {
      label: 'Team Members',
      value: `${campaign.assignedMembers.length} Assigned`,
      delay: 0.15
    },
    {
      label: 'External Ads',
      value: `${campaign.linkedExternalCampaigns.length} Linked`,
      delay: 0.2,
      hasExtra: campaign.autoLinkedCount > 0
    },
    {
      label: 'Last Updated',
      value: new Date(campaign.lastUpdated).toLocaleDateString(),
      delay: 0.25
    }
  ];

  return (
    <TooltipProvider>
      <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        
        {/* Fixed Height Campaign Header - No Changes to Name/Description */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="glass-header border-b border-white/10 z-50 flex-shrink-0 px-6 py-4"
        >
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="sidebar-button"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <div className="overflow-hidden flex-1">
                {/* Campaign Name and Description - NO CHANGES */}
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold truncate">
                    {campaign.name}
                  </h1>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${getCampaignStatusColor(campaign.status)}`} />
                    <span className="text-base font-medium">{campaign.status}</span>
                  </div>
                  
                  <Badge variant="outline" className="glass-card border-0 bg-white/5 text-sm">
                    {campaign.type}
                  </Badge>
                </div>
                
                {/* Campaign Description - ALWAYS VISIBLE */}
                <div className="mt-2">
                  <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
                    {campaign.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Optimized Layout on Scroll */}
            <motion.div 
              className="flex items-center gap-4"
              animate={{
                gap: isScrolled ? "12px" : "16px"
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Progress Display */}
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Progress</div>
                <div className="text-sm font-semibold">{campaign.progress}%</div>
              </div>
              <div className="w-20">
                <Progress value={campaign.progress} className="h-2" />
              </div>
              
              {/* Compact Date Layout - Squeezed when scrolled */}
              <motion.div 
                className="flex items-center gap-2"
                animate={{
                  scale: isScrolled ? 0.9 : 1,
                  gap: isScrolled ? "8px" : "12px"
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <DateHighlight 
                  date={campaign.startDate}
                  label="Start"
                  isStart={true}
                  className={isScrolled ? "scale-90" : ""}
                />
                <motion.div 
                  className="bg-gradient-to-r from-green-500/30 to-blue-500/30"
                  animate={{
                    width: isScrolled ? "16px" : "24px",
                    height: "1px"
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <DateHighlight 
                  date={campaign.endDate}
                  label="End"
                  isStart={false}
                  className={isScrolled ? "scale-90" : ""}
                />
              </motion.div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPDF}
                  className="glass-card border-0 bg-white/5 hover:bg-white/10 transition-all duration-200"
                  title="Download Campaign Report PDF"
                >
                  {isDownloadingPDF ? (
                    <LoadingSpinner size="sm" color="primary" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="ml-2">Download</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLinkExternalAds}
                  className="glass-card border-0 bg-white/5 hover:bg-white/10 transition-all duration-200"
                  title="Link External Ad Campaigns"
                >
                  <Link className="w-4 h-4" />
                  <span className="ml-2">Link Ads</span>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                      <MoreHorizontal className="w-4 h-4" />
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
            </motion.div>
          </div>
        </motion.header>

        {/* Enhanced Campaign Stats - Smooth Folding Animation with Reduced Bottom Padding */}
        <motion.div
          className="border-b border-white/5 px-6 flex-shrink-0 overflow-hidden"
          animate={{
            height: `${statsHeight}px`,
            opacity: statsOpacity
          }}
          transition={{ 
            duration: 0.4, 
            ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic bezier for smooth spring-like motion
          }}
        >
          <motion.div
            className="pt-4 pb-2" // Reduced bottom padding from pb-4 to pb-2 for tighter spacing
            animate={{
              scale: statsScale,
              y: statsTranslateY
            }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <div className="grid grid-cols-6 gap-6">
              {statItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: isScrolled ? 0 : 1, 
                    y: isScrolled ? 10 : 0 
                  }}
                  transition={{ 
                    duration: 0.3,
                    delay: isScrolled ? 0 : item.delay,
                    ease: "easeOut"
                  }}
                >
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="font-semibold text-sm leading-tight flex items-center justify-center gap-1">
                    {item.value}
                    {item.hasExtra && (
                      <Badge variant="outline" className="text-xs px-1 py-0 bg-green-500/10 text-green-400 border-green-500/20 scale-75">
                        Auto
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Ultra-Tight Tab Navigation - Minimal Spacing for Clean Design */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <motion.div
            className="flex-shrink-0 flex justify-center px-6 z-40 border-b border-white/5"
            animate={{
              marginTop: `${tabsMarginTop}px`, // Minimal 2px margin
              paddingTop: `${tabsPaddingY}px`, // Minimal padding
              paddingBottom: `${tabsPaddingY}px`
            }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <TabsList className="glass-card bg-white/5">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2 text-base"
              >
                <Target className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="timeline"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 text-base"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
              <TabsTrigger 
                value="audience"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white px-4 py-2 text-base"
              >
                <Users className="w-4 h-4 mr-2" />
                Audience
              </TabsTrigger>
              <TabsTrigger 
                value="budget"
                className="data-[state=active]:bg-orange-600 data-[state=active]:text-white px-4 py-2 text-base"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Budget
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-pink-600 data-[state=active]:text-white px-4 py-2 text-base"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="files"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-4 py-2 text-base"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Files
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Maximized Tab Content - More Space Available */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide campaign-content scroll-smooth"
          >
            <TabsContent key="overview-tab" value="overview" className="m-0" style={{ padding: "24px" }}>
              <CampaignOverviewTab campaign={campaign} />
            </TabsContent>
            
            <TabsContent key="timeline-tab" value="timeline" className="m-0" style={{ padding: "24px" }}>
              <CampaignTimelineTasksTab campaign={campaign} />
            </TabsContent>
            
            <TabsContent key="audience-tab" value="audience" className="m-0" style={{ padding: "24px" }}>
              <CampaignAudienceMessagingTab campaign={campaign} />
            </TabsContent>
            
            <TabsContent key="budget-tab" value="budget" className="m-0" style={{ padding: "24px" }}>
              <CampaignBudgetTab campaign={campaign} />
            </TabsContent>
            
            <TabsContent key="analytics-tab" value="analytics" className="m-0" style={{ padding: "24px" }}>
              <CampaignAnalyticsTab campaign={campaign} />
            </TabsContent>
            
            <TabsContent key="files-tab" value="files" className="m-0" style={{ padding: "24px" }}>
              <CampaignFilesApprovalsTab campaign={campaign} />
            </TabsContent>
          </div>
        </Tabs>

        {/* Link External Ads Dialog - FIXED PROPS */}
        {isLinkAdsDialogOpen && (
          <LinkExternalAdsDialog
            isOpen={isLinkAdsDialogOpen}
            onClose={() => setIsLinkAdsDialogOpen(false)}
            campaign={campaign}
            availableExternalCampaigns={unlinkedExternalCampaigns}
            onExternalCampaignsLinked={onExternalCampaignsLinked}
          />
        )}
      </div>
    </TooltipProvider>
  );
}