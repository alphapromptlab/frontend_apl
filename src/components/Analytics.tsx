import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Activity, Users, Zap, Clock, BarChart3, Calendar, Download, Target, DollarSign, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const usageData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 78 },
  { name: 'Mar', value: 90 },
  { name: 'Apr', value: 85 },
  { name: 'May', value: 95 },
  { name: 'Jun', value: 120 },
  { name: 'Jul', value: 135 }
];

const toolUsageData = [
  { name: 'Content Generator', value: 35, color: '#3B82F6' },
  { name: 'Post Generator', value: 25, color: '#8B5CF6' },
  { name: 'Research', value: 20, color: '#10B981' },
  { name: 'Campaign Planner', value: 15, color: '#F59E0B' },
  { name: 'Others', value: 5, color: '#EF4444' }
];

const performanceData = [
  { name: 'Mon', generated: 45, saved: 38 },
  { name: 'Tue', generated: 52, saved: 44 },
  { name: 'Wed', generated: 48, saved: 41 },
  { name: 'Thu', generated: 61, saved: 52 },
  { name: 'Fri', generated: 55, saved: 48 },
  { name: 'Sat', generated: 38, saved: 32 },
  { name: 'Sun', generated: 42, saved: 35 }
];

const campaignPerformanceData = [
  { name: 'Day 1', impressions: 12500, clicks: 890, conversions: 45 },
  { name: 'Day 2', impressions: 14200, clicks: 1020, conversions: 52 },
  { name: 'Day 3', impressions: 13800, clicks: 965, conversions: 48 },
  { name: 'Day 4', impressions: 15600, clicks: 1150, conversions: 61 },
  { name: 'Day 5', impressions: 16200, clicks: 1280, conversions: 68 },
  { name: 'Day 6', impressions: 11900, clicks: 825, conversions: 38 },
  { name: 'Day 7', impressions: 13100, clicks: 950, conversions: 44 }
];

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const stats = [
    {
      title: 'Total Credits Used',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Projects',
      value: '23',
      change: '+3',
      trend: 'up',
      icon: Activity,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Content Generated',
      value: '456',
      change: '+8.2%',
      trend: 'up',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Avg. Response Time',
      value: '1.2s',
      change: '-0.3s',
      trend: 'down',
      icon: Clock,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-medium">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track your AI tool usage and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card border-0 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Campaign Overview - Positioned Above Engagement Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <Card className="glass-card border-0 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Campaign Overview</h2>
              <p className="text-muted-foreground text-lg">Monitor your active marketing campaigns and performance</p>
            </div>
            <Badge variant="outline" className="glass-card border-0 bg-white/5 px-4 py-2">
              Last 7 Days
            </Badge>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Live Campaigns */}
            <motion.div 
              className="text-center p-8 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-2xl border border-green-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Target className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">3</div>
              <div className="text-base text-gray-300 mb-2">Live Campaigns</div>
              <div className="text-sm text-green-400 font-medium">+1 this week</div>
            </motion.div>

            {/* Total Budget */}
            <motion.div 
              className="text-center p-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-2xl border border-blue-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <DollarSign className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">$12.5K</div>
              <div className="text-base text-gray-300 mb-2">Active Budget</div>
              <div className="text-sm text-blue-400 font-medium">78% utilized</div>
            </motion.div>

            {/* 7-Day Performance */}
            <motion.div 
              className="text-center p-8 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-2xl border border-purple-500/20"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Eye className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">98.4K</div>
              <div className="text-base text-gray-300 mb-2">Total Impressions</div>
              <div className="text-sm text-purple-400 font-medium">+15.2% vs last week</div>
            </motion.div>
          </div>

          {/* 7-Day Performance Chart */}
          <div className="bg-gray-800/20 rounded-2xl p-6 border border-gray-700/30">
            <h3 className="text-lg font-semibold mb-6 text-white">7-Day Campaign Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.6)" fontSize={12} />
                <Line 
                  type="monotone" 
                  dataKey="impressions" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#8B5CF6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clicks" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10B981' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#F59E0B" 
                  strokeWidth={3}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#F59E0B' }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Enhanced Legend */}
            <div className="flex items-center justify-center gap-8 mt-6 pt-4 border-t border-gray-700/30">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-300 font-medium">Impressions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-300 font-medium">Clicks</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-300 font-medium">Conversions</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Engagement Over Time Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Usage Trend (Engagement Over Time) */}
        <Card className="glass-card border-0 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Engagement Over Time</h3>
            <Badge variant="outline" className="glass-card border-0 bg-white/5">
              This Month
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Tool Usage Distribution */}
        <Card className="glass-card border-0 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Tool Usage Distribution</h3>
            <Badge variant="outline" className="glass-card border-0 bg-white/5">
              All Time
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={toolUsageData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {toolUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Weekly Performance */}
        <Card className="glass-card border-0 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">Weekly Performance</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-muted-foreground">Generated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">Saved</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Bar dataKey="generated" fill="#3B82F6" />
              <Bar dataKey="saved" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Usage Summary */}
        <Card className="glass-card border-0 p-6">
          <h3 className="text-lg font-medium mb-6">Usage Summary</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Credits Used</span>
                <span className="text-sm font-medium">1,247 / 2,000</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">API Calls</span>
                <span className="text-sm font-medium">8,432</span>
              </div>
              <Progress value={84} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-medium">98.7%</span>
              </div>
              <Progress value={99} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg. Generation Time</span>
                <span className="text-sm font-medium">1.2s</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </div>
          
          <Button className="w-full mt-6 glass-card border-0 hover:bg-white/10">
            View Detailed Report
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}