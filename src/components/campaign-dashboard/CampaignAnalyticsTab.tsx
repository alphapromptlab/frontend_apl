import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  Globe,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Phone,
  QrCode,
  MapPin,
  FileText,
  Upload,
  X,
  PieChart
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Campaign {
  id: string;
  name: string;
  platforms: string[];
}

// Mock analytics data
const mockAnalytics = {
  overview: {
    impressions: { value: 2845691, change: 12.5, trend: 'up' },
    clicks: { value: 42789, change: -3.2, trend: 'down' },
    conversions: { value: 1247, change: 8.7, trend: 'up' },
    ctr: { value: 1.5, change: 0.3, trend: 'up' },
    cpc: { value: 2.34, change: -5.2, trend: 'down' },
    roas: { value: 4.2, change: 15.8, trend: 'up' }
  },
  platformPerformance: [
    { 
      platform: 'Google Ads', 
      impressions: 1245678, 
      clicks: 18745, 
      conversions: 567, 
      spend: 15420,
      roas: 4.8,
      ctr: 1.5
    },
    { 
      platform: 'Facebook', 
      impressions: 987543, 
      clicks: 14256, 
      conversions: 423, 
      spend: 12350,
      roas: 3.9,
      ctr: 1.4
    },
    { 
      platform: 'LinkedIn', 
      impressions: 456789, 
      clicks: 6789, 
      conversions: 187, 
      spend: 8750,
      roas: 3.2,
      ctr: 1.5
    },
    { 
      platform: 'Instagram', 
      impressions: 234567, 
      clicks: 2999, 
      conversions: 70, 
      spend: 4200,
      roas: 2.8,
      ctr: 1.3
    }
  ],
  offlineMetrics: {
    callsReceived: { value: 247, logs: [
      { date: '2024-08-01', phone: '+1-800-555-0101', calls: 12 },
      { date: '2024-08-02', phone: '+1-800-555-0101', calls: 8 },
      { date: '2024-08-01', phone: '+1-800-555-0102', calls: 15 },
      { date: '2024-08-02', phone: '+1-800-555-0102', calls: 11 }
    ]},
    promoCodeRedemptions: { value: 189, codes: [
      { code: 'SUMMER25', redemptions: 89, channel: 'Print Ads' },
      { code: 'RADIO15', redemptions: 56, channel: 'Radio' },
      { code: 'TV10', redemptions: 44, channel: 'TV Commercials' }
    ]},
    footTraffic: { value: 1450, baseline: 1200, locations: [
      { location: 'Downtown Store', traffic: 850, baseline: 700 },
      { location: 'Mall Location', traffic: 600, baseline: 500 }
    ]},
    surveyMentions: { value: 78, responses: [
      { source: 'Radio Ad', mentions: 32 },
      { source: 'TV Commercial', mentions: 28 },
      { source: 'Print Ad', mentions: 18 }
    ]}
  },
  crossChannelData: [
    { channel: 'Google Ads', type: 'Digital', spend: 15420, conversions: 567, roas: 4.8 },
    { channel: 'Facebook', type: 'Digital', spend: 12350, conversions: 423, roas: 3.9 },
    { channel: 'TV Commercials', type: 'Offline', spend: 25000, conversions: 145, roas: 2.9 },
    { channel: 'Radio Ads', type: 'Offline', spend: 18000, conversions: 89, roas: 2.2 },
    { channel: 'Print Ads', type: 'Offline', spend: 12000, conversions: 67, roas: 1.8 },
    { channel: 'Direct Mail', type: 'Offline', spend: 8500, conversions: 34, roas: 1.6 }
  ]
};

