import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar,
  DollarSign,
  Target,
  Users,
  Globe,
  Building,
  Tv,
  Radio,
  FileText,
  Mail,
  Hash,
  Info,
  Link,
  Copy,
  MapPin
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { LoadingSpinner } from '../ui/loading-spinner';
import { toast } from 'sonner@2.0.3';

interface CampaignFormData {
  // Basic Info
  name: string;
  description: string;
  type: 'Online' | 'Offline' | 'PR' | 'Hybrid';
  priority: 'High' | 'Medium' | 'Low';
  
  // Timeline
  startDate: string;
  endDate: string;
  
  // Budget
  totalBudget: number;
  digitalBudget: number;
  offlineBudget: number;
  
  // Goals
  primaryObjective: string;
  
  // Channels
  digitalChannels: string[];
  offlineChannels: string[];
  
  // External Campaign Linking
  uniqueId: string;
  shouldLinkExternalCampaigns: boolean;
}

interface CampaignCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: (campaign: any) => void;
}

const initialFormData: CampaignFormData = {
  name: '',
  description: '',
  type: 'Hybrid',
  priority: 'Medium',
  startDate: '',
  endDate: '',
  totalBudget: 0,
  digitalBudget: 0,
  offlineBudget: 0,
  primaryObjective: '',
  digitalChannels: [],
  offlineChannels: [],
  uniqueId: '',
  shouldLinkExternalCampaigns: false
};

const steps = [
  { id: 'basic', title: 'Basic Info', icon: FileText },
  { id: 'timeline', title: 'Timeline & Budget', icon: Calendar },
  { id: 'goals', title: 'Goals & Objectives', icon: Target },
  { id: 'channels', title: 'Channels', icon: Globe },
  { id: 'review', title: 'Review & Create', icon: Check }
];

const digitalChannelOptions = [
  { id: 'google-ads', name: 'Google Ads', icon: Globe },
  { id: 'facebook', name: 'Facebook', icon: Users },
  { id: 'instagram', name: 'Instagram', icon: Users },
  { id: 'linkedin', name: 'LinkedIn', icon: Building },
  { id: 'twitter', name: 'Twitter', icon: Globe },
  { id: 'email', name: 'Email Marketing', icon: Mail }
];

const offlineChannelOptions = [
  { id: 'tv', name: 'TV Commercials', icon: Tv },
  { id: 'radio', name: 'Radio Ads', icon: Radio },
  { id: 'print', name: 'Print Media', icon: FileText },
  { id: 'outdoor', name: 'Outdoor/Billboard', icon: MapPin },
  { id: 'direct-mail', name: 'Direct Mail', icon: Mail },
  { id: 'events', name: 'Events/Trade Shows', icon: Users }
];

