import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Calendar, 
  User, 
  Folder, 
  Star, 
  Archive, 
  Trash2,
  Upload,
  Download,
  CheckSquare,
  Square,
  X,
  FolderPlus,
  ArrowLeft,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Play,
  Clock,
  Eye,
  Edit3,
  Link,
  Activity,
  Tag,
  Copy,
  Move,
  ChevronRight,
  Grid,
  List,
  SortAsc,
  Heart,
  MessageSquare,
  Settings,
  Share2,
  Check,
  FolderOpen,
  HardDrive
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
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ProjectAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'text' | 'document';
  url: string;
  thumbnail?: string;
  size: number;
  duration?: number;
  resolution?: string;
  createdAt: string;
  lastModified: string;
  favorite: boolean;
  tags: string[];
  note?: string;
  label?: string;
  linkedCampaigns: string[];
  folderId?: string;
}

interface ProjectFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  color: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  status: 'Live' | 'Pending' | 'Internal' | 'Completed' | 'On Hold';
  tags: string[];
  createdAt: string;
  lastModified: string;
  favorite: boolean;
  color: string;
  collaborators: number;
  totalAssets: number;
  folders: ProjectFolder[];
  assets: ProjectAsset[];
}

interface ActivityItem {
  id: string;
  type: 'upload' | 'delete' | 'comment' | 'move' | 'favorite';
  message: string;
  timestamp: string;
  user: string;
}

// Mock library data
const mockLibraryItems = [
  {
    id: 'lib1',
    name: 'Brand Logo Collection',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    size: 1800000,
    category: 'Branding',
    tags: ['logo', 'brand', 'vector']
  },
  {
    id: 'lib2',
    name: 'Product Hero Video',
    type: 'video' as const,
    url: 'https://videos.unsplash.com/video-1720195094087-9c0b5c6a2b9d',
    thumbnail: 'https://images.unsplash.com/photo-1720195094087-9c0b5c6a2b9d?w=400&h=300&fit=crop',
    size: 12500000,
    duration: 45,
    category: 'Marketing',
    tags: ['hero', 'product', 'promo']
  },
  {
    id: 'lib3',
    name: 'Background Music Track',
    type: 'audio' as const,
    url: 'https://example.com/audio.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    size: 5600000,
    duration: 180,
    category: 'Audio',
    tags: ['background', 'music', 'ambient']
  },
  {
    id: 'lib4',
    name: 'Marketing Copy Template',
    type: 'text' as const,
    url: 'https://example.com/copy.txt',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
    size: 25000,
    category: 'Copy',
    tags: ['template', 'marketing', 'copy']
  },
  {
    id: 'lib5',
    name: 'Social Media Templates',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop',
    size: 3200000,
    category: 'Templates',
    tags: ['social', 'template', 'design']
  },
  {
    id: 'lib6',
    name: 'Product Photography',
    type: 'image' as const,
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    size: 4100000,
    category: 'Photography',
    tags: ['product', 'photography', 'studio']
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Nike Campaign 2024',
    description: 'Complete brand campaign for Nike\'s latest product launch',
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    status: 'Live',
    tags: ['Brand', 'Sports', 'Video'],
    createdAt: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-20T14:22:00Z',
    favorite: true,
    color: 'from-blue-500 to-purple-600',
    collaborators: 5,
    totalAssets: 47,
    folders: [
      {
        id: 'f1',
        name: 'Reels',
        description: 'Short form video content',
        createdAt: '2024-01-15T10:30:00Z',
        color: '#ef4444'
      },
      {
        id: 'f2',
        name: 'UGC',
        description: 'User generated content',
        createdAt: '2024-01-16T09:15:00Z',
        color: '#10b981'
      },
      {
        id: 'f3',
        name: 'Client Feedback',
        description: 'Client reviews and feedback',
        createdAt: '2024-01-17T11:45:00Z',
        color: '#f59e0b'
      }
    ],
    assets: [
      {
        id: 'a1',
        name: 'Hero Video Final',
        type: 'video',
        url: 'https://videos.unsplash.com/video/1720195094087-9c0b5c6a2b9d',
        thumbnail: 'https://images.unsplash.com/photo-1720195094087-9c0b5c6a2b9d?w=400&h=300&fit=crop',
        size: 45600000,
        duration: 142,
        resolution: '1920x1080',
        createdAt: '2024-01-18T10:30:00Z',
        lastModified: '2024-01-18T10:30:00Z',
        favorite: true,
        tags: ['hero', 'final', 'approved'],
        note: 'Client approved version',
        label: 'Approved',
        linkedCampaigns: ['Social Media Q1', 'Website Launch'],
        folderId: 'f1'
      },
      {
        id: 'a2',
        name: 'Product Shot 01',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
        size: 2400000,
        resolution: '2048x1536',
        createdAt: '2024-01-19T14:20:00Z',
        lastModified: '2024-01-19T14:20:00Z',
        favorite: false,
        tags: ['product', 'studio', 'clean'],
        linkedCampaigns: ['Product Gallery'],
        folderId: 'f2'
      }
    ]
  },
  {
    id: '2',
    name: 'Tesla Model S Campaign',
    description: 'Luxury automotive campaign focusing on innovation',
    coverImage: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&h=300&fit=crop',
    status: 'Pending',
    tags: ['Automotive', 'Luxury', 'Tech'],
    createdAt: '2024-01-10T09:15:00Z',
    lastModified: '2024-01-19T16:30:00Z',
    favorite: false,
    color: 'from-red-500 to-orange-600',
    collaborators: 3,
    totalAssets: 23,
    folders: [],
    assets: []
  },
  {
    id: '3',
    name: 'Apple Internal Brand',
    description: 'Internal branding materials and guidelines',
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    status: 'Internal',
    tags: ['Internal', 'Brand', 'Guidelines'],
    createdAt: '2024-01-05T08:45:00Z',
    lastModified: '2024-01-18T12:15:00Z',
    favorite: true,
    color: 'from-gray-500 to-blue-600',
    collaborators: 8,
    totalAssets: 156,
    folders: [],
    assets: []
  }
];

const statusColors = {
  'Live': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Internal': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Completed': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'On Hold': 'bg-red-500/20 text-red-400 border-red-500/30'
};

