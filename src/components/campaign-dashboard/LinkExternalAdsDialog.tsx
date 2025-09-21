import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search,
  Check,
  X,
  ExternalLink,
  Link,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { LoadingSpinner } from '../ui/loading-spinner';
import { toast } from 'sonner@2.0.3';

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
  uniqueId: string;
  linkedExternalCampaigns: ExternalCampaign[];
}

interface LinkExternalAdsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
  availableExternalCampaigns: ExternalCampaign[];
  onExternalCampaignsLinked: (campaignId: string, linkedCampaigns: ExternalCampaign[]) => void;
}

const platformIcons = {
  meta: '🔵', // Facebook/Meta
  google: '🟢', // Google
  linkedin: '🔷', // LinkedIn
  youtube: '🔴', // YouTube
  twitter: '⚫' // Twitter/X
};

const platformColors = {
  meta: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  google: 'bg-green-500/10 text-green-400 border-green-500/20',
  linkedin: 'bg-blue-600/10 text-blue-300 border-blue-600/20',
  youtube: 'bg-red-500/10 text-red-400 border-red-500/20',
  twitter: 'bg-gray-500/10 text-gray-400 border-gray-500/20'
};

export function LinkExternalAdsDialog({ 
  isOpen, 
  onClose, 
  campaign, 
  availableExternalCampaigns, 
  onExternalCampaignsLinked 
}: LinkExternalAdsDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [isLinking, setIsLinking] = useState(false);

  const filteredCampaigns = availableExternalCampaigns.filter(extCampaign =>
    extCampaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    extCampaign.platformName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCampaignToggle = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId)
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleAddExternalAds = async () => {
    if (!campaign || selectedCampaigns.length === 0) return;

    setIsLinking(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const campaignsToLink = availableExternalCampaigns.filter(extCampaign =>
      selectedCampaigns.includes(extCampaign.id)
    ).map(extCampaign => ({
      ...extCampaign,
      linkedDate: new Date().toISOString()
    }));

    onExternalCampaignsLinked(campaign.id, campaignsToLink);
    
    setIsLinking(false);
    setSelectedCampaigns([]);
    onClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedCampaigns([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-0 bg-black/90 max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
                <Link className="w-6 h-6 text-purple-400" />
                Link External Ad Campaigns
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Connect existing ad campaigns from your connected platforms to track unified performance data.
                {campaign && (
                  <span className="block mt-1">
                    Linking to: <span className="font-medium text-foreground">{campaign.name}</span> 
                    <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-400 border-purple-500/20">
                      {campaign.uniqueId}
                    </Badge>
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden gap-6">
          {/* Search Bar */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns by name or platform..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-card border-0 bg-white/5"
            />
          </div>

          {/* Available Campaigns List - Scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {filteredCampaigns.length > 0 ? (
              <div className="space-y-3 pr-2">
                {filteredCampaigns.map((extCampaign, index) => (
                  <motion.div
                    key={extCampaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`glass-card border-0 p-4 cursor-pointer transition-all duration-200 ${
                        selectedCampaigns.includes(extCampaign.id) 
                          ? 'bg-purple-500/20 border-purple-500/50 ring-1 ring-purple-500/30' 
                          : 'hover:bg-white/10'
                      }`}
                      onClick={() => handleCampaignToggle(extCampaign.id)}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedCampaigns.includes(extCampaign.id)}
                          onChange={() => handleCampaignToggle(extCampaign.id)}
                          className="flex-shrink-0"
                        />

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-2xl">{platformIcons[extCampaign.platform]}</div>
                          <Badge 
                            variant="outline" 
                            className={`${platformColors[extCampaign.platform]} border-0 text-xs`}
                          >
                            {extCampaign.platformName}
                          </Badge>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-foreground truncate">
                              {extCampaign.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Started: {new Date(extCampaign.startDate).toLocaleDateString()}</span>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              <span>{extCampaign.spend.toLocaleString()} {extCampaign.currency}</span>
                            </div>
                          </div>
                        </div>

                        {selectedCampaigns.includes(extCampaign.id) && (
                          <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <ExternalLink className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery ? 'No campaigns found' : 'No available campaigns'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms or check if campaigns are already linked'
                      : 'All available external campaigns have already been linked to campaigns'
                    }
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery('')}
                      className="glass-card border-0 bg-white/5 hover:bg-white/10"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Selection Summary */}
          {selectedCampaigns.length > 0 && (
            <div className="glass-card border-0 p-4 bg-purple-500/10 border-purple-500/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">
                    {selectedCampaigns.length} campaign{selectedCampaigns.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCampaigns([])}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}

          {/* Actions - Always visible */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-shrink-0">
            <Button
              onClick={handleClose}
              variant="outline"
              size="lg"
              className="glass-card border-0 bg-white/5 hover:bg-white/10 min-w-[120px] h-12"
            >
              <X className="w-5 h-5 mr-2" />
              Close
            </Button>
            
            <Button
              onClick={handleAddExternalAds}
              disabled={selectedCampaigns.length === 0 || isLinking}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 min-w-[240px] h-12"
            >
              {isLinking ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Adding External Ads...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  <span>
                    Add External Ads {selectedCampaigns.length > 0 ? `(${selectedCampaigns.length})` : ''}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}