import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText,
  Image,
  Video,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageCircle,
  User,
  Calendar
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';

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

// Mock files data
const mockFiles = [
  {
    id: '1',
    name: 'Hero Banner Design v3.jpg',
    type: 'image',
    size: '2.3 MB',
    status: 'approved',
    version: 3,
    uploadedAt: '2024-08-01T10:30:00Z',
    uploadedBy: { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
    approvedBy: { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' },
    comments: 3,
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop'
  },
  {
    id: '2',
    name: 'Instagram Reel Script.docx',
    type: 'document',
    size: '456 KB',
    status: 'in-review',
    version: 2,
    uploadedAt: '2024-08-02T14:20:00Z',
    uploadedBy: { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' },
    comments: 1,
    dueDate: '2024-08-05T17:00:00Z'
  },
  {
    id: '3',
    name: 'Product Demo Video.mp4',
    type: 'video',
    size: '125 MB',
    status: 'needs-revision',
    version: 1,
    uploadedAt: '2024-08-03T09:15:00Z',
    uploadedBy: { id: '4', name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', initials: 'AK' },
    comments: 5,
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=200&fit=crop',
    reviewedBy: { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' }
  },
  {
    id: '4',
    name: 'Email Newsletter Template.html',
    type: 'document',
    size: '89 KB',
    status: 'draft',
    version: 1,
    uploadedAt: '2024-08-03T16:45:00Z',
    uploadedBy: { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' },
    comments: 0
  },
  {
    id: '5',
    name: 'Social Media Assets Pack.zip',
    type: 'archive',
    size: '45 MB',
    status: 'approved',
    version: 1,
    uploadedAt: '2024-08-04T11:20:00Z',
    uploadedBy: { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
    approvedBy: { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' },
    comments: 2
  }
];

const fileTypes = [
  { type: 'image', icon: Image, color: 'text-green-400' },
  { type: 'video', icon: Video, color: 'text-red-400' },
  { type: 'document', icon: FileText, color: 'text-blue-400' },
  { type: 'archive', icon: FileText, color: 'text-purple-400' }
];

export function CampaignFilesApprovalsTab({ campaign }: { campaign: Campaign }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-500/10';
      case 'in-review': return 'text-blue-400 bg-blue-500/10';
      case 'needs-revision': return 'text-yellow-400 bg-yellow-500/10';
      case 'draft': return 'text-gray-400 bg-gray-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'in-review': return Clock;
      case 'needs-revision': return AlertCircle;
      case 'draft': return Edit3;
      default: return Clock;
    }
  };

  const getFileIcon = (type: string) => {
    const fileType = fileTypes.find(ft => ft.type === type);
    return fileType ? fileType.icon : FileText;
  };

  const getFileIconColor = (type: string) => {
    const fileType = fileTypes.find(ft => ft.type === type);
    return fileType ? fileType.color : 'text-gray-400';
  };

  const formatFileSize = (size: string) => size;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || file.status === statusFilter;
    const matchesType = typeFilter === 'all' || file.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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
            <h2 className="text-xl font-semibold">Files & Approvals</h2>
            <p className="text-muted-foreground">Manage campaign assets and approval workflows</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0">
              <Plus className="w-4 h-4 mr-2" />
              New Asset
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 glass-card border-0 bg-white/5"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/90">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="needs-revision">Needs Revision</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36 glass-card border-0 bg-white/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-0 bg-black/90">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="archive">Archives</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-purple-600 text-white' : 'glass-card border-0 bg-white/5 hover:bg-white/10'}
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-purple-600 text-white' : 'glass-card border-0 bg-white/5 hover:bg-white/10'}
            >
              <FileText className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card border-0 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </div>
            </div>
          </Card>
          <Card className="glass-card border-0 p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">In Review</div>
              </div>
            </div>
          </Card>
          <Card className="glass-card border-0 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-muted-foreground">Needs Revision</div>
              </div>
            </div>
          </Card>
          <Card className="glass-card border-0 p-4">
            <div className="flex items-center gap-3">
              <Edit3 className="w-8 h-8 text-gray-400" />
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Drafts</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Files Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const StatusIcon = getStatusIcon(file.status);
              
              return (
                <motion.div
                  key={file.id}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="glass-card border-0 p-4 hover:bg-white/10 transition-all duration-200">
                    {/* File Preview */}
                    <div className="aspect-video bg-gray-800 rounded-lg mb-3 relative overflow-hidden">
                      {file.thumbnail ? (
                        <img 
                          src={file.thumbnail} 
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileIcon className={`w-12 h-12 ${getFileIconColor(file.type)}`} />
                        </div>
                      )}
                      
                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                          <Download className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="glass-card border-0 bg-black/90">
                            <DropdownMenuItem>
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Comment
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

                    {/* File Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm line-clamp-2">{file.name}</h4>
                        <Badge className={`${getStatusColor(file.status)} border-0 text-xs ml-2`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {file.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>v{file.version}</span>
                        <span>{formatFileSize(file.size)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={file.uploadedBy.avatar} />
                          <AvatarFallback className="text-xs">{file.uploadedBy.initials}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {file.comments > 0 && (
                            <>
                              <MessageCircle className="w-3 h-3" />
                              <span>{file.comments}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        {formatDate(file.uploadedAt)}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="glass-card border-0">
            <div className="divide-y divide-white/10">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.type);
                const StatusIcon = getStatusIcon(file.status);
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        <FileIcon className={`w-8 h-8 ${getFileIconColor(file.type)}`} />
                      </div>
                      
                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium truncate">{file.name}</h4>
                          <Badge className={`${getStatusColor(file.status)} border-0 text-xs`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {file.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Version {file.version}</span>
                          <span>{formatFileSize(file.size)}</span>
                          <span>Uploaded {formatDate(file.uploadedAt)}</span>
                        </div>
                      </div>
                      
                      {/* Assignees */}
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={file.uploadedBy.avatar} />
                          <AvatarFallback className="text-xs">{file.uploadedBy.initials}</AvatarFallback>
                        </Avatar>
                        
                        {file.approvedBy && (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={file.approvedBy.avatar} />
                            <AvatarFallback className="text-xs">{file.approvedBy.initials}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      
                      {/* Comments */}
                      {file.comments > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{file.comments}</span>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="glass-card border-0 bg-black/90">
                            <DropdownMenuItem>
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Comment
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
                  </motion.div>
                );
              })}
            </div>
          </Card>
        )}

        {filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload First File
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}