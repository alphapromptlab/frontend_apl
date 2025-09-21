import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus,
  Video,
  Image,
  FileText,
  Megaphone,
  Calendar,
  Camera,
  Edit3,
  Eye,
  Copy,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Filter,
  Search,
  Blocks
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface Campaign {
  id: string;
  name: string;
  assignedMembers: Array<{
    id: string;
    name: string;
    avatar: string;
    initials: string;
  }>;
}

interface ContentBlock {
  id: string;
  type: 'Reel' | 'Carousel' | 'Post' | 'Story' | 'Video' | 'Blog' | 'PR Release' | 'Event' | 'Ad';
  title: string;
  caption?: string;
  platform: string[];
  status: 'Not Started' | 'In Progress' | 'Review' | 'Approved' | 'Published';
  assignedTo?: {
    id: string;
    name: string;
    avatar: string;
    initials: string;
  };
  dueDate: string;
  thumbnail?: string;
  cta?: string;
  priority: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
}

const mockContentBlocks: ContentBlock[] = [
  {
    id: '1',
    type: 'Reel',
    title: 'Summer Product Showcase',
    caption: 'Trending reel showcasing new summer collection with upbeat music and dynamic transitions',
    platform: ['Instagram', 'TikTok'],
    status: 'In Progress',
    assignedTo: { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
    dueDate: '2024-08-15',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
    cta: 'Shop Now',
    priority: 'High',
    lastUpdated: '2024-07-28'
  },
  {
    id: '2',
    type: 'Carousel',
    title: 'Product Features Deep Dive',
    caption: '5-slide carousel highlighting key product features and benefits',
    platform: ['Instagram', 'LinkedIn'],
    status: 'Review',
    assignedTo: { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' },
    dueDate: '2024-08-10',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
    cta: 'Learn More',
    priority: 'High',
    lastUpdated: '2024-07-27'
  },
  {
    id: '3',
    type: 'Blog',
    title: 'Summer Trends Guide 2024',
    caption: 'Comprehensive guide to summer fashion and lifestyle trends',
    platform: ['Website', 'LinkedIn'],
    status: 'Approved',
    assignedTo: { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' },
    dueDate: '2024-08-05',
    priority: 'Medium',
    lastUpdated: '2024-07-26'
  },
  {
    id: '4',
    type: 'Video',
    title: 'Behind the Scenes',
    caption: 'Documentary-style video showing our design process and team culture',
    platform: ['YouTube', 'Website'],
    status: 'Not Started',
    assignedTo: { id: '4', name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', initials: 'AK' },
    dueDate: '2024-08-20',
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop',
    priority: 'Medium',
    lastUpdated: '2024-07-25'
  },
  {
    id: '5',
    type: 'PR Release',
    title: 'New Collection Launch Announcement',
    caption: 'Official press release for summer collection launch',
    platform: ['Media Outlets', 'Website'],
    status: 'Published',
    assignedTo: { id: '5', name: 'David Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', initials: 'DP' },
    dueDate: '2024-07-30',
    priority: 'High',
    lastUpdated: '2024-07-30'
  },
  {
    id: '6',
    type: 'Ad',
    title: 'Facebook Conversion Campaign',
    caption: 'Performance-focused ad campaign targeting high-intent audiences',
    platform: ['Facebook', 'Instagram'],
    status: 'In Progress',
    assignedTo: { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
    dueDate: '2024-08-12',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
    cta: 'Shop Collection',
    priority: 'High',
    lastUpdated: '2024-07-28'
  }
];

const contentTypeIcons = {
  'Reel': Video,
  'Carousel': Image,
  'Post': FileText,
  'Story': Camera,
  'Video': Play,
  'Blog': FileText,
  'PR Release': Megaphone,
  'Event': Calendar,
  'Ad': Megaphone
};

const platformIcons = {
  'Instagram': Instagram,
  'Facebook': Facebook,
  'Twitter': Twitter,
  'LinkedIn': Linkedin,
  'YouTube': Youtube,
  'TikTok': Video,
  'Website': FileText,
  'Media Outlets': Megaphone
};

export function CampaignBlocksTab({ campaign }: { campaign: Campaign }) {
  const [contentBlocks] = useState<ContentBlock[]>(mockContentBlocks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showNewBlockDialog, setShowNewBlockDialog] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);

  const filteredBlocks = contentBlocks.filter(block => {
    const matchesSearch = block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         block.caption?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || block.status.toLowerCase().replace(' ', '') === statusFilter;
    const matchesType = typeFilter === 'all' || block.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: ContentBlock['status']) => {
    switch (status) {
      case 'Published': return 'bg-green-500';
      case 'Approved': return 'bg-blue-500';
      case 'Review': return 'bg-yellow-500';
      case 'In Progress': return 'bg-purple-500';
      case 'Not Started': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: ContentBlock['status']) => {
    switch (status) {
      case 'Published': return CheckCircle;
      case 'Approved': return CheckCircle;
      case 'Review': return Eye;
      case 'In Progress': return Clock;
      case 'Not Started': return AlertCircle;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority: ContentBlock['priority']) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'Low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const handleBlockClick = (block: ContentBlock) => {
    setSelectedBlock(block);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header and Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Content Blocks</h2>
              <p className="text-muted-foreground">Manage your campaign content pieces</p>
            </div>
            <Button
              onClick={() => setShowNewBlockDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Content Block
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search content blocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 glass-card border-0 bg-white/5"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 glass-card border-0 bg-white/5">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/90">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="notstarted">Not Started</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 glass-card border-0 bg-white/5">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/90">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="reel">Reel</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="pr release">PR Release</SelectItem>
                <SelectItem value="ad">Ad</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlocks.map((block, index) => {
            const TypeIcon = contentTypeIcons[block.type];
            const StatusIcon = getStatusIcon(block.status);
            
            return (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card 
                  className="glass-card border-0 overflow-hidden hover:bg-white/10 transition-all duration-200 cursor-pointer group"
                  onClick={() => handleBlockClick(block)}
                >
                  {/* Thumbnail/Header */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-600/20 to-pink-600/20 overflow-hidden">
                    {block.thumbnail ? (
                      <img 
                        src={block.thumbnail} 
                        alt={block.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TypeIcon className="w-16 h-16 text-purple-400/50" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getStatusColor(block.status)} text-white border-0`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {block.status}
                      </Badge>
                    </div>

                    {/* Priority Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getPriorityColor(block.priority)} border`}>
                        {block.priority}
                      </Badge>
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" className="bg-black/50 hover:bg-black/70 text-white border-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-card border-0 bg-black/90">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-400">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Title and Type */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <TypeIcon className="w-4 h-4 text-purple-400" />
                          <Badge variant="outline" className="glass-card border-0 bg-white/5 text-xs">
                            {block.type}
                          </Badge>
                        </div>
                        <h3 className="font-semibold group-hover:text-purple-400 transition-colors line-clamp-1">
                          {block.title}
                        </h3>
                      </div>
                    </div>

                    {/* Caption */}
                    {block.caption && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {block.caption}
                      </p>
                    )}

                    {/* CTA */}
                    {block.cta && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">CTA:</span>
                        <Badge className="bg-blue-600/20 text-blue-400 border-0 text-xs">
                          {block.cta}
                        </Badge>
                      </div>
                    )}

                    {/* Platforms */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {block.platform.slice(0, 3).map((platform) => {
                        const PlatformIcon = platformIcons[platform as keyof typeof platformIcons] || FileText;
                        return (
                          <div key={platform} className="flex items-center gap-1 bg-white/5 rounded px-2 py-1">
                            <PlatformIcon className="w-3 h-3" />
                            <span className="text-xs">{platform}</span>
                          </div>
                        );
                      })}
                      {block.platform.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{block.platform.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        {block.assignedTo && (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={block.assignedTo.avatar} />
                            <AvatarFallback className="text-xs">{block.assignedTo.initials}</AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Due {new Date(block.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredBlocks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Blocks className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No content blocks found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button 
              onClick={() => setShowNewBlockDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Content Block
            </Button>
          </div>
        )}
      </motion.div>

      {/* New Block Dialog */}
      <Dialog open={showNewBlockDialog} onOpenChange={setShowNewBlockDialog}>
        <DialogContent className="glass-card border-0 bg-black/90 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Content Block</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Content Type</Label>
                <Select>
                  <SelectTrigger className="glass-card border-0 bg-white/5 mt-2">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-0 bg-black/90">
                    <SelectItem value="reel">Reel</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="post">Post</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                    <SelectItem value="pr-release">PR Release</SelectItem>
                    <SelectItem value="ad">Ad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger className="glass-card border-0 bg-white/5 mt-2">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-0 bg-black/90">
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Title</Label>
              <Input
                placeholder="Enter content title..."
                className="glass-card border-0 bg-white/5 mt-2"
              />
            </div>
            
            <div>
              <Label>Caption/Description</Label>
              <Textarea
                placeholder="Describe the content piece..."
                className="glass-card border-0 bg-white/5 mt-2 min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowNewBlockDialog(false)}
                className="glass-card border-0 bg-white/5 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700">
                Create Block
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Block Detail Dialog */}
      <Dialog open={!!selectedBlock} onOpenChange={() => setSelectedBlock(null)}>
        <DialogContent className="glass-card border-0 bg-black/90 max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedBlock && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {React.createElement(contentTypeIcons[selectedBlock.type], { className: "w-5 h-5 text-purple-400" })}
                  {selectedBlock.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {selectedBlock.thumbnail && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img 
                      src={selectedBlock.thumbnail} 
                      alt={selectedBlock.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Status</Label>
                      <Badge className={`${getStatusColor(selectedBlock.status)} text-white border-0 mt-2`}>
                        {selectedBlock.status}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label>Priority</Label>
                      <Badge className={`${getPriorityColor(selectedBlock.priority)} border mt-2`}>
                        {selectedBlock.priority}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label>Due Date</Label>
                      <p className="mt-2 text-sm">{new Date(selectedBlock.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Assigned To</Label>
                      {selectedBlock.assignedTo && (
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={selectedBlock.assignedTo.avatar} />
                            <AvatarFallback>{selectedBlock.assignedTo.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{selectedBlock.assignedTo.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label>Platforms</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedBlock.platform.map((platform) => (
                          <Badge key={platform} variant="outline" className="glass-card border-0 bg-white/5">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedBlock.caption && (
                  <div>
                    <Label>Caption/Description</Label>
                    <p className="mt-2 text-sm text-muted-foreground bg-white/5 rounded-lg p-3">
                      {selectedBlock.caption}
                    </p>
                  </div>
                )}
                
                {selectedBlock.cta && (
                  <div>
                    <Label>Call to Action</Label>
                    <Badge className="bg-blue-600/20 text-blue-400 border-0 mt-2">
                      {selectedBlock.cta}
                    </Badge>
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <Button 
                    variant="outline"
                    className="glass-card border-0 bg-white/5 hover:bg-white/10"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}