const typeIcons = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  text: FileText,
  document: FileText
};

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

interface ProjectsProps {
  onNavigateToCampaign?: () => void;
}

export function Projects({ onNavigateToCampaign }: ProjectsProps = {}) {
  // Core state
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentFolder, setCurrentFolder] = useState<ProjectFolder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Selection state
  const [bulkSelectionMode, setBulkSelectionMode] = useState(false);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());
  
  // Modal state
  const [previewAsset, setPreviewAsset] = useState<ProjectAsset | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  
  // Form state
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [newProjectThumbnail, setNewProjectThumbnail] = useState<string>('');
  const [newProjectStatus, setNewProjectStatus] = useState<Project['status']>('Pending');
  const [newProjectTags, setNewProjectTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  
  // Edit project form state
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  const [editProjectThumbnail, setEditProjectThumbnail] = useState<string>('');
  const [editProjectStatus, setEditProjectStatus] = useState<Project['status']>('Pending');
  const [editProjectTags, setEditProjectTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState('');
  
  // Upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const newProjectThumbnailRef = useRef<HTMLInputElement>(null);
  const editProjectThumbnailRef = useRef<HTMLInputElement>(null);

  // Inline editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  // Project operations
  const toggleProjectFavorite = useCallback((projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, favorite: !project.favorite }
        : project
    ));
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  }, [selectedProject]);

  // Asset operations
  const toggleAssetFavorite = useCallback((assetId: string) => {
    if (!selectedProject) return;
    
    const updatedProject = {
      ...selectedProject,
      assets: selectedProject.assets.map(asset =>
        asset.id === assetId ? { ...asset, favorite: !asset.favorite } : asset
      )
    };
    
    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
  }, [selectedProject]);

  const deleteAsset = useCallback((assetId: string) => {
    if (!selectedProject) return;
    
    const updatedProject = {
      ...selectedProject,
      assets: selectedProject.assets.filter(asset => asset.id !== assetId),
      totalAssets: selectedProject.totalAssets - 1
    };
    
    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      newSet.delete(assetId);
      return newSet;
    });
  }, [selectedProject]);

  // Selection operations
  const clearSelection = useCallback(() => {
    setSelectedAssets(new Set());
    setSelectedFolders(new Set());
    setBulkSelectionMode(false);
  }, []);

  const downloadSelectedItems = useCallback(() => {
    if (!selectedProject) return;
    
    const selectedAssetsList = Array.from(selectedAssets).map(id => 
      selectedProject.assets.find(asset => asset.id === id)
    ).filter(Boolean);
    
    const selectedFoldersList = Array.from(selectedFolders).map(id => 
      selectedProject.folders.find(folder => folder.id === id)
    ).filter(Boolean);
    
    const totalItems = selectedAssetsList.length + selectedFoldersList.length;
    
    // In a real implementation, this would generate and download a zip file
    console.log('Downloading selected items:', { 
      assets: selectedAssetsList, 
      folders: selectedFoldersList,
      totalItems 
    });
    
    // Simulate download
    const link = document.createElement('a');
    link.download = `${selectedProject.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_selected_items.zip`;
    link.href = 'data:application/zip;base64,';
    link.click();
    
    // Clear selection after download
    clearSelection();
  }, [selectedProject, selectedAssets, selectedFolders, clearSelection]);

  const deleteFolder = useCallback((folderId: string) => {
    if (!selectedProject) return;
    
    // Also delete all assets in the folder
    const assetsInFolder = selectedProject.assets.filter(asset => asset.folderId === folderId);
    
    const updatedProject = {
      ...selectedProject,
      folders: selectedProject.folders.filter(folder => folder.id !== folderId),
      assets: selectedProject.assets.filter(asset => asset.folderId !== folderId),
      totalAssets: selectedProject.totalAssets - assetsInFolder.length
    };
    
    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    
    setSelectedFolders(prev => {
      const newSet = new Set(prev);
      newSet.delete(folderId);
      return newSet;
    });

    // Remove any assets that were in the deleted folder from selection
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      assetsInFolder.forEach(asset => newSet.delete(asset.id));
      return newSet;
    });
  }, [selectedProject]);

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

  const toggleFolderSelection = useCallback((folderId: string) => {
    setSelectedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  // File upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProject) return;
    
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const fileURL = URL.createObjectURL(file);
      let type: ProjectAsset['type'] = 'document';
      
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type.startsWith('video/')) type = 'video';
      else if (file.type.startsWith('audio/')) type = 'audio';
      else if (file.type.startsWith('text/')) type = 'text';
      
      const newAsset: ProjectAsset = {
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
        linkedCampaigns: [],
        folderId: currentFolder?.id
      };
      
      const updatedProject = {
        ...selectedProject,
        assets: [newAsset, ...selectedProject.assets],
        totalAssets: selectedProject.totalAssets + 1
      };
      
      setSelectedProject(updatedProject);
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedProject, currentFolder]);

  // Add from library
  const handleAddFromLibrary = useCallback((libraryItem: typeof mockLibraryItems[0]) => {
    if (!selectedProject) return;
    
    const newAsset: ProjectAsset = {
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: libraryItem.name,
      type: libraryItem.type,
      url: libraryItem.url,
      thumbnail: libraryItem.thumbnail,
      size: libraryItem.size,
      duration: libraryItem.duration,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      favorite: false,
      tags: libraryItem.tags || [],
      linkedCampaigns: [],
      folderId: currentFolder?.id
    };
    
    const updatedProject = {
      ...selectedProject,
      assets: [newAsset, ...selectedProject.assets],
      totalAssets: selectedProject.totalAssets + 1
    };
    
    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    
    setShowLibraryModal(false);
  }, [selectedProject, currentFolder]);

  // Modal handlers
  const openPreview = useCallback((asset: ProjectAsset) => {
    setPreviewAsset(asset);
    setShowPreviewModal(true);
  }, []);

  const createProject = useCallback(() => {
    if (!newProjectName.trim()) return;
    
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: newProjectName.trim(),
      description: newProjectDescription.trim(),
      coverImage: newProjectThumbnail || undefined,
      status: newProjectStatus,
      tags: newProjectTags,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      favorite: false,
      color: getRandomProjectColor(),
      collaborators: 1,
      totalAssets: 0,
      folders: [],
      assets: []
    };
    
    setProjects(prev => [newProject, ...prev]);
    
    // Reset form
    setNewProjectName('');
    setNewProjectDescription('');
    setNewProjectThumbnail('');
    setNewProjectStatus('Pending');
    setNewProjectTags([]);
    setTagInput('');
    setShowNewProjectModal(false);
  }, [newProjectName, newProjectDescription, newProjectThumbnail, newProjectStatus, newProjectTags]);

  // Helper function for random project colors
  const getRandomProjectColor = (): string => {
    const colors = [
      'from-blue-500 to-purple-600',
      'from-red-500 to-orange-600',
      'from-green-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-yellow-500 to-red-600',
      'from-indigo-500 to-blue-600',
      'from-pink-500 to-rose-600',
      'from-cyan-500 to-blue-600'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // New project thumbnail operations
  const handleNewProjectThumbnailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const fileURL = URL.createObjectURL(file);
    setNewProjectThumbnail(fileURL);
    
    if (newProjectThumbnailRef.current) {
      newProjectThumbnailRef.current.value = '';
    }
  }, []);

  const removeNewProjectThumbnail = useCallback(() => {
    setNewProjectThumbnail('');
  }, []);

  // Tag management
  const addTag = useCallback(() => {
    const tag = tagInput.trim();
    if (tag && !newProjectTags.includes(tag) && newProjectTags.length < 5) {
      setNewProjectTags(prev => [...prev, tag]);
      setTagInput('');
    }
  }, [tagInput, newProjectTags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setNewProjectTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  const handleTagInputKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  // Edit project handlers
  const openEditProject = useCallback((project: Project) => {
    setEditingProject(project);
    setEditProjectName(project.name);
    setEditProjectDescription(project.description);
    setEditProjectThumbnail(project.coverImage || '');
    setEditProjectStatus(project.status);
    setEditProjectTags([...project.tags]);
    setEditTagInput('');
    setShowEditProjectModal(true);
  }, []);

  const saveProjectChanges = useCallback(() => {
    if (!editingProject || !editProjectName.trim()) return;
    
    const updatedProject: Project = {
      ...editingProject,
      name: editProjectName.trim(),
      description: editProjectDescription.trim(),
      coverImage: editProjectThumbnail || undefined,
      status: editProjectStatus,
      tags: editProjectTags,
      lastModified: new Date().toISOString()
    };
    
    setProjects(prev => prev.map(p => p.id === editingProject.id ? updatedProject : p));
    
    // Update selected project if it's the one being edited
    if (selectedProject?.id === editingProject.id) {
      setSelectedProject(updatedProject);
    }
    
    // Reset form
    setEditProjectName('');
    setEditProjectDescription('');
    setEditProjectThumbnail('');
    setEditProjectStatus('Pending');
    setEditProjectTags([]);
    setEditTagInput('');
    setShowEditProjectModal(false);
    setEditingProject(null);
  }, [editingProject, editProjectName, editProjectDescription, editProjectThumbnail, editProjectStatus, editProjectTags, selectedProject]);

  // Edit project thumbnail operations
  const handleEditProjectThumbnailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const fileURL = URL.createObjectURL(file);
    setEditProjectThumbnail(fileURL);
    
    if (editProjectThumbnailRef.current) {
      editProjectThumbnailRef.current.value = '';
    }
  }, []);

  const removeEditProjectThumbnail = useCallback(() => {
    setEditProjectThumbnail('');
  }, []);

  // Edit project tag management
  const addEditTag = useCallback(() => {
    const tag = editTagInput.trim();
    if (tag && !editProjectTags.includes(tag) && editProjectTags.length < 5) {
      setEditProjectTags(prev => [...prev, tag]);
      setEditTagInput('');
    }
  }, [editTagInput, editProjectTags]);

  const removeEditTag = useCallback((tagToRemove: string) => {
    setEditProjectTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  const handleEditTagInputKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEditTag();
    }
  }, [addEditTag]);

  // Project actions
  const viewProject = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const downloadProjectZip = useCallback((project: Project) => {
    // In a real implementation, this would generate and download a zip file
    console.log('Downloading project:', project.name);
    // Simulate download
    const link = document.createElement('a');
    link.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.zip`;
    link.href = 'data:application/zip;base64,';
    link.click();
  }, []);

  const createFolder = useCallback(() => {
    if (!newFolderName.trim() || !selectedProject) return;
    
    const newFolder: ProjectFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      description: newFolderDescription.trim(),
      parentId: currentFolder?.id,
      createdAt: new Date().toISOString(),
      color: '#6366f1'
    };
    
    const updatedProject = {
      ...selectedProject,
      folders: [...selectedProject.folders, newFolder]
    };
    
    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    
    setNewFolderName('');
    setNewFolderDescription('');
    setShowNewFolderModal(false);
  }, [newFolderName, newFolderDescription, selectedProject, currentFolder]);

  // Thumbnail operations
  const handleThumbnailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProject) return;
    
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const fileURL = URL.createObjectURL(file);
    
    const updatedProject = {
      ...selectedProject,
      coverImage: fileURL,
      lastModified: new Date().toISOString()
    };
    
    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = '';
    }
  }, [selectedProject]);

  const removeThumbnail = useCallback(() => {
    if (!selectedProject) return;
    
    const updatedProject = {
      ...selectedProject,
      coverImage: undefined,
      lastModified: new Date().toISOString()
    };
    
    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
  }, [selectedProject]);

  // Filter and search logic for projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesFavorites = !filterFavorites || project.favorite;
    return matchesSearch && matchesStatus && matchesFavorites;
  });

  // Filter and search logic for assets in project view
  const getFilteredAssets = () => {
    if (!selectedProject) return [];
    
    let assets = selectedProject.assets.filter(asset => {
      if (currentFolder) {
        return asset.folderId === currentFolder.id;
      }
      return !asset.folderId; // Root level assets
    });
    
    assets = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           asset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (asset.note && asset.note.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === 'all' || asset.type === filterType;
      const matchesFavorites = !filterFavorites || asset.favorite;
      return matchesSearch && matchesType && matchesFavorites;
    });
    
    // Sort assets
    return assets.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
    });
  };

  const filteredAssets = getFilteredAssets();

  // View campaign handler
  const viewCampaign = useCallback((project: Project) => {
    // Navigate to campaign planner for this project
    if (onNavigateToCampaign) {
      onNavigateToCampaign();
    }
  }, [onNavigateToCampaign]);

  // Inline editing handlers
  const startEditingTitle = useCallback(() => {
    if (!selectedProject) return;
    setEditingTitle(selectedProject.name);
    setIsEditingTitle(true);
  }, [selectedProject]);

  const startEditingDescription = useCallback(() => {
    if (!selectedProject) return;
    setEditingDescription(selectedProject.description);
    setIsEditingDescription(true);
  }, [selectedProject]);

  const saveTitle = useCallback(() => {
    if (!selectedProject || !editingTitle.trim()) {
      setIsEditingTitle(false);
      return;
    }

    const updatedProject = {
      ...selectedProject,
      name: editingTitle.trim(),
      lastModified: new Date().toISOString()
    };

    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    setIsEditingTitle(false);
  }, [selectedProject, editingTitle]);

  const saveDescription = useCallback(() => {
    if (!selectedProject) {
      setIsEditingDescription(false);
      return;
    }

    const updatedProject = {
      ...selectedProject,
      description: editingDescription.trim(),
      lastModified: new Date().toISOString()
    };

    setSelectedProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
    setIsEditingDescription(false);
  }, [selectedProject, editingDescription]);

  const cancelEditingTitle = useCallback(() => {
    setIsEditingTitle(false);
    setEditingTitle('');
  }, []);

  const cancelEditingDescription = useCallback(() => {
    setIsEditingDescription(false);
    setEditingDescription('');
  }, []);

  const handleTitleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTitle();
    } else if (e.key === 'Escape') {
      cancelEditingTitle();
    }
  }, [saveTitle, cancelEditingTitle]);

  const handleDescriptionKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveDescription();
    } else if (e.key === 'Escape') {
      cancelEditingDescription();
    }
  }, [saveDescription, cancelEditingDescription]);

  // ProjectCard component with enhanced dropdown
  function ProjectCard({ project }: { project: Project }) {
    return (
      <Card 
        className="glass-card border-0 hover:bg-white/10 transition-all duration-200 cursor-pointer group"
        onClick={() => viewProject(project)}
      >
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {project.coverImage ? (
            <ImageWithFallback
              src={project.coverImage}
              alt={project.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${project.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
          )}
          
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Status and Favorite badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <Badge variant="outline" className={`glass-card border ${statusColors[project.status]} text-xs`}>
              {project.status}
            </Badge>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProjectFavorite(project.id);
                }}
              >
                <Star className={`w-4 h-4 ${project.favorite ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card border-0 bg-black/90 backdrop-blur-xl">
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    viewProject(project);
                  }}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    viewCampaign(project);
                  }}>
                    <Grid className="w-4 h-4 mr-2" />
                    View Campaign
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    openEditProject(project);
                  }}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => {
                    e.stopPropagation();
                    downloadProjectZip(project);
                  }}>
                    <Download className="w-4 h-4 mr-2" />
                    Download ZIP
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg truncate">{project.name}</h3>
            <span className="text-xs text-muted-foreground ml-2 shrink-0">{formatDate(project.lastModified)}</span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="glass-card border-0 bg-white/5 text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="glass-card border-0 bg-white/5 text-xs">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {project.collaborators}
              </span>
              <span className="flex items-center gap-1">
                <Folder className="w-3 h-3" />
                {project.totalAssets}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // If a project is selected, show project detail view
  if (selectedProject) {
    return (
      <div className="p-6 space-y-6">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedProject(null);
                setCurrentFolder(null);
                clearSelection();
              }}
              className="glass-card border-0 bg-white/5 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* Editable Project Thumbnail */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative group">
                        <div 
                          className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-dashed border-transparent hover:border-blue-400/50"
                          onClick={() => thumbnailInputRef.current?.click()}
                        >
                          {selectedProject.coverImage ? (
                            <>
                              <ImageWithFallback
                                src={selectedProject.coverImage}
                                alt={selectedProject.name}
                                className="w-full h-full object-cover"
                              />
                              {/* Edit overlay */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                <div className="text-white text-center">
                                  <ImageIcon className="w-5 h-5 mx-auto mb-1" />
                                  <span className="text-xs">Edit</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:from-blue-800 group-hover:to-blue-900 transition-colors duration-200">
                              <div className="text-gray-400 group-hover:text-blue-300 text-center">
                                <ImageIcon className="w-5 h-5 mx-auto mb-1" />
                                <span className="text-xs">Add</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Remove button - only show when image exists */}
                        {selectedProject.coverImage && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeThumbnail();
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                            title="Remove thumbnail"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{selectedProject.coverImage ? 'Click to change project thumbnail' : 'Click to add project thumbnail'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <div className="flex-1">
                  {/* Editable Title */}
                  {isEditingTitle ? (
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={handleTitleKeyPress}
                      onBlur={saveTitle}
                      className="text-2xl font-medium bg-transparent border-0 p-1 focus:bg-white/5 focus:border-white/20 rounded mb-2"
                      autoFocus
                    />
                  ) : (
                    <h1 
                      className="text-2xl font-medium cursor-pointer hover:bg-white/5 p-1 rounded transition-colors mb-2"
                      onClick={startEditingTitle}
                      title="Click to edit project name"
                    >
                      {selectedProject.name}
                    </h1>
                  )}

                  {/* Editable Description */}
                  {isEditingDescription ? (
                    <Textarea
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      onKeyDown={handleDescriptionKeyPress}
                      onBlur={saveDescription}
                      className="text-sm bg-transparent border-0 p-1 focus:bg-white/5 focus:border-white/20 rounded resize-none"
                      rows={2}
                      autoFocus
                    />
                  ) : (
                    <p 
                      className="text-muted-foreground text-sm cursor-pointer hover:bg-white/5 p-1 rounded transition-colors"
                      onClick={startEditingDescription}
                      title="Click to edit project description"
                    >
                      {selectedProject.description || 'Click to add description...'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {(selectedAssets.size > 0 || selectedFolders.size > 0) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <Button
                  variant="destructive"
                  size="sm"
                  className="glass-card border-0"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete ({selectedAssets.size + selectedFolders.size})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadSelectedItems}
                  className="glass-card border-0 bg-white/5 hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Zip
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
              variant="outline"
              size="sm"
              onClick={() => setShowActivityModal(true)}
              className="glass-card border-0 bg-white/5 hover:bg-white/10"
            >
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNewFolderModal(true)}
              className="glass-card border-0 bg-white/5 hover:bg-white/10"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="glass-card border-0 hover:bg-white/10 text-[rgba(250,250,250,1)]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-0 bg-black/90 backdrop-blur-xl">
                <DropdownMenuItem 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-white hover:bg-white/10 cursor-pointer"
                >
                  <HardDrive className="w-4 h-4 mr-2" />
                  Upload from Device
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowLibraryModal(true)}
                  className="text-white hover:bg-white/10 cursor-pointer"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Add from Library
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Breadcrumb */}
        {currentFolder && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <button
              onClick={() => setCurrentFolder(null)}
              className="hover:text-foreground transition-colors"
            >
              {selectedProject.name}
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{currentFolder.name}</span>
          </motion.div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 items-start lg:items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search assets by name, tags, or notes..."
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
                <DropdownMenuItem onClick={() => setFilterType('all')}>All Types</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterType('image')}>
                  <ImageIcon className="w-4 h-4 mr-2" /> Images
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('video')}>
                  <Video className="w-4 h-4 mr-2" /> Videos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('audio')}>
                  <Music className="w-4 h-4 mr-2" /> Audio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('text')}>
                  <FileText className="w-4 h-4 mr-2" /> Text
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('document')}>
                  <FileText className="w-4 h-4 mr-2" /> Documents
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="glass-card border-0 bg-white/5 hover:bg-white/10">
                  <SortAsc className="w-4 h-4 mr-2" />
                  Sort by {sortBy}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-card border-0">
                <DropdownMenuItem onClick={() => setSortBy('date')}>Date Modified</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')}>Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('size')}>File Size</DropdownMenuItem>
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
            
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="glass-card border-0 bg-white/5 hover:bg-white/10"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="glass-card border-0 bg-white/5 hover:bg-white/10"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Folders */}
        {!currentFolder && selectedProject.folders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-medium">Folders</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {selectedProject.folders.map((folder) => (
                <motion.div
                  key={folder.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group cursor-pointer relative ${
                    selectedFolders.has(folder.id) ? 'ring-2 ring-blue-500 scale-95' : ''
                  }`}
                  onClick={() => {
                    if (bulkSelectionMode) {
                      toggleFolderSelection(folder.id);
                    } else {
                      setCurrentFolder(folder);
                    }
                  }}
                >
                  <Card className="glass-card border-0 hover:bg-white/10 transition-all duration-300 p-4 text-center">
                    {/* Selection checkbox */}
                    {bulkSelectionMode && (
                      <div className="absolute top-2 left-2 z-10">
                        <Checkbox
                          checked={selectedFolders.has(folder.id)}
                          onChange={() => toggleFolderSelection(folder.id)}
                          className="bg-black/50 border-white/50"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                    
                    {/* Delete button */}
                    {!bulkSelectionMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFolder(folder.id);
                        }}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/50 hover:bg-red-500/70 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    )}
                    
                    <div className="flex flex-col items-center gap-2">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: folder.color + '20' }}
                      >
                        <Folder className="w-6 h-6" style={{ color: folder.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate">{folder.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedProject.assets.filter(a => a.folderId === folder.id).length} items
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Assets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {currentFolder ? `${currentFolder.name} Assets` : 'Assets'} ({filteredAssets.length})
            </h3>
            {bulkSelectionMode && (selectedAssets.size > 0 || selectedFolders.size > 0) && (
              <div className="text-sm text-muted-foreground">
                {selectedFolders.size > 0 && `${selectedFolders.size} folder${selectedFolders.size !== 1 ? 's' : ''}`}
                {selectedFolders.size > 0 && selectedAssets.size > 0 && ', '}
                {selectedAssets.size > 0 && `${selectedAssets.size} asset${selectedAssets.size !== 1 ? 's' : ''}`} selected
              </div>
            )}
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredAssets.map((asset, index) => (
                <AssetThumbnail
                  key={asset.id}
                  asset={asset}
                  index={index}
                  isSelected={selectedAssets.has(asset.id)}
                  bulkSelectionMode={bulkSelectionMode}
                  onToggleSelection={toggleAssetSelection}
                  onToggleFavorite={toggleAssetFavorite}
                  onDelete={deleteAsset}
                  onPreview={openPreview}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAssets.map((asset, index) => (
                <AssetListItem
                  key={asset.id}
                  asset={asset}
                  index={index}
                  isSelected={selectedAssets.has(asset.id)}
                  bulkSelectionMode={bulkSelectionMode}
                  onToggleSelection={toggleAssetSelection}
                  onToggleFavorite={toggleAssetFavorite}
                  onDelete={deleteAsset}
                  onPreview={openPreview}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredAssets.length === 0 && (!selectedProject.folders.length || currentFolder) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="glass-card rounded-lg p-8 max-w-md mx-auto">
              <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No assets found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterType !== 'all' || filterFavorites
                  ? 'Try adjusting your search or filter criteria.' 
                  : currentFolder 
                    ? 'This folder is empty. Upload your first file.'
                    : 'Upload your first asset to this project.'}
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
          onToggleFavorite={toggleAssetFavorite}
          onDelete={deleteAsset}
        />

        {/* New Folder Modal */}
        <Dialog open={showNewFolderModal} onOpenChange={setShowNewFolderModal}>
          <DialogContent className="dark-solid-input-card max-w-md border-0 bg-gray-900/98 backdrop-blur-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Folder</DialogTitle>
              <DialogDescription className="text-gray-300">
                Organize your assets into folders for better management.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-200">Folder Name</label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-gray-800/80 border border-gray-600/50 text-white"
                  placeholder="Enter folder name..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-200">Description (Optional)</label>
                <Textarea
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  className="bg-gray-800/80 border border-gray-600/50 text-white"
                  rows={2}
                  placeholder="Brief description..."
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={createFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Folder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewFolderModal(false)}
                  className="bg-gray-700/80 border border-gray-600/50 text-gray-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Activity Modal */}
        <ActivityModal
          open={showActivityModal}
          onClose={() => setShowActivityModal(false)}
          projectName={selectedProject.name}
        />

        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,text/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {/* Hidden Thumbnail Input */}
        <input
          ref={thumbnailInputRef}
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="hidden"
        />
        
        {/* Hidden New Project Thumbnail Input */}
        <input
          ref={newProjectThumbnailRef}
          type="file"
          accept="image/*"
          onChange={handleNewProjectThumbnailChange}
          className="hidden"
        />
      </div>
    );
  }

  // Main projects view
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
          <h1 className="text-2xl font-medium">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Organize your creative assets by client, campaign, or topic
          </p>
        </div>
        <Button 
          onClick={() => setShowNewProjectModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 items-start lg:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search projects..."
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
                {filterStatus === 'all' ? 'All Status' : filterStatus}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-0">
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Status</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus('Live')}>Live</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Pending')}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Internal')}>Internal</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('Completed')}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('On Hold')}>On Hold</DropdownMenuItem>
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
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center py-12"
        >
          <div className="glass-card rounded-lg p-8 max-w-md mx-auto">
            <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== 'all' || filterFavorites 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Create your first project to organize your creative assets.'}
            </p>
            <Button 
              onClick={() => setShowNewProjectModal(true)}
              className="glass-card border-0 hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </motion.div>
      )}

      {/* New Project Modal */}
      <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
        <DialogContent className="dark-solid-input-card max-w-2xl border-0 bg-gray-900/98 backdrop-blur-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Project</DialogTitle>
            <DialogDescription className="text-gray-300">
              Set up a new project workspace to organize your creative assets.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Thumbnail Section */}
            <div className="lg:col-span-1">
              <label className="text-sm font-medium mb-3 block text-gray-200">Project Thumbnail</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group">
                      <div 
                        className="w-full aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-dashed border-gray-600/50 hover:border-blue-400/50"
                        onClick={() => newProjectThumbnailRef.current?.click()}
                      >
                        {newProjectThumbnail ? (
                          <>
                            <ImageWithFallback
                              src={newProjectThumbnail}
                              alt="Project thumbnail"
                              className="w-full h-full object-cover"
                            />
                            {/* Edit overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <div className="text-white text-center">
                                <ImageIcon className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm">Change Image</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:from-blue-800 group-hover:to-blue-900 transition-colors duration-200">
                            <div className="text-gray-400 group-hover:text-blue-300 text-center">
                              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                              <span className="text-sm">Add Thumbnail</span>
                              <p className="text-xs text-gray-500 mt-1">Optional</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Remove button - only show when image exists */}
                      {newProjectThumbnail && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNewProjectThumbnail();
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                          title="Remove thumbnail"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{newProjectThumbnail ? 'Click to change thumbnail' : 'Click to add project thumbnail'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-200">Project Name</label>
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="bg-gray-800/80 border border-gray-600/50 text-white"
                  placeholder="Enter project name..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-200">Description</label>
                <Textarea
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  className="bg-gray-800/80 border border-gray-600/50 text-white"
                  rows={3}
                  placeholder="Brief project description..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Dropdown */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-200">Status</label>
                  <Select value={newProjectStatus} onValueChange={(value: Project['status']) => setNewProjectStatus(value)}>
                    <SelectTrigger className="bg-gray-800/80 border border-gray-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border border-gray-600/50">
                      <SelectItem value="Pending" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="Live" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          Live
                        </div>
                      </SelectItem>
                      <SelectItem value="Internal" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          Internal
                        </div>
                      </SelectItem>
                      <SelectItem value="Completed" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                          Completed
                        </div>
                      </SelectItem>
                      <SelectItem value="On Hold" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          On Hold
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-200">Tags</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                        className="bg-gray-800/80 border border-gray-600/50 text-white flex-1"
                        placeholder="Add a tag..."
                        disabled={newProjectTags.length >= 5}
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        disabled={!tagInput.trim() || newProjectTags.includes(tagInput.trim()) || newProjectTags.length >= 5}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Tags Display */}
                    {newProjectTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newProjectTags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="bg-gray-700/50 border-gray-600/50 text-gray-200 pr-1"
                          >
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {newProjectTags.length >= 5 && (
                      <p className="text-xs text-gray-400">Maximum 5 tags allowed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t border-gray-700/50">
            <Button
              onClick={createProject}
              disabled={!newProjectName.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Project
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewProjectModal(false);
                // Reset form when closing
                setNewProjectName('');
                setNewProjectDescription('');
                setNewProjectThumbnail('');
                setNewProjectStatus('Pending');
                setNewProjectTags([]);
                setTagInput('');
              }}
              className="bg-gray-700/80 border border-gray-600/50 text-gray-200"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={showEditProjectModal} onOpenChange={setShowEditProjectModal}>
        <DialogContent className="dark-solid-input-card max-w-2xl border-0 bg-gray-900/98 backdrop-blur-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Project</DialogTitle>
            <DialogDescription className="text-gray-300">
              Update project details, status, and organization.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Thumbnail Section */}
            <div className="lg:col-span-1">
              <label className="text-sm font-medium mb-3 block text-gray-200">Project Thumbnail</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative group">
                      <div 
                        className="w-full aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 border-2 border-dashed border-gray-600/50 hover:border-blue-400/50"
                        onClick={() => editProjectThumbnailRef.current?.click()}
                      >
                        {editProjectThumbnail ? (
                          <>
                            <ImageWithFallback
                              src={editProjectThumbnail}
                              alt="Project thumbnail"
                              className="w-full h-full object-cover"
                            />
                            {/* Edit overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <div className="text-white text-center">
                                <ImageIcon className="w-6 h-6 mx-auto mb-2" />
                                <span className="text-sm">Change Image</span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:from-blue-800 group-hover:to-blue-900 transition-colors duration-200">
                            <div className="text-gray-400 group-hover:text-blue-300 text-center">
                              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                              <span className="text-sm">Add Thumbnail</span>
                              <p className="text-xs text-gray-500 mt-1">Optional</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Remove button - only show when image exists */}
                      {editProjectThumbnail && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeEditProjectThumbnail();
                          }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                          title="Remove thumbnail"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{editProjectThumbnail ? 'Click to change thumbnail' : 'Click to add project thumbnail'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-200">Project Name</label>
                <Input
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className="bg-gray-800/80 border border-gray-600/50 text-white"
                  placeholder="Enter project name..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-200">Description</label>
                <Textarea
                  value={editProjectDescription}
                  onChange={(e) => setEditProjectDescription(e.target.value)}
                  className="bg-gray-800/80 border border-gray-600/50 text-white"
                  rows={3}
                  placeholder="Brief project description..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status Dropdown */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-200">Status</label>
                  <Select value={editProjectStatus} onValueChange={(value: Project['status']) => setEditProjectStatus(value)}>
                    <SelectTrigger className="bg-gray-800/80 border border-gray-600/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border border-gray-600/50">
                      <SelectItem value="Pending" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="Live" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                          Live
                        </div>
                      </SelectItem>
                      <SelectItem value="Internal" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          Internal
                        </div>
                      </SelectItem>
                      <SelectItem value="Completed" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                          Completed
                        </div>
                      </SelectItem>
                      <SelectItem value="On Hold" className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          On Hold
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-200">Tags</label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={editTagInput}
                        onChange={(e) => setEditTagInput(e.target.value)}
                        onKeyPress={handleEditTagInputKeyPress}
                        className="bg-gray-800/80 border border-gray-600/50 text-white flex-1"
                        placeholder="Add a tag..."
                        disabled={editProjectTags.length >= 5}
                      />
                      <Button
                        type="button"
                        onClick={addEditTag}
                        disabled={!editTagInput.trim() || editProjectTags.includes(editTagInput.trim()) || editProjectTags.length >= 5}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Tags Display */}
                    {editProjectTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {editProjectTags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="bg-gray-700/50 border-gray-600/50 text-gray-200 pr-1"
                          >
                            {tag}
                            <button
                              onClick={() => removeEditTag(tag)}
                              className="ml-1 hover:text-red-400 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {editProjectTags.length >= 5 && (
                      <p className="text-xs text-gray-400">Maximum 5 tags allowed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t border-gray-700/50">
            <Button
              onClick={saveProjectChanges}
              disabled={!editProjectName.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowEditProjectModal(false)}
              className="bg-gray-700/80 border border-gray-600/50 text-gray-200"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden Edit Project Thumbnail Input */}
      <input
        ref={editProjectThumbnailRef}
        type="file"
        accept="image/*"
        onChange={handleEditProjectThumbnailChange}
        className="hidden"
      />

      {/* Library Modal */}
      <Dialog open={showLibraryModal} onOpenChange={setShowLibraryModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-black/95 border-white/10 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Add from Library</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select content from your library to add to this project
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {mockLibraryItems.map((item) => {
                const IconComponent = typeIcons[item.type];
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group cursor-pointer"
                    onClick={() => handleAddFromLibrary(item)}
                  >
                    <Card className="glass-card border-0 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                      {/* Thumbnail */}
                      <div className="aspect-video relative overflow-hidden">
                        {item.type === 'image' || item.type === 'video' ? (
                          <ImageWithFallback
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                            <IconComponent className="w-8 h-8 text-white/60" />
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Plus className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        
                        {/* Duration badge for video/audio */}
                        {item.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1">
                            <span className="text-xs text-white">
                              {formatDuration(item.duration)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-3">
                        <h4 className="text-sm font-medium text-white truncate mb-1">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="capitalize">{item.type}</span>
                          <span>{formatFileSize(item.size)}</span>
                        </div>
                        
                        {/* Category badge */}
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs bg-white/10 text-white/80 border-0">
                            {item.category}
                          </Badge>
                        </div>
                        
                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.slice(0, 2).map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-xs bg-transparent border-white/20 text-white/60"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {item.tags.length > 2 && (
                              <Badge 
                                variant="outline" 
                                className="text-xs bg-transparent border-white/20 text-white/60"
                              >
                                +{item.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Project Card Component
interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
  onToggleFavorite: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

function ProjectCard({ project, index, onSelect, onToggleFavorite, onDelete }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => onSelect(project)}
    >
      <Card className="glass-card border-0 hover:bg-white/10 transition-all duration-300 h-full">
        <div className="p-6 space-y-4">
          {/* Project Image */}
          {project.coverImage && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <ImageWithFallback
                src={project.coverImage}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${project.color}`} />
                <h3 className="font-medium truncate">{project.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(project.id);
                }}
                className="w-8 h-8 p-0 hover:bg-white/10"
              >
                <Star className={`w-4 h-4 ${project.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 hover:bg-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-0">
                  <DropdownMenuItem onClick={() => onSelect(project)}>
                    <Folder className="w-4 h-4 mr-2" />
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-400"
                    onClick={() => onDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status and Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`glass-card border ${statusColors[project.status]}`}>
              {project.status}
            </Badge>
            {project.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="glass-card border-0 bg-white/5 text-xs">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 2 && (
              <Badge variant="outline" className="glass-card border-0 bg-white/5 text-xs">
                +{project.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Folder className="w-4 h-4" />
                <span>{project.totalAssets}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{project.collaborators}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(project.lastModified)}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Asset Thumbnail Component
interface AssetThumbnailProps {
  asset: ProjectAsset;
  index: number;
  isSelected: boolean;
  bulkSelectionMode: boolean;
  onToggleSelection: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (asset: ProjectAsset) => void;
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <TypeIcon className="w-8 h-8 text-white/60" />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Duration for video/audio */}
        {asset.duration && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(asset.duration)}
          </div>
        )}
        
        {/* Label */}
        {asset.label && (
          <div className="absolute top-2 left-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded">
            {asset.label}
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
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>{formatFileSize(asset.size)}</span>
          {asset.linkedCampaigns.length > 0 && (
            <div className="flex items-center gap-1">
              <Link className="w-3 h-3" />
              <span>{asset.linkedCampaigns.length}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Asset List Item Component
interface AssetListItemProps {
  asset: ProjectAsset;
  index: number;
  isSelected: boolean;
  bulkSelectionMode: boolean;
  onToggleSelection: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (asset: ProjectAsset) => void;
}

function AssetListItem({
  asset,
  index,
  isSelected,
  bulkSelectionMode,
  onToggleSelection,
  onToggleFavorite,
  onDelete,
  onPreview
}: AssetListItemProps) {
  const TypeIcon = typeIcons[asset.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group cursor-pointer ${isSelected ? 'bg-blue-500/10' : ''}`}
      onClick={() => {
        if (bulkSelectionMode) {
          onToggleSelection(asset.id);
        } else {
          onPreview(asset);
        }
      }}
    >
      <Card className="glass-card border-0 hover:bg-white/10 transition-all duration-300 p-4">
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            {asset.type === 'image' ? (
              <ImageWithFallback
                src={asset.thumbnail || asset.url}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <TypeIcon className="w-5 h-5 text-white/60" />
              </div>
            )}
          </div>
          
          {/* Selection checkbox */}
          {bulkSelectionMode && (
            <Checkbox
              checked={isSelected}
              onChange={() => onToggleSelection(asset.id)}
            />
          )}
          
          {/* Asset info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium truncate">{asset.name}</p>
              {asset.label && (
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                  {asset.label}
                </Badge>
              )}
              {asset.favorite && (
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</span>
              <span>{formatFileSize(asset.size)}</span>
              {asset.duration && <span>{formatDuration(asset.duration)}</span>}
              {asset.resolution && <span>{asset.resolution}</span>}
              <span>{formatDate(asset.lastModified)}</span>
            </div>
            
            {asset.note && (
              <p className="text-sm text-muted-foreground mt-1 truncate">{asset.note}</p>
            )}
            
            {asset.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {asset.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="glass-card border-0 bg-white/5 text-xs">
                    {tag}
                  </Badge>
                ))}
                {asset.tags.length > 3 && (
                  <Badge variant="outline" className="glass-card border-0 bg-white/5 text-xs">
                    +{asset.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Linked campaigns */}
          {asset.linkedCampaigns.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Link className="w-4 h-4" />
              <span>{asset.linkedCampaigns.length} campaigns</span>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(asset.id);
              }}
              className="w-8 h-8 p-0 hover:bg-white/10"
            >
              <Star className={`w-4 h-4 ${asset.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(asset.id);
              }}
              className="w-8 h-8 p-0 hover:bg-white/10 text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Preview Modal Component
interface PreviewModalProps {
  asset: ProjectAsset | null;
  open: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

function PreviewModal({ asset, open, onClose, onToggleFavorite, onDelete }: PreviewModalProps) {
  const [note, setNote] = useState('');
  const [label, setLabel] = useState('');

  if (!asset) return null;

  const handleSaveMetadata = () => {
    // In a real app, this would update the asset
    console.log('Saving metadata:', { note, label });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dark-solid-input-card max-w-5xl border-0 bg-gray-900/98 backdrop-blur-none shadow-2xl">
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
            {/* Details */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</span>
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
              </div>
            </div>

            {/* Current Note & Label */}
            {(asset.note || asset.label) && (
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Current Status</h3>
                {asset.label && (
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30 mb-2">
                    {asset.label}
                  </Badge>
                )}
                {asset.note && (
                  <p className="text-gray-300 text-sm">{asset.note}</p>
                )}
              </div>
            )}

            {/* Add Note & Label */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Add Note & Label</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-200">Label</label>
                  <Input
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="bg-gray-800/80 border border-gray-600/50 text-white"
                    placeholder="e.g., Approved, Needs review..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block text-gray-200">Note</label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="bg-gray-800/80 border border-gray-600/50 text-white"
                    rows={3}
                    placeholder="Add your note..."
                  />
                </div>
                
                <Button
                  onClick={handleSaveMetadata}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!note.trim() && !label.trim()}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Save Metadata
                </Button>
              </div>
            </div>

            {/* Tags */}
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

            {/* Linked Campaigns */}
            {asset.linkedCampaigns.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Linked Campaigns</h3>
                <div className="space-y-2">
                  {asset.linkedCampaigns.map((campaign, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded bg-gray-800/50">
                      <Link className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300 text-sm">{campaign}</span>
                    </div>
                  ))}
                </div>
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

// Activity Modal Component
interface ActivityModalProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
}

function ActivityModal({ open, onClose, projectName }: ActivityModalProps) {
  const mockActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'upload',
      message: 'uploaded Hero Video Final.mp4',
      timestamp: '2024-01-20T14:22:00Z',
      user: 'Sarah Chen'
    },
    {
      id: '2',
      type: 'comment',
      message: 'added note to Product Shot 01.jpg: "Client approved version"',
      timestamp: '2024-01-20T12:15:00Z',
      user: 'Mike Johnson'
    },
    {
      id: '3',
      type: 'favorite',
      message: 'marked Hero Video Final.mp4 as favorite',
      timestamp: '2024-01-20T11:30:00Z',
      user: 'Sarah Chen'
    },
    {
      id: '4',
      type: 'move',
      message: 'moved Brand Logo.png to Reels folder',
      timestamp: '2024-01-19T16:45:00Z',
      user: 'Alex Rivera'
    },
    {
      id: '5',
      type: 'delete',
      message: 'deleted old_draft_video.mp4',
      timestamp: '2024-01-19T14:20:00Z',
      user: 'Sarah Chen'
    }
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4 text-green-400" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-400" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'move': return <Move className="w-4 h-4 text-orange-400" />;
      case 'favorite': return <Heart className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dark-solid-input-card max-w-2xl border-0 bg-gray-900/98 backdrop-blur-none shadow-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Project Activity
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-sm">
            Recent updates and changes in {projectName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="space-y-4">
            {mockActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/30">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium text-white">{activity.user}</span>{' '}
                    {activity.message}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatDate(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t border-gray-700/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-700/80 border border-gray-600/50 text-gray-200 hover:bg-gray-600/80"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}