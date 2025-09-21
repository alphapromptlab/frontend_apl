import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, DollarSign, TrendingUp, Eye, MousePointer, Heart, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { budgetCategories, kpiData, type Campaign } from './constants';

export function CampaignMetricsTab({ campaign }: { campaign: Campaign }) {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const budgetUsed = (campaign.spent / campaign.budget) * 100;

  const iconMap = {
    Eye, MousePointer, Heart, TrendingUp
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
            <h2 className="text-xl font-semibold">Metrics & Budget</h2>
            <p className="text-muted-foreground">Track campaign performance and budget allocation</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32 glass-card border-0 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/90">
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Budget Overview */}
        <Card className="glass-card border-0 p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            Budget Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <div className="text-2xl font-bold text-white mb-1">${campaign.budget.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Budget</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400 mb-1">${campaign.spent.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Spent</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-xl border border-green-500/20">
              <div className="text-2xl font-bold text-green-400 mb-1">${(campaign.budget - campaign.spent).toLocaleString()}</div>
              <div className="text-sm text-gray-400">Remaining</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-xl border border-orange-500/20">
              <div className="text-2xl font-bold text-white mb-1">{budgetUsed.toFixed(1)}%</div>
              <div className="text-sm text-gray-400">Usage</div>
            </div>
          </div>
          
          <div className="space-y-4">
            {budgetCategories.map((category) => {
              const usage = (category.spent / category.allocated) * 100;
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span>${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}</span>
                  </div>
                  <Progress value={usage} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>

        {/* KPIs */}
        <Card className="glass-card border-0 p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Key Performance Indicators
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => {
              const IconComponent = iconMap[kpi.icon as keyof typeof iconMap];
              const colors = [
                'from-blue-500/20 to-cyan-500/10 border-blue-500/20',
                'from-green-500/20 to-emerald-500/10 border-green-500/20',
                'from-purple-500/20 to-pink-500/10 border-purple-500/20',
                'from-orange-500/20 to-red-500/10 border-orange-500/20'
              ];
              
              return (
                <div key={kpi.label} className={`text-center p-6 bg-gradient-to-br ${colors[index]} rounded-xl border`}>
                  <IconComponent className="w-8 h-8 text-white mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
                  <div className="text-sm text-gray-400 mb-1">{kpi.label}</div>
                  <div className="text-xs text-green-400">{kpi.change} vs last period</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="glass-card border-0 p-6">
          <h3 className="text-lg font-semibold mb-4">AI Analysis</h3>
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-4 border border-purple-500/20">
            <p className="text-sm text-gray-300 mb-2">
              <strong>Top Insight:</strong> Instagram Reels are driving 3.2x higher engagement than static posts. 
              Consider reallocating 15% of your static content budget to video content.
            </p>
            <p className="text-xs text-purple-400">
              Budget optimization could increase ROI by an estimated 12-18%
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}