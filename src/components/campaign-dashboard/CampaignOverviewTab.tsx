import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus,
  Phone,
  QrCode,
  MapPin,
  FileText,
  PieChart,
  BarChart3,
  Info
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  budget: number;
  spent: number;
  smartGoals?: Array<{
    id: string;
    objective: string;
    metric: string;
    target: number;
    current?: number;
    timeframe: string;
    status: 'Not Started' | 'In Progress' | 'Achieved' | 'Behind';
  }>;
  stage: string;
  // Offline metrics
  offlineMetrics?: {
    callsReceived?: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
    promoCodeRedemptions?: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
    footTraffic?: { value: number; baseline: number; change: number; trend: 'up' | 'down' | 'neutral' };
    surveyMentions?: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  };
}

// Mock SMART goals data
const mockSmartGoals = [
  {
    id: '1',
    objective: 'Increase Website Traffic',
    metric: 'Organic Sessions',
    target: 25000,
    current: 18750,
    timeframe: 'Q3 2024',
    status: 'In Progress' as const
  },
  {
    id: '2',
    objective: 'Generate Qualified Leads',
    metric: 'MQLs',
    target: 500,
    current: 425,
    timeframe: 'Q3 2024',
    status: 'In Progress' as const
  },
  {
    id: '3',
    objective: 'Improve Brand Awareness',
    metric: 'Brand Mentions',
    target: 1000,
    current: 1200,
    timeframe: 'Q3 2024',
    status: 'Achieved' as const
  },
  {
    id: '4',
    objective: 'Boost Engagement Rate',
    metric: 'Avg. Engagement Rate',
    target: 6.5,
    current: 4.2,
    timeframe: 'Q3 2024',
    status: 'Behind' as const
  }
];

// Mock timeline milestones
const mockMilestones = [
  { id: '1', title: 'Campaign Kickoff', date: '2024-08-01', status: 'completed' },
  { id: '2', title: 'Creative Assets Complete', date: '2024-08-15', status: 'in-progress' },
  { id: '3', title: 'Campaign Launch', date: '2024-08-20', status: 'upcoming' },
  { id: '4', title: 'Mid-Campaign Review', date: '2024-09-10', status: 'upcoming' },
  { id: '5', title: 'Campaign End', date: '2024-09-30', status: 'upcoming' }
];

// Mock Marketing Mix Modeling data
const mockMMM = [
  { id: 'tv', channel: 'TV', roi: 3.2, spend: 45000, color: 'bg-blue-500' },
  { id: 'radio', channel: 'Radio', roi: 2.8, spend: 25000, color: 'bg-green-500' },
  { id: 'digital', channel: 'Digital', roi: 4.1, spend: 35000, color: 'bg-purple-500' },
  { id: 'direct-mail', channel: 'Direct Mail', roi: 2.1, spend: 15000, color: 'bg-orange-500' },
  { id: 'print', channel: 'Print', roi: 1.8, spend: 10000, color: 'bg-red-500' }
];

// Default offline metrics with proper structure
const defaultOfflineMetrics = {
  callsReceived: { value: 247, change: 15.3, trend: 'up' as const },
  promoCodeRedemptions: { value: 189, change: 8.7, trend: 'up' as const },
  footTraffic: { value: 1450, baseline: 1200, change: 20.8, trend: 'up' as const },
  surveyMentions: { value: 78, change: -5.2, trend: 'down' as const }
};

