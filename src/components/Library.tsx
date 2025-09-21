import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Upload, 
  Star, 
  Trash2, 
  Download, 
  Eye, 
  Play, 
  Pause, 
  Volume2,
  CheckSquare,
  Square,
  Filter,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Calendar,
  Clock,
  Copy,
  Folder,
  MoreVertical
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LibraryAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'text' | 'document';
  url: string;
  thumbnail?: string;
  size: number;
  duration?: number; // in seconds for video/audio
  resolution?: string; // for images/videos
  createdAt: string;
  lastModified: string;
  favorite: boolean;
  tags: string[];
  caption?: string;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    bitrate?: string;
    sampleRate?: string;
  };
}

const mockLibraryAssets: LibraryAsset[] = [
  {
    id: '1',
    name: 'Product Launch Video',
    type: 'video',
    url: 'https://videos.unsplash.com/video/1720195094087-9c0b5c6a2b9d',
    thumbnail: 'https://images.unsplash.com/photo-1720195094087-9c0b5c6a2b9d?w=400&h=300&fit=crop',
    size: 45600000,
    duration: 142,
    resolution: '1920x1080',
    createdAt: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-15T10:30:00Z',
    favorite: true,
    tags: ['product', 'launch', 'marketing'],
    caption: 'Exciting product launch video showcasing our latest features',
    metadata: {
      width: 1920,
      height: 1080,
      format: 'mp4',
      bitrate: '8 Mbps'
    }
  },
  {
    id: '2',
    name: 'Brand Logo Design',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    size: 2400000,
    resolution: '2048x1536',
    createdAt: '2024-01-14T14:20:00Z',
    lastModified: '2024-01-14T14:20:00Z',
    favorite: false,
    tags: ['brand', 'logo', 'design'],
    caption: 'Modern brand logo with clean typography',
    metadata: {
      width: 2048,
      height: 1536,
      format: 'png'
    }
  },
  {
    id: '3',
    name: 'Podcast Intro Music',
    type: 'audio',
    url: 'https://example.com/audio/podcast-intro.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    size: 3200000,
    duration: 48,
    createdAt: '2024-01-13T09:15:00Z',
    lastModified: '2024-01-13T09:15:00Z',
    favorite: true,
    tags: ['podcast', 'intro', 'music'],
    caption: 'Upbeat intro music for podcast episodes',
    metadata: {
      format: 'mp3',
      bitrate: '320 kbps',
      sampleRate: '44.1 kHz'
    }
  },
  {
    id: '4',
    name: 'Campaign Strategy Document',
    type: 'document',
    url: 'https://example.com/docs/campaign-strategy.pdf',
    thumbnail: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=300&fit=crop',
    size: 850000,
    createdAt: '2024-01-12T16:45:00Z',
    lastModified: '2024-01-12T16:45:00Z',
    favorite: false,
    tags: ['strategy', 'campaign', 'marketing'],
    caption: 'Comprehensive marketing campaign strategy document',
    metadata: {
      format: 'pdf'
    }
  },
  {
    id: '5',
    name: 'Social Media Post',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    size: 1800000,
    resolution: '1080x1080',
    createdAt: '2024-01-11T11:30:00Z',
    lastModified: '2024-01-11T11:30:00Z',
    favorite: true,
    tags: ['social', 'post', 'instagram'],
    caption: 'Engaging social media post for Instagram',
    metadata: {
      width: 1080,
      height: 1080,
      format: 'jpg'
    }
  },
  {
    id: '6',
    name: 'AI Content Prompts',
    type: 'text',
    url: 'https://example.com/text/ai-prompts.txt',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
    size: 15000,
    createdAt: '2024-01-10T08:20:00Z',
    lastModified: '2024-01-10T08:20:00Z',
    favorite: false,
    tags: ['ai', 'prompts', 'content'],
    caption: 'Collection of AI prompts for content generation',
    metadata: {
      format: 'txt'
    }
  },
  {
    id: '7',
    name: 'Tutorial Video',
    type: 'video',
    url: 'https://videos.unsplash.com/video/1720195094087-9c0b5c6a2b9d',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    size: 75000000,
    duration: 320,
    resolution: '1920x1080',
    createdAt: '2024-01-09T13:10:00Z',
    lastModified: '2024-01-09T13:10:00Z',
    favorite: true,
    tags: ['tutorial', 'education', 'video'],
    caption: 'Step-by-step tutorial video',
    metadata: {
      width: 1920,
      height: 1080,
      format: 'mp4',
      bitrate: '10 Mbps'
    }
  },
  {
    id: '8',
    name: 'Background Music',
    type: 'audio',
    url: 'https://example.com/audio/background.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=300&fit=crop',
    size: 8500000,
    duration: 180,
    createdAt: '2024-01-08T15:30:00Z',
    lastModified: '2024-01-08T15:30:00Z',
    favorite: false,
    tags: ['background', 'music', 'ambient'],
    caption: 'Ambient background music for videos',
    metadata: {
      format: 'mp3',
      bitrate: '256 kbps',
      sampleRate: '44.1 kHz'
    }
  }
];