export function CampaignAnalyticsTab({ campaign }: { campaign: Campaign }) {
  const [timeframe, setTimeframe] = useState('7d');
  const [metric, setMetric] = useState('all');
  const [platform, setPlatform] = useState('all');
  const [crossChannelMetric, setCrossChannelMetric] = useState('spend');
  const [selectedOfflineMetric, setSelectedOfflineMetric] = useState<string | null>(null);
  const [isFileUpload, setIsFileUpload] = useState(false);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return ArrowUp;
      case 'down': return ArrowDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleOfflineMetricClick = (metric: string) => {
    setSelectedOfflineMetric(metric);
  };

  const OfflineMetricModal = ({ metric, isOpen, onClose }: { metric: string, isOpen: boolean, onClose: () => void }) => {
    const getModalData = () => {
      switch (metric) {
        case 'calls':
          return {
            title: 'Call Logs Detail',
            data: mockAnalytics.offlineMetrics.callsReceived.logs,
            columns: ['Date', 'Phone Number', 'Calls Received']
          };
        case 'promos':
          return {
            title: 'Promo Code Performance',
            data: mockAnalytics.offlineMetrics.promoCodeRedemptions.codes,
            columns: ['Code', 'Redemptions', 'Channel']
          };
        case 'traffic':
          return {
            title: 'Foot Traffic by Location',
            data: mockAnalytics.offlineMetrics.footTraffic.locations,
            columns: ['Location', 'Current Traffic', 'Baseline']
          };
        case 'surveys':
          return {
            title: 'Survey Response Breakdown',
            data: mockAnalytics.offlineMetrics.surveyMentions.responses,
            columns: ['Source', 'Mentions']
          };
        default:
          return { title: '', data: [], columns: [] };
      }
    };

    const modalData = getModalData();

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="glass-card border-0 bg-black/90 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-purple-400">{modalData.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {modalData.data.map((item: any, index: number) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {Object.values(item).map((value: any, valueIndex: number) => (
                      <div key={valueIndex}>
                        <div className="text-muted-foreground text-xs">{modalData.columns[valueIndex]}</div>
                        <div className="font-medium">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
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
            <h2 className="text-xl font-semibold">Campaign Analytics</h2>
            <p className="text-muted-foreground">Performance metrics and insights across all channels</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32 glass-card border-0 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/90">
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="digital" className="space-y-6">
          <TabsList className="glass-card border-0 bg-white/5 p-1">
            <TabsTrigger 
              value="digital"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-4 py-2"
            >
              <Globe className="w-4 h-4 mr-2" />
              Digital
            </TabsTrigger>
            <TabsTrigger 
              value="offline"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2"
            >
              <Phone className="w-4 h-4 mr-2" />
              Offline
            </TabsTrigger>
            <TabsTrigger 
              value="cross-channel"
              className="data-[state=active]:bg-orange-600 data-[state=active]:text-white px-4 py-2"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Cross-Channel
            </TabsTrigger>
          </TabsList>

          {/* Digital Analytics Tab */}
          <TabsContent value="digital" className="space-y-6">
            {/* Digital Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {Object.entries(mockAnalytics.overview).map(([key, data]) => {
                const TrendIcon = getTrendIcon(data.trend);
                const formatValue = (key: string, value: number) => {
                  switch (key) {
                    case 'impressions':
                    case 'clicks':
                    case 'conversions':
                      return value.toLocaleString();
                    case 'ctr':
                    case 'roas':
                      return `${value.toFixed(1)}${key === 'ctr' ? '%' : 'x'}`;
                    case 'cpc':
                      return `$${value.toFixed(2)}`;
                    default:
                      return value.toString();
                  }
                };

                return (
                  <Card key={key} className="glass-card border-0 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground capitalize">
                        {key === 'ctr' ? 'CTR' : key === 'cpc' ? 'CPC' : key === 'roas' ? 'ROAS' : key}
                      </div>
                      <div className={`flex items-center gap-1 text-xs ${getTrendColor(data.trend)}`}>
                        <TrendIcon className="w-3 h-3" />
                        <span>{Math.abs(data.change)}%</span>
                      </div>
                    </div>
                    <div className="text-xl font-bold">
                      {formatValue(key, data.value)}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Digital Platform Performance */}
            <Card className="glass-card border-0 p-6">
              <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
              <div className="space-y-4">
                {mockAnalytics.platformPerformance.map((platform) => (
                  <div key={platform.platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="font-medium">{platform.platform}</span>
                      </div>
                      <Badge className="text-xs glass-card border-0 bg-white/5">
                        {platform.roas.toFixed(1)}x ROAS
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Impressions</div>
                        <div className="font-medium">{platform.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Clicks</div>
                        <div className="font-medium">{platform.clicks.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Conv.</div>
                        <div className="font-medium">{platform.conversions}</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>CTR: {platform.ctr}%</span>
                      <span>Spend: ${platform.spend.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Offline Analytics Tab */}
          <TabsContent value="offline" className="space-y-6">
            {/* Offline Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card 
                className="glass-card border-0 p-6 hover:bg-purple-500/5 transition-colors cursor-pointer"
                onClick={() => handleOfflineMetricClick('calls')}
              >
                <div className="flex items-center justify-between mb-4">
                  <Phone className="w-8 h-8 text-purple-400" />
                  <div className="flex items-center gap-1 text-green-400">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm">15.3%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{mockAnalytics.offlineMetrics.callsReceived.value}</div>
                  <div className="text-sm text-muted-foreground">Calls Received</div>
                  <div className="text-xs text-purple-400">Click for call logs →</div>
                </div>
              </Card>

              <Card 
                className="glass-card border-0 p-6 hover:bg-purple-500/5 transition-colors cursor-pointer"
                onClick={() => handleOfflineMetricClick('promos')}
              >
                <div className="flex items-center justify-between mb-4">
                  <QrCode className="w-8 h-8 text-purple-400" />
                  <div className="flex items-center gap-1 text-green-400">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm">8.7%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{mockAnalytics.offlineMetrics.promoCodeRedemptions.value}</div>
                  <div className="text-sm text-muted-foreground">Promo Code Redemptions</div>
                  <div className="text-xs text-purple-400">Click for breakdown →</div>
                </div>
              </Card>

              <Card 
                className="glass-card border-0 p-6 hover:bg-purple-500/5 transition-colors cursor-pointer"
                onClick={() => handleOfflineMetricClick('traffic')}
              >
                <div className="flex items-center justify-between mb-4">
                  <MapPin className="w-8 h-8 text-purple-400" />
                  <div className="flex items-center gap-1 text-green-400">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm">20.8%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{mockAnalytics.offlineMetrics.footTraffic.value}</div>
                  <div className="text-sm text-muted-foreground">Foot Traffic vs Baseline</div>
                  <div className="text-xs text-purple-400">Click for locations →</div>
                </div>
              </Card>

              <Card 
                className="glass-card border-0 p-6 hover:bg-purple-500/5 transition-colors cursor-pointer"
                onClick={() => handleOfflineMetricClick('surveys')}
              >
                <div className="flex items-center justify-between mb-4">
                  <FileText className="w-8 h-8 text-purple-400" />
                  <div className="flex items-center gap-1 text-red-400">
                    <ArrowDown className="w-4 h-4" />
                    <span className="text-sm">5.2%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold">{mockAnalytics.offlineMetrics.surveyMentions.value}</div>
                  <div className="text-sm text-muted-foreground">Survey Mentions</div>
                  <div className="text-xs text-purple-400">Click for responses →</div>
                </div>
              </Card>
            </div>

            {/* Survey Import Section */}
            <Card className="glass-card border-0 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Survey Data Import</h3>
                <Dialog open={isFileUpload} onOpenChange={setIsFileUpload}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0">
                      <Upload className="w-4 h-4 mr-2" />
                      Import CSV
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-card border-0 bg-black/90">
                    <DialogHeader>
                      <DialogTitle className="text-purple-400">Import Survey Responses</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2">Drop CSV file here or click to browse</p>
                        <p className="text-sm text-muted-foreground">
                          File should contain responses to "How did you hear about us?" question
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="response-column">Response Column Name</Label>
                        <Input 
                          id="response-column" 
                          placeholder="e.g., 'how_did_you_hear', 'source'" 
                          className="glass-card border-0 bg-white/5"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsFileUpload(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          Import Data
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-400 mb-1">Survey Mapping Instructions</p>
                    <p className="text-sm text-muted-foreground">
                      Upload CSV files containing survey responses. Make sure to map the "How did you hear about us?" 
                      question responses to track offline attribution effectively.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Cross-Channel Analytics Tab */}
          <TabsContent value="cross-channel" className="space-y-6">
            {/* Cross-Channel Comparison */}
            <Card className="glass-card border-0 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Cross-Channel Comparison</h3>
                <Select value={crossChannelMetric} onValueChange={setCrossChannelMetric}>
                  <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-0 bg-black/90">
                    <SelectItem value="spend">Spend</SelectItem>
                    <SelectItem value="conversions">Conversions</SelectItem>
                    <SelectItem value="roas">ROAS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                {mockAnalytics.crossChannelData.map((channel, index) => {
                  const isDigital = channel.type === 'Digital';
                  const value = crossChannelMetric === 'spend' ? channel.spend : 
                               crossChannelMetric === 'conversions' ? channel.conversions : 
                               channel.roas;
                  const maxValue = Math.max(...mockAnalytics.crossChannelData.map(c => 
                    crossChannelMetric === 'spend' ? c.spend : 
                    crossChannelMetric === 'conversions' ? c.conversions : 
                    c.roas
                  ));
                  const percentage = (value / maxValue) * 100;
                  
                  return (
                    <div key={channel.channel} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              isDigital ? 'border-blue-500 text-blue-400' : 'border-purple-500 text-purple-400'
                            }`}
                          >
                            {channel.type}
                          </Badge>
                          <span className="font-medium">{channel.channel}</span>
                        </div>
                        <div className="text-sm font-semibold">
                          {crossChannelMetric === 'spend' && '$'}
                          {typeof value === 'number' ? value.toLocaleString() : value}
                          {crossChannelMetric === 'roas' && 'x'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              isDigital ? 'bg-blue-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Attribution Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card border-0 p-6">
                <h3 className="text-lg font-semibold mb-4">Channel Attribution</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-400" />
                      <span className="font-medium">Digital Channels</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">67.2%</div>
                      <div className="text-xs text-muted-foreground">of conversions</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-purple-400" />
                      <span className="font-medium">Offline Channels</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">32.8%</div>
                      <div className="text-xs text-muted-foreground">of conversions</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="glass-card border-0 p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Spend:</span>
                    <span className="font-semibold">$91,270</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Conversions:</span>
                    <span className="font-semibold">1,325</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blended ROAS:</span>
                    <span className="font-semibold">3.4x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost Per Conversion:</span>
                    <span className="font-semibold">$68.85</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Offline Metric Detail Modals */}
        {selectedOfflineMetric && (
          <OfflineMetricModal 
            metric={selectedOfflineMetric}
            isOpen={true}
            onClose={() => setSelectedOfflineMetric(null)}
          />
        )}
      </motion.div>
    </div>
  );
}