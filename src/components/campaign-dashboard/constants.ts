// Campaign Dashboard Constants and Mock Data

export interface Campaign {
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

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Todo' | 'In Progress' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo?: {
    id: string;
    name: string;
    avatar: string;
    initials: string;
  };
  dueDate: string;
  tags: string[];
  createdAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'audio';
  size: number;
  url?: string;
  uploadedAt: string;
  uploadedBy: {
    id: string;
    name: string;
    avatar: string;
    initials: string;
  };
  tags: string[];
}

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Create Instagram Reel Script',
    description: 'Write engaging script for summer collection reel',
    status: 'In Progress',
    priority: 'High',
    assignedTo: { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
    dueDate: '2024-08-05',
    tags: ['Content', 'Instagram'],
    createdAt: '2024-07-25'
  },
  {
    id: '2',
    title: 'Design Carousel Graphics',
    description: 'Create 5 slides for product features carousel',
    status: 'Todo',
    priority: 'High',
    assignedTo: { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' },
    dueDate: '2024-08-08',
    tags: ['Design', 'Carousel'],
    createdAt: '2024-07-26'
  },
  {
    id: '3',
    title: 'Approve PR Release',
    description: 'Review and approve press release draft',
    status: 'Done',
    priority: 'Medium',
    assignedTo: { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' },
    dueDate: '2024-07-30',
    tags: ['PR', 'Approval'],
    createdAt: '2024-07-22'
  }
];

export const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Summer_Collection_Hero.jpg',
    type: 'image',
    size: 2400000,
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    uploadedAt: '2024-07-28',
    uploadedBy: { id: '1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150', initials: 'SC' },
    tags: ['Hero', 'Campaign']
  },
  {
    id: '2',
    name: 'Product_Demo_Video.mp4',
    type: 'video',
    size: 15600000,
    uploadedAt: '2024-07-26',
    uploadedBy: { id: '2', name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', initials: 'MJ' },
    tags: ['Demo', 'Video']
  },
  {
    id: '3',
    name: 'Brand_Guidelines.pdf',
    type: 'document',
    size: 850000,
    uploadedAt: '2024-07-24',
    uploadedBy: { id: '3', name: 'Emily Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', initials: 'ER' },
    tags: ['Guidelines', 'Brand']
  }
];

export const budgetCategories = [
  { name: 'Meta Ads', allocated: 15000, spent: 12400, color: '#3B82F6' },
  { name: 'Influencers', allocated: 8000, spent: 6200, color: '#8B5CF6' },
  { name: 'Print Media', allocated: 12000, spent: 8900, color: '#10B981' },
  { name: 'PR & Events', allocated: 10000, spent: 4500, color: '#F59E0B' },
  { name: 'Production', allocated: 5000, spent: 2000, color: '#EF4444' }
];

export const kpiData = [
  { label: 'Views', value: '127.5K', change: '+12.5%', positive: true, icon: 'Eye' },
  { label: 'Clicks', value: '8.2K', change: '+8.3%', positive: true, icon: 'MousePointer' },
  { label: 'Engagement', value: '6.4%', change: '+2.1%', positive: true, icon: 'Heart' },
  { label: 'Conversions', value: '342', change: '+15.8%', positive: true, icon: 'TrendingUp' }
];

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': case 'Done': case 'Published': return 'bg-green-500';
    case 'Draft': case 'Todo': return 'bg-yellow-500';
    case 'In Progress': case 'Review': return 'bg-blue-500';
    case 'Paused': case 'Completed': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'text-red-400 bg-red-500/10 border-red-500/20';
    case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    case 'Low': return 'text-green-400 bg-green-500/10 border-green-500/20';
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  }
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};