const typeColors = {
  image: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  video: 'bg-red-500/20 text-red-400 border-red-500/30',
  audio: 'bg-green-500/20 text-green-400 border-green-500/30',
  text: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  document: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
};

const typeIcons = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  text: FileText,
  document: FileText
};

const ITEMS_PER_PAGE = 30;

// Utility functions
const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  if (diffDays <= 30) return `${Math.floor((diffDays - 1) / 7)} weeks ago`;
  return date.toLocaleDateString();
};

export function Library() {
  // Core state
  const [assets, setAssets] = useState<LibraryAsset[]>(mockLibraryAssets);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFavorites, setFilterFavorites] = useState<boolean>(false);
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  
  // Selection state
  const [bulkSelectionMode, setBulkSelectionMode] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  
  // Modal state
  const [previewAsset, setPreviewAsset] = useState<LibraryAsset | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Filter and search logic
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (asset.caption && asset.caption.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'all' || asset.type === filterType;
    const matchesFavorites = !filterFavorites || asset.favorite;
    return matchesSearch && matchesType && matchesFavorites;
  });

  const paginatedAssets = filteredAssets.slice(0, displayedItems);
  const hasMore = filteredAssets.length > displayedItems;

  // Asset operations
  const toggleFavorite = useCallback((assetId: string) => {
    setAssets(prev => prev.map(asset => 
      asset.id === assetId 
        ? { ...asset, favorite: !asset.favorite }
        : asset
    ));
  }, []);

  const deleteAsset = useCallback((assetId: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      newSet.delete(assetId);
      return newSet;
    });
  }, []);

  const deleteSelectedAssets = useCallback(() => {
    setAssets(prev => prev.filter(asset => !selectedAssets.has(asset.id)));
    setSelectedAssets(new Set());
    setBulkSelectionMode(false);
  }, [selectedAssets]);

  // Selection operations
  const toggleAssetSelection = useCallback((assetId: string) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  }, []);

  const selectAllVisible = useCallback(() => {
    setSelectedAssets(new Set(paginatedAssets.map(asset => asset.id)));
  }, [paginatedAssets]);

  const clearSelection = useCallback(() => {
    setSelectedAssets(new Set());
    setBulkSelectionMode(false);
  }, []);

  // File upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const fileURL = URL.createObjectURL(file);
      let type: LibraryAsset['type'] = 'document';
      
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else if (file.type.startsWith('text/')) type = 'text';
      
      const newAsset: LibraryAsset = {
        id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type,
        url: fileURL,
        thumbnail: type === 'image' ? fileURL : undefined,
        size: file.size,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        favorite: false,
        tags: [],
        metadata: {
          format: file.type.split('/')[1] || 'unknown'
        }
      };
      
      setAssets(prev => [newAsset, ...prev]);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const openPreview = useCallback((asset: LibraryAsset) => {
    setPreviewAsset(asset);
    setShowPreviewModal(true);
  }, []);

  const loadMore = useCallback(() => {
    setDisplayedItems(prev => prev + ITEMS_PER_PAGE);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-medium">Content Library</h1>
          <p className="text-muted-foreground mt-1">
            {assets.length} assets • {selectedAssets.size > 0 ? `${selectedAssets.size} selected` : 'Manage your media and content files'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Bulk Selection Toggle */}
          {selectedAssets.size > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteSelectedAssets}
                className="glass-card border-0"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete ({selectedAssets.size})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
                className="glass-card border-0 bg-white/5 hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkSelectionMode(!bulkSelectionMode)}
            className={`glass-card border-0 bg-white/5 hover:bg-white/10 ${bulkSelectionMode ? 'bg-blue-500/20 text-blue-400' : ''}`}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Select
          </Button>
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="glass-card border-0 hover:bg-white/10 shrink-0"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name, tags, or caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass-card border-0 bg-white/5"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                <Filter className="w-4 h-4 mr-2" />
                {filterType === 'all' ? 'All Types' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-0">
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterType('image')}>
                <ImageIcon className="w-4 h-4 mr-2" />
                Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('video')}>
                <Video className="w-4 h-4 mr-2" />
                Videos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('audio')}>
                <Music className="w-4 h-4 mr-2" />
                Audio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('text')}>
                <FileText className="w-4 h-4 mr-2" />
                Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('document')}>
                <FileText className="w-4 h-4 mr-2" />
                Documents
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`glass-card border-0 bg-white/5 hover:bg-white/10 ${filterFavorites ? 'bg-yellow-500/20 text-yellow-400' : ''}`}
          >
            <Star className={`w-4 h-4 mr-2 ${filterFavorites ? 'fill-yellow-400' : ''}`} />
            Favorites
          </Button>
          
          {bulkSelectionMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllVisible}
              className="glass-card border-0 bg-white/5 hover:bg-white/10"
            >
              Select All Visible
            </Button>
          )}
        </div>
      </motion.div>

      {/* Asset Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      >
        {paginatedAssets.map((asset, index) => (
          <AssetThumbnail
            key={asset.id}
            asset={asset}
            index={index}
            isSelected={selectedAssets.has(asset.id)}
            bulkSelectionMode={bulkSelectionMode}
            onToggleSelection={toggleAssetSelection}
            onToggleFavorite={toggleFavorite}
            onDelete={deleteAsset}
            onPreview={openPreview}
          />
        ))}
      </motion.div>

      {/* Load More */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-6"
        >
          <Button
            onClick={loadMore}
            variant="outline"
            className="glass-card border-0 bg-white/5 hover:bg-white/10"
          >
            Load More ({filteredAssets.length - displayedItems} remaining)
          </Button>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="glass-card rounded-lg p-8 max-w-md mx-auto">
            <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No assets found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterType !== 'all' || filterFavorites
                ? 'Try adjusting your search or filter criteria.' 
                : 'Upload your first file to get started.'}
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="glass-card border-0 hover:bg-white/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </motion.div>
      )}

      {/* Preview Modal */}
      <PreviewModal
        asset={previewAsset}
        open={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setPreviewAsset(null);
        }}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteAsset}
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,text/*,.pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}

// Asset Thumbnail Component
interface AssetThumbnailProps {
  asset: LibraryAsset;
  index: number;
  isSelected: boolean;
  bulkSelectionMode: boolean;
  onToggleSelection: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (asset: LibraryAsset) => void;
}

function AssetThumbnail({
  asset,
  index,
  isSelected,
  bulkSelectionMode,
  onToggleSelection,
  onToggleFavorite,
  onDelete,
  onPreview
}: AssetThumbnailProps) {
  const TypeIcon = typeIcons[asset.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-blue-500 scale-95' : 'hover:scale-105'
      }`}
      onClick={() => {
        if (bulkSelectionMode) {
          onToggleSelection(asset.id);
        } else {
          onPreview(asset);
        }
      }}
    >
      <div className="absolute inset-0">
        {asset.type === 'image' ? (
          <ImageWithFallback
            src={asset.thumbnail || asset.url}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${typeColors[asset.type].replace('border-', 'bg-').replace('/30', '/20')}`}>
            <TypeIcon className="w-8 h-8 text-white/80" />
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Duration for video/audio */}
        {asset.duration && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(asset.duration)}
          </div>
        )}
        
        {/* Selection checkbox */}
        {bulkSelectionMode && (
          <div className="absolute top-2 left-2">
            <Checkbox
              checked={isSelected}
              onChange={() => onToggleSelection(asset.id)}
              className="bg-black/50 border-white/50"
            />
          </div>
        )}
        
        {/* Star for favorites */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(asset.id);
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <Star className={`w-4 h-4 ${asset.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-white/70'}`} />
        </button>
        
        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(asset.id);
          }}
          className="absolute bottom-2 right-2 p-1 rounded-full bg-black/50 hover:bg-red-500/70 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>
      
      {/* Asset info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm font-medium truncate">{asset.name}</p>
        <p className="text-white/70 text-xs">{formatFileSize(asset.size)}</p>
      </div>
    </motion.div>
  );
}

// Preview Modal Component
interface PreviewModalProps {
  asset: LibraryAsset | null;
  open: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

function PreviewModal({ asset, open, onClose, onToggleFavorite, onDelete }: PreviewModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!asset) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    link.click();
  };

  const handleCopyCaption = () => {
    if (asset.caption) {
      navigator.clipboard.writeText(asset.caption);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dark-solid-input-card max-w-4xl border-0 bg-gray-900/98 backdrop-blur-none shadow-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            {asset.name}
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-sm">
            {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)} • {formatFileSize(asset.size)} • Created {formatDate(asset.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Area */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-800/50">
              {asset.type === 'image' ? (
                <ImageWithFallback
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-contain"
                />
              ) : asset.type === 'video' ? (
                <video
                  src={asset.url}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : asset.type === 'audio' ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <audio src={asset.url} controls className="w-full max-w-md" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">Preview not available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Panel */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <Badge variant="outline" className={`${typeColors[asset.type]}`}>
                    {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                  </Badge>
                </div>
                {asset.resolution && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Resolution:</span>
                    <span className="text-white">{asset.resolution}</span>
                  </div>
                )}
                {asset.duration && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{formatDuration(asset.duration)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">{formatFileSize(asset.size)}</span>
                </div>
                {asset.metadata?.format && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-white">{asset.metadata.format.toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>

            {asset.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {asset.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs glass-card border-0 bg-gray-700/50 text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {asset.caption && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium text-white">Caption</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyCaption}
                    className="bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{asset.caption}</p>
              </div>
            )}

            <Separator className="bg-gray-700/50" />

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => onToggleFavorite(asset.id)}
                variant="outline"
                className={`w-full ${asset.favorite 
                  ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30' 
                  : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                }`}
              >
                <Star className={`w-4 h-4 mr-2 ${asset.favorite ? 'fill-yellow-400' : ''}`} />
                {asset.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              <Button
                onClick={handleDownload}
                variant="outline"
                className="w-full bg-blue-600/20 border-blue-500/50 text-blue-400 hover:bg-blue-600/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              
              <Button
                onClick={() => {
                  onDelete(asset.id);
                  onClose();
                }}
                variant="destructive"
                className="w-full bg-red-600/20 border-red-500/50 text-red-400 hover:bg-red-600/30"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}