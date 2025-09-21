import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Phone,
  QrCode,
  Tag,
  MapPin,
  Calendar,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Info,
  Users,
  Clock
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface OfflineChannel {
  id: string;
  type: 'phone' | 'qr' | 'promo';
  channel: string;
  value: string;
  description?: string;
}

interface FootTrafficEvent {
  id: string;
  type: 'foot-traffic' | 'event';
  name: string;
  location: string;
  date: string;
  expectedAttendance?: number;
}

export function OfflineCampaignSetup() {
  const [isOfflineExpanded, setIsOfflineExpanded] = useState(false);
  const [offlineChannels, setOfflineChannels] = useState<OfflineChannel[]>([
    { id: '1', type: 'phone', channel: 'Print Ads', value: '+1-800-555-0101', description: 'Main campaign phone line' },
    { id: '2', type: 'qr', channel: 'Billboard', value: 'QR_BILLBOARD_001', description: 'Highway billboard QR code' }
  ]);
  const [footTrafficEvents, setFootTrafficEvents] = useState<FootTrafficEvent[]>([
    { id: '1', type: 'foot-traffic', name: 'Downtown Store', location: '123 Main St', date: '2024-08-15' },
    { id: '2', type: 'event', name: 'Product Launch Event', location: 'Convention Center', date: '2024-08-20', expectedAttendance: 500 }
  ]);

  const addOfflineChannel = (type: 'phone' | 'qr' | 'promo') => {
    const newChannel: OfflineChannel = {
      id: Date.now().toString(),
      type,
      channel: '',
      value: '',
      description: ''
    };
    setOfflineChannels([...offlineChannels, newChannel]);
  };

  const removeOfflineChannel = (id: string) => {
    setOfflineChannels(offlineChannels.filter(channel => channel.id !== id));
  };

  const updateOfflineChannel = (id: string, field: keyof OfflineChannel, value: string) => {
    setOfflineChannels(offlineChannels.map(channel => 
      channel.id === id ? { ...channel, [field]: value } : channel
    ));
  };

  const addFootTrafficEvent = (type: 'foot-traffic' | 'event') => {
    const newEvent: FootTrafficEvent = {
      id: Date.now().toString(),
      type,
      name: '',
      location: '',
      date: '',
      ...(type === 'event' && { expectedAttendance: 0 })
    };
    setFootTrafficEvents([...footTrafficEvents, newEvent]);
  };

  const removeFootTrafficEvent = (id: string) => {
    setFootTrafficEvents(footTrafficEvents.filter(event => event.id !== id));
  };

  const updateFootTrafficEvent = (id: string, field: keyof FootTrafficEvent, value: string | number) => {
    setFootTrafficEvents(footTrafficEvents.map(event => 
      event.id === id ? { ...event, [field]: value } : event
    ));
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'phone': return Phone;
      case 'qr': return QrCode;
      case 'promo': return Tag;
      default: return Tag;
    }
  };

  const getChannelColor = (type: string) => {
    switch (type) {
      case 'phone': return 'text-purple-400';
      case 'qr': return 'text-purple-400';
      case 'promo': return 'text-purple-400';
      default: return 'text-purple-400';
    }
  };

  const getPlaceholder = (type: string) => {
    switch (type) {
      case 'phone': return '+1-800-555-0123';
      case 'qr': return 'QR_SPRING2025_001';
      case 'promo': return 'SPRING2025';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Offline Tactics Section */}
      <Collapsible open={isOfflineExpanded} onOpenChange={setIsOfflineExpanded}>
        <Card className="glass-card border-0 border-l-4 border-l-purple-500">
          <CollapsibleTrigger asChild>
            <div className="p-6 cursor-pointer hover:bg-purple-500/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400">Offline Tactics</h3>
                    <p className="text-sm text-muted-foreground">Configure tracking for offline channels and attribution</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="glass-card border-0 bg-purple-500/10 text-purple-400">
                    {offlineChannels.length} channels
                  </Badge>
                  {isOfflineExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-6 pb-6 space-y-6">
              {/* Offline Attribution Panel */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Attribution Tracking</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="glass-card border-0 bg-black/90">
                          <p className="text-sm">Assign unique identifiers to each offline channel for attribution tracking</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addOfflineChannel('phone')}
                      className="glass-card border-0 bg-white/5 hover:bg-white/10"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Add Phone
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addOfflineChannel('qr')}
                      className="glass-card border-0 bg-white/5 hover:bg-white/10"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Add QR Code
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addOfflineChannel('promo')}
                      className="glass-card border-0 bg-white/5 hover:bg-white/10"
                    >
                      <Tag className="w-4 h-4 mr-2" />
                      Add Promo Code
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {offlineChannels.map((channel) => {
                    const Icon = getChannelIcon(channel.type);
                    return (
                      <motion.div
                        key={channel.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-purple-500/10 rounded-lg mt-1">
                            <Icon className={`w-4 h-4 ${getChannelColor(channel.type)}`} />
                          </div>
                          
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`channel-${channel.id}`} className="text-sm font-medium">
                                Channel/Medium
                              </Label>
                              <Select 
                                value={channel.channel} 
                                onValueChange={(value) => updateOfflineChannel(channel.id, 'channel', value)}
                              >
                                <SelectTrigger className="glass-card border-0 bg-white/5">
                                  <SelectValue placeholder="Select channel" />
                                </SelectTrigger>
                                <SelectContent className="glass-card border-0 bg-black/90">
                                  <SelectItem value="Print Ads">Print Ads</SelectItem>
                                  <SelectItem value="Radio">Radio</SelectItem>
                                  <SelectItem value="TV">TV</SelectItem>
                                  <SelectItem value="Billboard">Billboard</SelectItem>
                                  <SelectItem value="Direct Mail">Direct Mail</SelectItem>
                                  <SelectItem value="Event">Event</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`value-${channel.id}`} className="text-sm font-medium">
                                {channel.type === 'phone' ? 'Phone Number' : 
                                 channel.type === 'qr' ? 'QR Code ID' : 'Promo Code'}
                              </Label>
                              <Input
                                id={`value-${channel.id}`}
                                value={channel.value}
                                onChange={(e) => updateOfflineChannel(channel.id, 'value', e.target.value)}
                                placeholder={getPlaceholder(channel.type)}
                                className="glass-card border-0 bg-white/5"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`description-${channel.id}`} className="text-sm font-medium">
                                Description
                              </Label>
                              <Input
                                id={`description-${channel.id}`}
                                value={channel.description || ''}
                                onChange={(e) => updateOfflineChannel(channel.id, 'description', e.target.value)}
                                placeholder="Campaign description"
                                className="glass-card border-0 bg-white/5"
                              />
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOfflineChannel(channel.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Foot Traffic & Events Section */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Foot Traffic & Events</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="glass-card border-0 bg-black/90">
                          <p className="text-sm">Track physical locations and events for offline attribution</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addFootTrafficEvent('foot-traffic')}
                      className="glass-card border-0 bg-white/5 hover:bg-white/10"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Add Location
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addFootTrafficEvent('event')}
                      className="glass-card border-0 bg-white/5 hover:bg-white/10"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {footTrafficEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg mt-1">
                          {event.type === 'foot-traffic' ? 
                            <MapPin className="w-4 h-4 text-purple-400" /> :
                            <Calendar className="w-4 h-4 text-purple-400" />
                          }
                        </div>
                        
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                {event.type === 'foot-traffic' ? 'Location Name' : 'Event Name'}
                              </Label>
                              <Input
                                value={event.name}
                                onChange={(e) => updateFootTrafficEvent(event.id, 'name', e.target.value)}
                                placeholder={event.type === 'foot-traffic' ? 'Downtown Store' : 'Product Launch Event'}
                                className="glass-card border-0 bg-white/5"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Address/Venue</Label>
                              <Input
                                value={event.location}
                                onChange={(e) => updateFootTrafficEvent(event.id, 'location', e.target.value)}
                                placeholder="123 Main St, City, State"
                                className="glass-card border-0 bg-white/5"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                {event.type === 'foot-traffic' ? 'Tracking Start Date' : 'Event Date'}
                              </Label>
                              <Input
                                type="date"
                                value={event.date}
                                onChange={(e) => updateFootTrafficEvent(event.id, 'date', e.target.value)}
                                className="glass-card border-0 bg-white/5"
                              />
                            </div>
                            
                            {event.type === 'event' && (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Expected Attendance</Label>
                                <Input
                                  type="number"
                                  value={event.expectedAttendance || ''}
                                  onChange={(e) => updateFootTrafficEvent(event.id, 'expectedAttendance', parseInt(e.target.value) || 0)}
                                  placeholder="500"
                                  className="glass-card border-0 bg-white/5"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFootTrafficEvent(event.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Attribution Instructions */}
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-400 mb-2">Offline Attribution Best Practices</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Use unique phone numbers for each offline channel to track call attribution</li>
                      <li>• Generate unique QR codes with campaign-specific landing pages</li>
                      <li>• Create memorable promo codes that clearly identify the source channel</li>
                      <li>• Set up foot traffic tracking baselines before campaign launch</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}