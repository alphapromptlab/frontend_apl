import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, Download, Eye, Edit3, Trash2, MoreHorizontal, 
  FileText, Image, Video, Music, Filter, Search, Plus 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { mockAssets, formatFileSize, type Campaign, type Asset } from './constants';

const fileTypeIcons = {
  image: Image,
  video: Video,
  document: FileText,
  audio: Music
};

const fileTypeColors = {
  image: 'text-green-400 bg-green-500/10',
  video: 'text-blue-400 bg-blue-500/10',
  document: 'text-purple-400 bg-purple-500/10',
  audio: 'text-orange-400 bg-orange-500/10'
};

export function CampaignAssetsTab({ campaign }: { campaign: Campaign }) {
  const [assets] = useState<Asset[]>(mockAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalSize = assets.reduce((acc, asset) => acc + asset.size, 0);

  return (
    <div className="h-full overflow-y-auto scrollbar-hide p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Campaign Assets</h2>
              <p className="text-muted-foreground">Manage files and media for your campaign</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>

          {/* Asset Stats */}
          <div className="grid grid-cols-5 gap-4">
            <Card className="glass-card border-0 p-4 text-center">
              <div className="text-xl font-bold text-white">{assets.length}</div>
              <div className="text-xs text-muted-foreground">Total Files</div>
            </Card>
            <Card className="glass-card border-0 p-4 text-center">
              <div className="text-xl font-bold text-green-400">{assets.filter(a => a.type === 'image').length}</div>
              <div className="text-xs text-muted-foreground">Images</div>
            </Card>
            <Card className="glass-card border-0 p-4 text-center">
              <div className="text-xl font-bold text-blue-400">{assets.filter(a => a.type === 'video').length}</div>
              <div className="text-xs text-muted-foreground">Videos</div>
            </Card>
            <Card className="glass-card border-0 p-4 text-center">
              <div className="text-xl font-bold text-purple-400">{assets.filter(a => a.type === 'document').length}</div>
              <div className="text-xs text-muted-foreground">Documents</div>
            </Card>
            <Card className="glass-card border-0 p-4 text-center">
              <div className="text-xl font-bold text-white">{formatFileSize(totalSize)}</div>
              <div className="text-xs text-muted-foreground">Total Size</div>
            </Card>
          </div>

          {/* Filters and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 glass-card border-0 bg-white/5"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                  <SelectValue placeholder="File type" />
                </SelectTrigger>
                <SelectContent className="glass-card border-0 bg-black/90">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="glass-card border-0 border-dashed border-white/20 p-8">
          <div className="text-center">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drag files here or click to upload</h3>
            <p className="text-muted-foreground mb-4">Support for images, videos, documents, and audio files</p>
            <Button variant="outline" className="glass-card border-0 bg-white/5 hover:bg-white/10">
              Choose Files
            </Button>
          </div>
        </Card>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset, index) => {
            const TypeIcon = fileTypeIcons[asset.type];
            const typeColors = fileTypeColors[asset.type];
            
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card border-0 overflow-hidden hover:bg-white/10 transition-all duration-200 group">
                  {/* Preview */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-600/20 to-gray-800/20 overflow-hidden">
                    {asset.url && asset.type === 'image' ? (
                      <img 
                        src={asset.url} 
                        alt={asset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TypeIcon className="w-16 h-16 text-gray-400/50" />
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${typeColors} border-0 capitalize`}>
                        {asset.type}
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" className="bg-black/50 hover:bg-black/70 text-white border-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-card border-0 bg-black/90">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Rename
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
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-medium line-clamp-1 group-hover:text-purple-400 transition-colors">
                        {asset.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{formatFileSize(asset.size)}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs glass-card border-0 bg-white/5">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={asset.uploadedBy.avatar} />
                          <AvatarFallback className="text-xs">{asset.uploadedBy.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{asset.uploadedBy.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(asset.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredAssets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assets found</h3>
            <p className="text-muted-foreground">Upload your first file to get started</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}