export function CampaignCreationDialog({ isOpen, onClose, onCampaignCreated }: CampaignCreationDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CampaignFormData>(initialFormData);
  const [isCreating, setIsCreating] = useState(false);

  // Generate unique campaign ID
  const generateUniqueId = () => {
    const prefix = 'CP';
    const year = new Date().getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}-${year}${random}`;
  };

  // Initialize unique ID when dialog opens
  useState(() => {
    if (isOpen && !formData.uniqueId) {
      setFormData(prev => ({ ...prev, uniqueId: generateUniqueId() }));
    }
  });

  const updateFormData = (field: keyof CampaignFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyUniqueId = () => {
    navigator.clipboard.writeText(formData.uniqueId);
    toast.success('Campaign ID copied to clipboard!', {
      description: 'You can now paste this into your external ad campaign names'
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = async () => {
    setIsCreating(true);
    
    // Simulate campaign creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCampaign = {
      id: Date.now().toString(),
      ...formData,
      status: 'Draft',
      progress: 0,
      spent: 0,
      stage: 'intake',
      lastUpdated: new Date().toISOString(),
      platforms: [...formData.digitalChannels, ...formData.offlineChannels],
      budget: formData.totalBudget,
      assignedMembers: [
        { id: '1', name: 'You', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', initials: 'YO' }
      ],
      linkedExternalCampaigns: [],
      autoLinkedCount: 0
    };
    
    onCampaignCreated(newCampaign);
    setIsCreating(false);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    setFormData({ ...initialFormData, uniqueId: generateUniqueId() });
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return formData.name && formData.description && formData.type;
      case 1: return formData.startDate && formData.endDate && formData.totalBudget > 0;
      case 2: return formData.primaryObjective;
      case 3: return formData.digitalChannels.length > 0 || formData.offlineChannels.length > 0;
      case 4: return true;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <div className="space-y-6">
            {/* Unique Campaign ID Display */}
            <div 
              className="rounded-lg p-4 transition-colors"
              style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.2)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-purple-400">Campaign ID</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-purple-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-xs">
                            Include this code in the name, label or tag of any ad you launch for automatic linking.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-lg text-purple-400 font-semibold">{formData.uniqueId}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyUniqueId}
                        className="h-6 px-2 text-purple-400 hover:text-purple-300"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateFormData('shouldLinkExternalCampaigns', true)}
                  className="text-white"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Link Existing Ads
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name" className="text-white">Campaign Name *</Label>
                <Input
                  id="campaign-name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Summer Product Launch 2024"
                  className="text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-description" className="text-white">Description *</Label>
                <Textarea
                  id="campaign-description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Multi-channel campaign targeting new customer acquisition..."
                  className="min-h-[100px] text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-white">Campaign Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                    <SelectTrigger className="text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online Only</SelectItem>
                      <SelectItem value="Offline">Offline Only</SelectItem>
                      <SelectItem value="Hybrid">Hybrid (Online + Offline)</SelectItem>
                      <SelectItem value="PR">PR Campaign</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-white">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                    <SelectTrigger className="text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Timeline & Budget
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Campaign Timeline</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-white">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                    className="text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-white">End Date *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                    className="text-white"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="bg-white/20" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Budget Allocation</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="total-budget" className="text-white">Total Budget *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="total-budget"
                      type="number"
                      value={formData.totalBudget || ''}
                      onChange={(e) => {
                        const total = parseFloat(e.target.value) || 0;
                        updateFormData('totalBudget', total);
                        // Auto-split budget based on campaign type
                        if (formData.type === 'Online') {
                          updateFormData('digitalBudget', total);
                          updateFormData('offlineBudget', 0);
                        } else if (formData.type === 'Offline') {
                          updateFormData('digitalBudget', 0);
                          updateFormData('offlineBudget', total);
                        } else {
                          updateFormData('digitalBudget', total * 0.6);
                          updateFormData('offlineBudget', total * 0.4);
                        }
                      }}
                      placeholder="50000"
                      className="pl-10 text-white"
                    />
                  </div>
                </div>
                
                {formData.type !== 'Offline' && (
                  <div className="space-y-2">
                    <Label htmlFor="digital-budget" className="text-white">Digital Budget</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="digital-budget"
                        type="number"
                        value={formData.digitalBudget || ''}
                        onChange={(e) => updateFormData('digitalBudget', parseFloat(e.target.value) || 0)}
                        className="pl-10 text-white"
                      />
                    </div>
                  </div>
                )}
                
                {formData.type !== 'Online' && (
                  <div className="space-y-2">
                    <Label htmlFor="offline-budget" className="text-white">Offline Budget</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="offline-budget"
                        type="number"
                        value={formData.offlineBudget || ''}
                        onChange={(e) => updateFormData('offlineBudget', parseFloat(e.target.value) || 0)}
                        className="pl-10 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 2: // Goals & Objectives  
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Campaign Objective</h3>
              <div className="space-y-2">
                <Label htmlFor="primary-objective" className="text-white">What is the main goal of this campaign? *</Label>
                <Textarea
                  id="primary-objective"
                  value={formData.primaryObjective}
                  onChange={(e) => updateFormData('primaryObjective', e.target.value)}
                  placeholder="Increase brand awareness and generate qualified leads for our new product line..."
                  className="min-h-[120px] text-white"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Channels
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Marketing Channels</h3>
              <p className="text-muted-foreground">Select the channels you'll use for this campaign</p>
              
              {(formData.type === 'Online' || formData.type === 'Hybrid') && (
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Digital Channels</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {digitalChannelOptions.map((channel) => {
                      const Icon = channel.icon;
                      const isSelected = formData.digitalChannels.includes(channel.id);
                      return (
                        <Card
                          key={channel.id}
                          className={`p-4 cursor-pointer transition-all ${
                            isSelected ? 'ring-2 ring-purple-500' : ''
                          }`}
                          style={{
                            background: isSelected ? 'rgba(168, 85, 247, 0.1)' : undefined,
                            borderColor: isSelected ? '#a855f7' : undefined
                          }}
                          onClick={() => {
                            const channels = isSelected 
                              ? formData.digitalChannels.filter(c => c !== channel.id)
                              : [...formData.digitalChannels, channel.id];
                            updateFormData('digitalChannels', channels);
                          }}
                        >
                          <div className="flex items-center gap-3 text-white">
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{channel.name}</span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {(formData.type === 'Offline' || formData.type === 'Hybrid') && (
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Offline Channels</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {offlineChannelOptions.map((channel) => {
                      const Icon = channel.icon;
                      const isSelected = formData.offlineChannels.includes(channel.id);
                      return (
                        <Card
                          key={channel.id}
                          className={`p-4 cursor-pointer transition-all ${
                            isSelected ? 'ring-2 ring-purple-500' : ''
                          }`}
                          style={{
                            background: isSelected ? 'rgba(168, 85, 247, 0.1)' : undefined,
                            borderColor: isSelected ? '#a855f7' : undefined
                          }}
                          onClick={() => {
                            const channels = isSelected 
                              ? formData.offlineChannels.filter(c => c !== channel.id)
                              : [...formData.offlineChannels, channel.id];
                            updateFormData('offlineChannels', channels);
                          }}
                        >
                          <div className="flex items-center gap-3 text-white">
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{channel.name}</span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Review & Create
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Review Campaign Details</h3>
              <p className="text-muted-foreground">Please review your campaign settings before creating</p>
              
              <div className="space-y-6">
                {/* Basic Info Review */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Campaign Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="text-white">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="secondary">{formData.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge variant={formData.priority === 'High' ? 'destructive' : formData.priority === 'Medium' ? 'default' : 'secondary'}>
                        {formData.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-white/20" />
                
                {/* Timeline & Budget Review */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Timeline & Budget</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-white">{formData.startDate} to {formData.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Budget:</span>
                      <span className="text-white">${formData.totalBudget.toLocaleString()}</span>
                    </div>
                    {formData.digitalBudget > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Digital Budget:</span>
                        <span className="text-white">${formData.digitalBudget.toLocaleString()}</span>
                      </div>
                    )}
                    {formData.offlineBudget > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Offline Budget:</span>
                        <span className="text-white">${formData.offlineBudget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Separator className="bg-white/20" />
                
                {/* Channels Review */}
                <div className="space-y-3">
                  <h4 className="font-medium text-white">Selected Channels</h4>
                  <div className="space-y-2">
                    {formData.digitalChannels.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground">Digital: </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formData.digitalChannels.map(channelId => {
                            const channel = digitalChannelOptions.find(c => c.id === channelId);
                            return channel ? <Badge key={channelId} variant="secondary">{channel.name}</Badge> : null;
                          })}
                        </div>
                      </div>
                    )}
                    {formData.offlineChannels.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground">Offline: </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formData.offlineChannels.map(channelId => {
                            const channel = offlineChannelOptions.find(c => c.id === channelId);
                            return channel ? <Badge key={channelId} variant="secondary">{channel.name}</Badge> : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 py-4">
            <DialogTitle className="text-xl font-semibold text-white">Create New Campaign</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Set up your marketing campaign with essential information and configuration.
            </DialogDescription>
          </DialogHeader>
          
          {/* Progress Steps */}
          <div className="px-6 py-2">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
                      ${isActive ? 'bg-purple-500/20 text-purple-400' : 
                        isCompleted ? 'bg-green-500/20 text-green-400' : 
                        'text-muted-foreground'}
                    `}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-px w-12 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-white/20" />

          {/* Step Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-4">
              <div className="min-h-[450px] pb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderStepContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/5">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </div>
              
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleCreate}
                  disabled={!isStepValid() || isCreating}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isCreating ? (
                    <>
                      <LoadingSpinner className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Create Campaign
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}