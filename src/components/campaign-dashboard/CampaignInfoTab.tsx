import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Calendar,
  Target,
  Users,
  DollarSign,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Newspaper,
  Radio,
  MapPin
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

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
}

interface CampaignInfoTabProps {
  campaign: Campaign;
}

const platformIcons = {
  'Instagram': Instagram,
  'Facebook': Facebook,
  'YouTube': Youtube,
  'Twitter': Twitter,
  'LinkedIn': Linkedin,
  'Print': Newspaper,
  'Radio': Radio,
  'PR': Globe,
  'Events': MapPin
};

const campaignGoals = [
  'Brand Awareness',
  'Lead Generation',
  'Sales & Conversions',
  'Website Traffic',
  'Engagement',
  'App Downloads',
  'Event Promotion',
  'Product Launch',
  'Customer Retention',
  'Market Research'
];

const targetAudiences = [
  'Gen Z (18-24)',
  'Millennials (25-40)',
  'Gen X (41-56)',
  'Baby Boomers (57+)',
  'Young Professionals',
  'Parents',
  'Students',
  'Small Business Owners',
  'Tech Enthusiasts',
  'Healthcare Workers'
];

export function CampaignInfoTab({ campaign }: CampaignInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: campaign.name,
    description: campaign.description,
    goal: 'Brand Awareness',
    targetAudience: 'Millennials (25-40)',
    status: campaign.status,
    type: campaign.type,
    budget: campaign.budget,
    startDate: new Date(campaign.startDate),
    endDate: new Date(campaign.endDate),
    platforms: campaign.platforms || ['Instagram', 'Facebook']
  });

  const [showCalendar, setShowCalendar] = useState<'start' | 'end' | null>(null);

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: campaign.name,
      description: campaign.description,
      goal: 'Brand Awareness',
      targetAudience: 'Millennials (25-40)',
      status: campaign.status,
      type: campaign.type,
      budget: campaign.budget,
      startDate: new Date(campaign.startDate),
      endDate: new Date(campaign.endDate),
      platforms: campaign.platforms || ['Instagram', 'Facebook']
    });
    setIsEditing(false);
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Campaign Information</h2>
            <p className="text-muted-foreground">Configure your campaign settings and details</p>
          </div>
          
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Campaign
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="glass-card border-0 bg-white/5 hover:bg-white/10"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="glass-card border-0 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Basic Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                {isEditing ? (
                  <Input
                    id="campaign-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="glass-card border-0 bg-white/5 mt-2"
                  />
                ) : (
                  <p className="mt-2 px-3 py-2 bg-white/5 rounded-lg">{formData.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="campaign-description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="campaign-description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="glass-card border-0 bg-white/5 mt-2 min-h-[100px]"
                  />
                ) : (
                  <p className="mt-2 px-3 py-2 bg-white/5 rounded-lg">{formData.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign-goal">Campaign Goal</Label>
                  {isEditing ? (
                    <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                      <SelectTrigger className="glass-card border-0 bg-white/5 mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-0 bg-black/90">
                        {campaignGoals.map((goal) => (
                          <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-2 px-3 py-2 bg-white/5 rounded-lg">{formData.goal}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="target-audience">Target Audience</Label>
                  {isEditing ? (
                    <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                      <SelectTrigger className="glass-card border-0 bg-white/5 mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-0 bg-black/90">
                        {targetAudiences.map((audience) => (
                          <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-2 px-3 py-2 bg-white/5 rounded-lg">{formData.targetAudience}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Campaign Settings */}
          <Card className="glass-card border-0 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Campaign Settings
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign-status">Status</Label>
                  {isEditing ? (
                    <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="glass-card border-0 bg-white/5 mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-0 bg-black/90">
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Paused">Paused</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className="mt-2 bg-white/10 border-0">{formData.status}</Badge>
                  )}
                </div>

                <div>
                  <Label htmlFor="campaign-type">Campaign Type</Label>
                  {isEditing ? (
                    <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger className="glass-card border-0 bg-white/5 mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-0 bg-black/90">
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Offline">Offline</SelectItem>
                        <SelectItem value="PR">PR</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className="mt-2 bg-white/10 border-0">{formData.type}</Badge>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="campaign-budget">Budget (USD)</Label>
                {isEditing ? (
                  <Input
                    id="campaign-budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                    className="glass-card border-0 bg-white/5 mt-2"
                  />
                ) : (
                  <p className="mt-2 px-3 py-2 bg-white/5 rounded-lg">${formData.budget.toLocaleString()}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  {isEditing ? (
                    <Popover open={showCalendar === 'start'} onOpenChange={(open) => setShowCalendar(open ? 'start' : null)}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="glass-card border-0 bg-white/5 mt-2 w-full justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formData.startDate.toLocaleDateString()}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="glass-card border-0 bg-black/90 p-0">
                        <CalendarComponent
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) => {
                            if (date) {
                              setFormData(prev => ({ ...prev, startDate: date }));
                              setShowCalendar(null);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <p className="mt-2 px-3 py-2 bg-white/5 rounded-lg">{formData.startDate.toLocaleDateString()}</p>
                  )}
                </div>

                <div>
                  <Label>End Date</Label>
                  {isEditing ? (
                    <Popover open={showCalendar === 'end'} onOpenChange={(open) => setShowCalendar(open ? 'end' : null)}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="glass-card border-0 bg-white/5 mt-2 w-full justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formData.endDate.toLocaleDateString()}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="glass-card border-0 bg-black/90 p-0">
                        <CalendarComponent
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) => {
                            if (date) {
                              setFormData(prev => ({ ...prev, endDate: date }));
                              setShowCalendar(null);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <p className="mt-2 px-3 py-2 bg-white/5 rounded-lg">{formData.endDate.toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Platforms */}
          <Card className="glass-card border-0 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              Platforms & Channels
            </h3>
            
            <div className="space-y-4">
              <Label>Select Platforms</Label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(platformIcons).map(([platform, Icon]) => (
                  <motion.div
                    key={platform}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={isEditing ? () => togglePlatform(platform) : undefined}
                      disabled={!isEditing}
                      className={`glass-card border-0 h-16 w-full flex flex-col items-center gap-1 ${
                        formData.platforms.includes(platform)
                          ? 'bg-purple-600/20 border-purple-500/50 ring-1 ring-purple-500/30'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{platform}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              {!isEditing && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.platforms.map((platform) => (
                    <Badge key={platform} className="bg-purple-600/20 text-purple-300 border-0">
                      {platform}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Team Members */}
          <Card className="glass-card border-0 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Assigned Team
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {campaign.assignedMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">Team Member</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {isEditing && (
                <Button variant="outline" className="glass-card border-0 bg-white/5 hover:bg-white/10 w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              )}
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}