export function CampaignOverviewTab({ campaign }: { campaign: Campaign }) {
  const smartGoals = campaign.smartGoals || mockSmartGoals;
  
  // Calculate digital KPI metrics
  const leadGoalProgress = smartGoals.find(g => g.metric === 'MQLs');
  const costPerLead = leadGoalProgress ? (campaign.spent / (leadGoalProgress.current || 1)) : 0;
  const engagementGoal = smartGoals.find(g => g.metric === 'Avg. Engagement Rate');
  const roi = ((campaign.budget - campaign.spent) / campaign.spent) * 100;

  // Safely get offline metrics with defaults
  const offlineMetrics = {
    callsReceived: campaign.offlineMetrics?.callsReceived || defaultOfflineMetrics.callsReceived,
    promoCodeRedemptions: campaign.offlineMetrics?.promoCodeRedemptions || defaultOfflineMetrics.promoCodeRedemptions,
    footTraffic: campaign.offlineMetrics?.footTraffic || defaultOfflineMetrics.footTraffic,
    surveyMentions: campaign.offlineMetrics?.surveyMentions || defaultOfflineMetrics.surveyMentions
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Achieved': return 'text-green-400 bg-green-500/10';
      case 'In Progress': return 'text-blue-400 bg-blue-500/10';
      case 'Behind': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Achieved': return CheckCircle;
      case 'In Progress': return Clock;
      case 'Behind': return AlertTriangle;
      default: return Minus;
    }
  };

  const getMilestoneColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'upcoming': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getTrendIcon = (trend: string | undefined) => {
    switch (trend) {
      case 'up': return ArrowUp;
      case 'down': return ArrowDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string | undefined) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Campaign Overview</h2>
          <p className="text-muted-foreground">Key metrics, goals progress, and campaign timeline across all channels</p>
        </div>

        {/* Digital KPI Cards */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Digital Performance</h3>
            <Badge variant="outline" className="glass-card border-0 bg-blue-500/10 text-blue-400">
              Online Channels
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Lead Goal Progress */}
            <Card className="glass-card border-0 p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-blue-400" />
                <div className="flex items-center gap-1 text-green-400">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm">12.5%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {leadGoalProgress?.current || 0} / {leadGoalProgress?.target || 0}
                </div>
                <div className="text-sm text-muted-foreground">Lead Goal Progress</div>
                <Progress 
                  value={leadGoalProgress ? (leadGoalProgress.current! / leadGoalProgress.target) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </Card>

            {/* Cost Per Lead */}
            <Card className="glass-card border-0 p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-green-400" />
                <div className="flex items-center gap-1 text-red-400">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm">5.2%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">${costPerLead.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Cost Per Lead</div>
                <div className="text-xs text-muted-foreground">Target: $75.00</div>
              </div>
            </Card>

            {/* Engagement Rate */}
            <Card className="glass-card border-0 p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-purple-400" />
                <div className="flex items-center gap-1 text-red-400">
                  <ArrowDown className="w-4 h-4" />
                  <span className="text-sm">2.1%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {engagementGoal?.current || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Engagement Rate</div>
                <div className="text-xs text-muted-foreground">
                  Target: {engagementGoal?.target || 0}%
                </div>
              </div>
            </Card>

            {/* ROI */}
            <Card className="glass-card border-0 p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-orange-400" />
                <div className="flex items-center gap-1 text-green-400">
                  <ArrowUp className="w-4 h-4" />
                  <span className="text-sm">8.7%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{roi.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">ROI</div>
                <div className="text-xs text-muted-foreground">Target: 150%</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Offline KPI Cards */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold">Offline Performance</h3>
            <Badge variant="outline" className="glass-card border-0 bg-purple-500/10 text-purple-400">
              Offline Channels
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Calls Received */}
            <Card className="glass-card border-0 p-6 hover:bg-purple-500/5 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <Phone className="w-8 h-8 text-purple-400" />
                <div className={`flex items-center gap-1 text-xs ${getTrendColor(offlineMetrics.callsReceived.trend)}`}>
                  {(() => {
                    const TrendIcon = getTrendIcon(offlineMetrics.callsReceived.trend);
                    return <TrendIcon className="w-3 h-3" />;
                  })()}
                  <span>{Math.abs(offlineMetrics.callsReceived.change || 0)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{offlineMetrics.callsReceived.value || 0}</div>
                <div className="text-sm text-muted-foreground">Calls Received</div>
                <div className="text-xs text-muted-foreground">This month</div>
              </div>
              <div className="mt-2 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view call logs →
              </div>
            </Card>

            {/* Promo Code Redemptions */}
            <Card className="glass-card border-0 p-6 hover:bg-purple-500/5 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <QrCode className="w-8 h-8 text-purple-400" />
                <div className={`flex items-center gap-1 text-xs ${getTrendColor(offlineMetrics.promoCodeRedemptions.trend)}`}>
                  {(() => {
                    const TrendIcon = getTrendIcon(offlineMetrics.promoCodeRedemptions.trend);
                    return <TrendIcon className="w-3 h-3" />;
                  })()}
                  <span>{Math.abs(offlineMetrics.promoCodeRedemptions.change || 0)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{offlineMetrics.promoCodeRedemptions.value || 0}</div>
                <div className="text-sm text-muted-foreground">Promo Code Redemptions</div>
                <div className="text-xs text-muted-foreground">All codes combined</div>
              </div>
              <div className="mt-2 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view by code →
              </div>
            </Card>

            {/* Foot Traffic vs Baseline */}
            <Card className="glass-card border-0 p-6 hover:bg-purple-500/5 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <MapPin className="w-8 h-8 text-purple-400" />
                <div className={`flex items-center gap-1 text-xs ${getTrendColor(offlineMetrics.footTraffic.trend)}`}>
                  {(() => {
                    const TrendIcon = getTrendIcon(offlineMetrics.footTraffic.trend);
                    return <TrendIcon className="w-3 h-3" />;
                  })()}
                  <span>{Math.abs(offlineMetrics.footTraffic.change || 0)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{offlineMetrics.footTraffic.value || 0}</div>
                <div className="text-sm text-muted-foreground">Foot Traffic vs Baseline</div>
                <div className="text-xs text-muted-foreground">
                  Baseline: {offlineMetrics.footTraffic.baseline || 0}
                </div>
              </div>
              <div className="mt-2 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view by location →
              </div>
            </Card>

            {/* Survey Mentions */}
            <Card className="glass-card border-0 p-6 hover:bg-purple-500/5 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-purple-400" />
                <div className={`flex items-center gap-1 text-xs ${getTrendColor(offlineMetrics.surveyMentions.trend)}`}>
                  {(() => {
                    const TrendIcon = getTrendIcon(offlineMetrics.surveyMentions.trend);
                    return <TrendIcon className="w-3 h-3" />;
                  })()}
                  <span>{Math.abs(offlineMetrics.surveyMentions.change || 0)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{offlineMetrics.surveyMentions.value || 0}</div>
                <div className="text-sm text-muted-foreground">Survey Mentions</div>
                <div className="text-xs text-muted-foreground">"How did you hear about us?"</div>
              </div>
              <div className="mt-2 text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to view responses →
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SMART Goals Progress */}
          <Card className="glass-card border-0 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">SMART Goals Progress</h3>
              <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                Edit Goals
              </Button>
            </div>
            
            <div className="space-y-4">
              {smartGoals.map((goal) => {
                const StatusIcon = getStatusIcon(goal.status);
                const progress = goal.current ? (goal.current / goal.target) * 100 : 0;
                
                return (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{goal.objective}</h4>
                          <Badge className={`${getStatusColor(goal.status)} border-0 text-xs`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {goal.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {goal.metric}: {goal.current?.toLocaleString() || 0} / {goal.target.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">{goal.timeframe}</div>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-muted-foreground text-right">
                      {progress.toFixed(1)}% complete
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Marketing Mix Modeling */}
          <Card className="glass-card border-0 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Marketing Mix Modeling</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="glass-card border-0 bg-black/90">
                      <p className="text-sm">Statistical analysis showing estimated ROI contribution by channel</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                View Details
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockMMM.map((channel) => (
                <div key={channel.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${channel.color}`} />
                      <span className="font-medium">{channel.channel}</span>
                    </div>
                    <div className="text-sm font-semibold">{channel.roi.toFixed(1)}x ROI</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${channel.color}`}
                        style={{ width: `${(channel.spend / 50000) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      ${(channel.spend / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Attribution:</span>
                <span className="font-semibold">2.8x Blended ROI</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Mini Timeline */}
        <Card className="glass-card border-0 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Campaign Timeline</h3>
            <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              <Calendar className="w-4 h-4 mr-2" />
              View Full Timeline
            </Button>
          </div>
          
          <div className="space-y-4">
            {mockMilestones.map((milestone, index) => (
              <div key={milestone.id} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${getMilestoneColor(milestone.status)}`} />
                  {index < mockMilestones.length - 1 && (
                    <div className="w-px h-8 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{milestone.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(milestone.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    milestone.status === 'completed' ? 'border-green-500 text-green-400' :
                    milestone.status === 'in-progress' ? 'border-blue-500 text-blue-400' :
                    'border-gray-500 text-gray-400'
                  }`}
                >
                  {milestone.status === 'completed' ? 'Done' :
                   milestone.status === 'in-progress' ? 'Active' : 'Upcoming'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Campaign Objectives Summary */}
        <Card className="glass-card border-0 p-6">
          <h3 className="text-lg font-semibold mb-4">Campaign Objectives Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-400">Primary Objective</h4>
              <p className="text-sm text-muted-foreground">
                Increase brand awareness and generate qualified leads through integrated digital and offline marketing campaign
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-purple-400">Target Audience</h4>
              <p className="text-sm text-muted-foreground">
                Tech-savvy professionals aged 25-40, reached through digital platforms and traditional media touchpoints
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-400">Success Metrics</h4>
              <p className="text-sm text-muted-foreground">
                25K website sessions, 500 MQLs, 6.5% engagement rate, 200+ offline conversions, and 150% ROI within Q3 2024
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}