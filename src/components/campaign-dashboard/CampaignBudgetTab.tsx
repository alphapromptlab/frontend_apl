import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Plus,
  Edit3,
  PieChart,
  BarChart3,
  Users,
  Globe,
  Smartphone,
  Tv,
  Mail
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Campaign {
  id: string;
  name: string;
  budget: number;
  spent: number;
  platforms: string[];
}

// Mock budget data
const mockBudgetAllocation = {
  channels: [
    { name: 'Social Media', allocated: 15000, spent: 12750, remaining: 2250, performance: 'good' },
    { name: 'Paid Search', allocated: 20000, spent: 18500, remaining: 1500, performance: 'excellent' },
    { name: 'Display Ads', allocated: 8000, spent: 7200, remaining: 800, performance: 'average' },
    { name: 'Email Marketing', allocated: 3000, spent: 2400, remaining: 600, performance: 'good' },
    { name: 'Content Creation', allocated: 4000, spent: 4200, remaining: -200, performance: 'over' }
  ],
  resources: [
    { category: 'Creative Production', allocated: 12000, spent: 10800, items: ['Design', 'Video', 'Copy'] },
    { category: 'Media Buying', allocated: 28000, spent: 26100, items: ['Google Ads', 'Facebook', 'LinkedIn'] },
    { category: 'Tools & Software', allocated: 2000, spent: 1800, items: ['Analytics', 'Design Tools', 'Automation'] },
    { category: 'Team & Contractors', allocated: 8000, spent: 6500, items: ['Freelancers', 'Agencies', 'Consultants'] }
  ]
};

export function CampaignBudgetTab({ campaign }: { campaign: Campaign }) {
  const [viewMode, setViewMode] = useState<'channels' | 'resources' | 'timeline'>('channels');
  const [timeframe, setTimeframe] = useState('month');

  const totalAllocated = mockBudgetAllocation.channels.reduce((sum, channel) => sum + channel.allocated, 0);
  const totalSpent = mockBudgetAllocation.channels.reduce((sum, channel) => sum + channel.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const spentPercentage = (totalSpent / totalAllocated) * 100;

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-400 bg-green-500/10';
      case 'good': return 'text-blue-400 bg-blue-500/10';
      case 'average': return 'text-yellow-400 bg-yellow-500/10';
      case 'over': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getChannelIcon = (channelName: string) => {
    switch (channelName.toLowerCase()) {
      case 'social media': return Users;
      case 'paid search': return Globe;
      case 'display ads': return Tv;
      case 'email marketing': return Mail;
      default: return BarChart3;
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Budget Management</h2>
            <p className="text-muted-foreground">Track spending and resource allocation across channels</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32 glass-card border-0 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/90">
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              Add Budget Line
            </Button>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card border-0 p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-blue-400" />
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">On Track</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">${totalAllocated.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Allocated</div>
            </div>
          </Card>

          <Card className="glass-card border-0 p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="text-xs text-muted-foreground">{spentPercentage.toFixed(1)}%</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
              <Progress value={spentPercentage} className="h-2" />
            </div>
          </Card>

          <Card className="glass-card border-0 p-6">
            <div className="flex items-center justify-between mb-4">
              <PieChart className="w-8 h-8 text-purple-400" />
              <div className="flex items-center gap-1 text-green-400">
                <span className="text-sm">{((totalRemaining / totalAllocated) * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">${totalRemaining.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
          </Card>

          <Card className="glass-card border-0 p-6">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-orange-400" />
              <div className="flex items-center gap-1 text-blue-400">
                <span className="text-sm">85% Eff.</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">$68.50</div>
              <div className="text-sm text-muted-foreground">Cost Per Lead</div>
            </div>
          </Card>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'channels' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('channels')}
            className={viewMode === 'channels' ? 'bg-purple-600 text-white' : 'glass-card border-0 bg-white/5 hover:bg-white/10'}
          >
            Channel Breakdown
          </Button>
          <Button
            variant={viewMode === 'resources' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('resources')}
            className={viewMode === 'resources' ? 'bg-purple-600 text-white' : 'glass-card border-0 bg-white/5 hover:bg-white/10'}
          >
            Resource Allocation
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            className={viewMode === 'timeline' ? 'bg-purple-600 text-white' : 'glass-card border-0 bg-white/5 hover:bg-white/10'}
          >
            Timeline View
          </Button>
        </div>

        {/* Channel Breakdown */}
        {viewMode === 'channels' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Channel Budget Breakdown</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channel List */}
              <div className="space-y-4">
                {mockBudgetAllocation.channels.map((channel) => {
                  const Icon = getChannelIcon(channel.name);
                  const spentPercentage = (channel.spent / channel.allocated) * 100;
                  
                  return (
                    <Card key={channel.name} className="glass-card border-0 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-purple-400" />
                          <div>
                            <h4 className="font-medium">{channel.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              ${channel.spent.toLocaleString()} / ${channel.allocated.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getPerformanceColor(channel.performance)} border-0 text-xs`}>
                            {channel.performance === 'over' ? 'Over Budget' : channel.performance}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span>{spentPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress 
                          value={Math.min(spentPercentage, 100)} 
                          className={`h-2 ${spentPercentage > 100 ? 'bg-red-500/20' : ''}`} 
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Remaining: ${channel.remaining.toLocaleString()}</span>
                          <span>{channel.remaining < 0 ? 'Over by' : 'Under by'} ${Math.abs(channel.remaining).toLocaleString()}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Budget Visualization */}
              <Card className="glass-card border-0 p-6">
                <h4 className="font-semibold mb-4">Budget Distribution</h4>
                <div className="space-y-4">
                  {mockBudgetAllocation.channels.map((channel, index) => {
                    const percentage = (channel.allocated / totalAllocated) * 100;
                    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
                    
                    return (
                      <div key={channel.name} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                        <div className="flex-1 flex justify-between text-sm">
                          <span>{channel.name}</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Resource Allocation */}
        {viewMode === 'resources' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resource Allocation</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockBudgetAllocation.resources.map((resource) => {
                const spentPercentage = (resource.spent / resource.allocated) * 100;
                
                return (
                  <Card key={resource.category} className="glass-card border-0 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{resource.category}</h4>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Budget Utilization</span>
                        <span>{spentPercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={spentPercentage} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Allocated: ${resource.allocated.toLocaleString()}</span>
                        <span>Spent: ${resource.spent.toLocaleString()}</span>
                      </div>
                      
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-sm text-muted-foreground mb-2">Includes:</p>
                        <div className="flex flex-wrap gap-1">
                          {resource.items.map((item) => (
                            <Badge key={item} variant="outline" className="text-xs glass-card border-0 bg-white/5">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <Card className="glass-card border-0 p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Timeline</h3>
            <div className="space-y-4">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                <p>Timeline budget visualization coming soon</p>
                <p className="text-sm">Track spending patterns over time</p>
              </div>
            </div>
          </Card>
        )}

        {/* Budget Alerts */}
        <Card className="glass-card border-0 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Budget Alerts
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Content Creation over budget</p>
                <p className="text-xs text-muted-foreground">Exceeded allocated budget by $200</p>
              </div>
              <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                Adjust
              </Button>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <div className="flex-1">
                <p className="text-sm font-medium">Paid Search approaching limit</p>
                <p className="text-xs text-muted-foreground">92.5% of budget used with 8 days remaining</p>
              </div>
              <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                Review
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}