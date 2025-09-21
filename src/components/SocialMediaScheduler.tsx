import { useState } from 'react';
import * as React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Instagram, Facebook, Twitter, Linkedin, Youtube, Image, Video, FileText, Headphones, Trash2, Clock, Edit3, Upload, Library, Music, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Checkbox } from './ui/checkbox';

interface Post {
  id: string;
  title: string;
  content: string;
  type: 'Post' | 'Reel' | 'Blog' | 'Audio' | 'Video';
  platform: 'Instagram' | 'Facebook' | 'Twitter' | 'LinkedIn' | 'YouTube';
  platforms?: ('Instagram' | 'Facebook' | 'Twitter' | 'LinkedIn' | 'YouTube')[];
  thumbnail?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
}

interface NewPost {
  title: string;
  content: string;
  type: 'Post' | 'Video' | 'Blog' | 'Tweet';
  platforms: string[];
  thumbnail: string;
  scheduledTime: string;
  scheduledDate?: string;
  source: 'library' | 'upload';
  caption?: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  posts: Post[];
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: 'AI Innovation Summit',
    content: 'Join us for the biggest AI event of the year! Discover breakthrough technologies and network with industry leaders.',
    type: 'Post',
    platform: 'Instagram',
    thumbnail: '🚀',
    scheduledDate: '2025-01-25',
    scheduledTime: '09:00',
    createdAt: '2025-01-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'Product Demo Video',
    content: 'See our latest features in action! This comprehensive demo covers everything you need to know.',
    type: 'Reel',
    platform: 'Instagram',
    thumbnail: '🎬',
    scheduledDate: '2025-01-25',
    scheduledTime: '14:30',
    createdAt: '2025-01-20T11:00:00Z'
  },
  {
    id: '3',
    title: 'Market Analysis Report',
    content: 'Deep dive into Q1 market trends and predictions for the technology sector.',
    type: 'Blog',
    platform: 'LinkedIn',
    thumbnail: '📊',
    scheduledDate: '2025-01-25',
    scheduledTime: '17:00',
    createdAt: '2025-01-20T12:00:00Z'
  },
  {
    id: '4',
    title: 'Weekly Tech Podcast',
    content: 'Weekly discussion featuring industry experts talking about AI and machine learning.',
    type: 'Audio',
    platform: 'YouTube',
    thumbnail: '🎙️',
    scheduledDate: '2025-01-27',
    scheduledTime: '10:00',
    createdAt: '2025-01-21T09:00:00Z'
  },
  {
    id: '5',
    title: 'Tutorial Series',
    content: 'Complete guide to getting started with our platform - perfect for beginners.',
    type: 'Video',
    platform: 'YouTube',
    thumbnail: '📹',
    createdAt: '2025-01-21T10:00:00Z'
  },
  {
    id: '6',
    title: 'Community Highlights',
    content: 'Celebrating our amazing community members and their achievements this month.',
    type: 'Post',
    platform: 'Twitter',
    thumbnail: '👥',
    createdAt: '2025-01-21T11:00:00Z'
  },
  {
    id: '7',
    title: 'Behind the Scenes',
    content: 'Take a look at our development process and meet the team behind the magic.',
    type: 'Reel',
    platform: 'Instagram',
    thumbnail: '🎭',
    scheduledDate: '2025-01-27',
    scheduledTime: '15:45',
    createdAt: '2025-01-21T12:00:00Z'
  },
  {
    id: '8',
    title: 'Industry Interview',
    content: 'Exclusive conversation with leading tech innovators about the future of AI.',
    type: 'Audio',
    platform: 'YouTube',
    thumbnail: '🎤',
    createdAt: '2025-01-21T13:00:00Z'
  },
  {
    id: '9',
    title: 'Quick Tips Thread',
    content: 'Essential productivity tips for developers and creators in a easy-to-read format.',
    type: 'Post',
    platform: 'Twitter',
    thumbnail: '💡',
    scheduledDate: '2025-01-28',
    scheduledTime: '12:00',
    createdAt: '2025-01-21T14:00:00Z'
  },
  {
    id: '10',
    title: 'Launch Announcement',
    content: 'Big news! We\'re excited to announce our latest product launch with exciting new features.',
    type: 'Post',
    platform: 'LinkedIn',
    thumbnail: '🎉',
    scheduledDate: '2025-01-28',
    scheduledTime: '16:30',
    createdAt: '2025-01-21T15:00:00Z'
  }
];

const platformIcons = {
  Instagram: Instagram,
  Facebook: Facebook,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  YouTube: Youtube
};

const platformColors = {
  Instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  Facebook: 'bg-blue-600',
  Twitter: 'bg-sky-500',
  LinkedIn: 'bg-blue-700',
  YouTube: 'bg-red-600'
};

const typeIcons = {
  Post: Image,
  Reel: Video,
  Blog: FileText,
  Audio: Headphones,
  Video: Video
};

// Platform-specific heatmap data (24 hours x 7 days)
const platformHeatmapData = {
  instagram: [
    {
      day: 'Mon',
      hours: [15, 12, 10, 8, 6, 8, 12, 20, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 88, 75, 65, 50, 35, 25]
    },
    {
      day: 'Tue', 
      hours: [18, 15, 12, 10, 8, 10, 15, 25, 35, 45, 55, 65, 75, 80, 85, 90, 95, 100, 92, 80, 70, 55, 40, 30]
    },
    {
      day: 'Wed',
      hours: [20, 16, 13, 11, 9, 12, 18, 28, 38, 48, 58, 68, 78, 83, 88, 92, 96, 92, 85, 78, 68, 58, 45, 32]
    },
    {
      day: 'Thu',
      hours: [22, 18, 15, 12, 10, 15, 22, 32, 42, 52, 62, 72, 82, 87, 92, 96, 98, 96, 90, 82, 72, 62, 50, 35]
    },
    {
      day: 'Fri',
      hours: [25, 20, 17, 14, 12, 18, 25, 35, 45, 55, 65, 75, 85, 90, 95, 98, 100, 98, 95, 90, 85, 75, 65, 45]
    },
    {
      day: 'Sat',
      hours: [30, 25, 22, 18, 15, 22, 30, 40, 50, 60, 70, 80, 88, 92, 95, 90, 85, 80, 75, 70, 65, 60, 55, 40]
    },
    {
      day: 'Sun',
      hours: [28, 23, 20, 16, 12, 18, 28, 38, 48, 58, 68, 78, 85, 88, 90, 85, 80, 75, 70, 65, 60, 55, 50, 38]
    }
  ],
  linkedin: [
    {
      day: 'Mon',
      hours: [5, 8, 12, 15, 20, 25, 35, 45, 60, 75, 85, 90, 95, 88, 80, 70, 60, 45, 35, 25, 18, 12, 8, 5]
    },
    {
      day: 'Tue', 
      hours: [8, 10, 15, 18, 25, 30, 40, 50, 65, 80, 90, 95, 98, 92, 85, 75, 65, 50, 40, 30, 22, 15, 10, 8]
    },
    {
      day: 'Wed',
      hours: [10, 12, 18, 22, 28, 35, 45, 55, 70, 85, 92, 96, 100, 95, 88, 78, 68, 55, 45, 35, 25, 18, 12, 10]
    },
    {
      day: 'Thu',
      hours: [12, 15, 20, 25, 30, 38, 48, 58, 72, 87, 94, 98, 96, 90, 82, 72, 62, 52, 42, 32, 28, 20, 15, 12]
    },
    {
      day: 'Fri',
      hours: [8, 12, 16, 20, 25, 32, 42, 52, 65, 78, 85, 88, 85, 78, 70, 60, 50, 40, 30, 25, 20, 16, 12, 8]
    },
    {
      day: 'Sat',
      hours: [5, 8, 10, 12, 15, 18, 22, 28, 35, 42, 48, 52, 55, 50, 45, 38, 32, 25, 20, 15, 12, 10, 8, 5]
    },
    {
      day: 'Sun',
      hours: [3, 5, 8, 10, 12, 15, 18, 22, 28, 35, 40, 45, 48, 42, 38, 32, 28, 22, 18, 15, 12, 10, 8, 5]
    }
  ],
  twitter: [
    {
      day: 'Mon',
      hours: [25, 20, 18, 15, 12, 15, 20, 30, 40, 50, 60, 70, 75, 80, 85, 88, 85, 80, 75, 65, 55, 45, 35, 30]
    },
    {
      day: 'Tue', 
      hours: [28, 22, 20, 18, 15, 18, 25, 35, 45, 55, 65, 75, 80, 85, 90, 92, 90, 85, 80, 70, 60, 50, 40, 32]
    },
    {
      day: 'Wed',
      hours: [30, 25, 22, 20, 18, 22, 28, 38, 48, 58, 68, 78, 85, 90, 95, 96, 95, 90, 85, 75, 65, 55, 45, 35]
    },
    {
      day: 'Thu',
      hours: [32, 28, 25, 22, 20, 25, 32, 42, 52, 62, 72, 82, 88, 92, 96, 98, 96, 92, 88, 78, 68, 58, 48, 38]
    },
    {
      day: 'Fri',
      hours: [35, 30, 28, 25, 22, 28, 35, 45, 55, 65, 75, 85, 90, 95, 98, 100, 98, 95, 90, 80, 70, 60, 50, 42]
    },
    {
      day: 'Sat',
      hours: [30, 25, 22, 20, 18, 22, 28, 35, 45, 55, 65, 72, 78, 82, 85, 82, 78, 72, 65, 58, 50, 42, 35, 30]
    },
    {
      day: 'Sun',
      hours: [28, 22, 20, 18, 15, 18, 25, 32, 40, 48, 55, 62, 68, 72, 75, 72, 68, 62, 55, 48, 40, 35, 30, 25]
    }
  ],
  facebook: [
    {
      day: 'Mon',
      hours: [12, 10, 8, 6, 5, 8, 12, 18, 25, 35, 45, 55, 65, 70, 75, 78, 80, 75, 70, 60, 50, 40, 25, 18]
    },
    {
      day: 'Tue', 
      hours: [15, 12, 10, 8, 6, 10, 15, 22, 30, 40, 50, 60, 70, 75, 80, 82, 85, 80, 75, 65, 55, 45, 30, 22]
    },
    {
      day: 'Wed',
      hours: [18, 15, 12, 10, 8, 12, 18, 25, 35, 45, 55, 65, 75, 80, 85, 88, 90, 85, 80, 70, 60, 50, 35, 25]
    },
    {
      day: 'Thu',
      hours: [20, 18, 15, 12, 10, 15, 22, 30, 40, 50, 60, 70, 80, 85, 90, 92, 95, 90, 85, 75, 65, 55, 40, 30]
    },
    {
      day: 'Fri',
      hours: [22, 20, 18, 15, 12, 18, 25, 35, 45, 55, 65, 75, 85, 90, 95, 96, 98, 95, 90, 80, 70, 60, 45, 35]
    },
    {
      day: 'Sat',
      hours: [25, 22, 20, 18, 15, 20, 28, 38, 48, 58, 68, 78, 88, 92, 96, 100, 98, 96, 92, 85, 75, 65, 50, 40]
    },
    {
      day: 'Sun',
      hours: [22, 20, 18, 15, 12, 18, 25, 35, 45, 55, 65, 75, 85, 88, 92, 95, 92, 88, 85, 78, 68, 58, 45, 35]
    }
  ],
  youtube: [
    {
      day: 'Mon',
      hours: [8, 10, 12, 15, 18, 22, 28, 35, 42, 50, 58, 65, 70, 75, 80, 85, 88, 90, 85, 78, 70, 60, 45, 25]
    },
    {
      day: 'Tue', 
      hours: [10, 12, 15, 18, 22, 25, 32, 40, 48, 55, 62, 70, 75, 80, 85, 90, 92, 95, 90, 82, 75, 65, 50, 30]
    },
    {
      day: 'Wed',
      hours: [12, 15, 18, 22, 25, 30, 38, 45, 52, 60, 68, 75, 80, 85, 90, 95, 96, 98, 95, 88, 80, 70, 55, 35]
    },
    {
      day: 'Thu',
      hours: [15, 18, 22, 25, 28, 35, 42, 50, 58, 65, 72, 80, 85, 90, 95, 98, 100, 98, 95, 90, 82, 72, 58, 40]
    },
    {
      day: 'Fri',
      hours: [18, 22, 25, 28, 32, 38, 45, 52, 60, 68, 75, 82, 88, 92, 96, 96, 95, 92, 88, 82, 75, 65, 52, 38]
    },
    {
      day: 'Sat',
      hours: [22, 25, 28, 32, 35, 40, 48, 55, 62, 70, 78, 85, 90, 95, 98, 100, 98, 95, 90, 85, 78, 70, 60, 45]
    },
    {
      day: 'Sun',
      hours: [20, 22, 25, 28, 32, 38, 45, 52, 58, 65, 72, 78, 82, 85, 88, 90, 88, 85, 82, 78, 72, 65, 55, 42]
    }
  ]
};

// Platform options for dropdown
const platformOptionsHeatmap = [
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-700' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' }
];

const PostCard = ({ post, isInCalendar = false, onDelete, onEdit }: { 
  post: Post; 
  isInCalendar?: boolean; 
  onDelete?: (id: string) => void;
  onEdit?: (post: Post) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'post',
    item: { id: post.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const PlatformIcon = platformIcons[post.platform];
  const TypeIcon = typeIcons[post.type];

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const handleCardClick = () => {
    if (onEdit) {
      onEdit(post);
    }
  };

  return (
    <div
      ref={drag}
      className={`${isInCalendar ? 'w-full mb-1' : 'w-full'} ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } cursor-grab active:cursor-grabbing`}
    >
      <Card 
        className={`glass-card border-0 p-3 hover:bg-white/10 transition-all duration-200 group cursor-pointer ${
          isInCalendar ? 'text-xs' : 'text-sm'
        }`}
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm ${platformColors[post.platform]}`}>
              <PlatformIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <TypeIcon className="w-3 h-3 text-muted-foreground" />
              <span className="font-medium truncate">{post.title}</span>
            </div>
            {!isInCalendar && (
              <p className="text-muted-foreground text-xs leading-relaxed truncate">{post.content}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs glass-card border-0 bg-white/5">
                  {post.type}
                </Badge>
                {post.platforms && post.platforms.length > 1 && (
                  <Badge variant="outline" className="text-xs glass-card border-0 bg-blue-500/20 text-blue-400">
                    {post.platforms.length} platforms
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {post.scheduledTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {post.scheduledTime}
                    </span>
                  </div>
                )}
                {post.scheduledDate && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 text-xl">
              {post.thumbnail}
            </div>
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteClick}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto w-auto hover:bg-red-500/20"
              >
                <Trash2 className="w-3 h-3 text-red-400" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const CalendarCell = ({ 
  day, 
  onDrop,
  onEdit
}: { 
  day: CalendarDay; 
  onDrop: (postId: string, date: string) => void;
  onEdit?: (post: Post) => void;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'post',
    drop: (item: { id: string }) => {
      onDrop(item.id, day.date.toISOString().split('T')[0]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const isToday = new Date().toDateString() === day.date.toDateString();
  const hasMultiplePosts = day.posts.length > 1;
  const sortedPosts = day.posts.sort((a, b) => {
    if (a.scheduledTime && b.scheduledTime) {
      return a.scheduledTime.localeCompare(b.scheduledTime);
    }
    return 0;
  });

  return (
    <div
      ref={drop}
      className={`min-h-32 p-2 border border-white/10 transition-all duration-200 relative ${
        !day.isCurrentMonth ? 'bg-white/5 text-muted-foreground' : ''
      } ${isOver ? 'bg-blue-500/20 border-blue-500/40 scale-[1.02]' : ''} ${
        isToday ? 'bg-blue-500/10 border-blue-500/30' : ''
      } ${day.posts.length > 2 ? 'border-green-500/30 bg-green-500/5' : hasMultiplePosts ? 'border-blue-500/20 bg-blue-500/5' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${isToday ? 'text-blue-400' : ''}`}>
          {day.date.getDate()}
        </span>
        {day.posts.length > 0 && (
          <Badge 
            variant="outline" 
            className={`text-xs px-2 py-0 glass-card border-0 ${
              day.posts.length > 2 
                ? 'bg-green-500/20 text-green-400' 
                : day.posts.length > 1 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-white/10'
            }`}
          >
            {day.posts.length}
          </Badge>
        )}
      </div>
      <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-hide">
        {sortedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <PostCard post={post} isInCalendar onEdit={onEdit} />
          </motion.div>
        ))}
      </div>
      {isOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500/40 border-dashed rounded flex items-center justify-center"
        >
          <span className="text-sm text-blue-400 font-medium">Drop here</span>
        </motion.div>
      )}
    </div>
  );
};

const EditPostModal = ({ 
  post, 
  isOpen, 
  onClose, 
  onUpdatePost 
}: { 
  post: Post | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onUpdatePost: (post: Post) => void; 
}) => {
  const [step, setStep] = useState(1);
  const [editedPost, setEditedPost] = useState<NewPost>({
    title: '',
    content: '',
    type: 'Post',
    platforms: [],
    thumbnail: '📝',
    scheduledTime: '09:00',
    source: 'library',
    caption: ''
  });

  // Update editedPost when post prop changes
  React.useEffect(() => {
    if (post) {
      setEditedPost({
        title: post.title,
        content: post.content,
        type: post.type === 'Post' ? 'Post' : post.type === 'Video' ? 'Video' : post.type === 'Blog' ? 'Blog' : 'Tweet',
        platforms: post.platforms || [post.platform],
        thumbnail: post.thumbnail || '📝',
        scheduledTime: post.scheduledTime || '09:00',
        scheduledDate: post.scheduledDate,
        source: 'library',
        caption: post.content
      });
    }
  }, [post]);

  const contentTypes = [
    { value: 'Post', label: 'Post', icon: Image, description: 'Share images and text content' },
    { value: 'Video', label: 'Video', icon: Video, description: 'Upload and share video content' },
    { value: 'Blog', label: 'Blog', icon: FileText, description: 'Write and publish blog articles' },
    { value: 'Tweet', label: 'Tweet', icon: Twitter, description: 'Create social media posts' }
  ];

  const getPlatformOptions = (contentType: string) => {
    switch (contentType) {
      case 'Post':
      case 'Video':
        return ['Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'Twitter'];
      case 'Blog':
        return ['LinkedIn'];
      case 'Tweet':
        return ['Facebook', 'Twitter', 'LinkedIn'];
      default:
        return [];
    }
  };

  const needsCaption = (contentType: string) => {
    return contentType === 'Post' || contentType === 'Video' || contentType === 'Tweet';
  };

  const thumbnailOptions = ['📝', '🚀', '🎬', '📊', '🎙️', '📹', '👥', '🎭', '🎤', '💡', '🎉', '🔥', '✨', '💎', '🌟', '🎯', '🚨', '🎊', '💯', '👑'];

  const handleSubmit = () => {
    if (editedPost.title.trim() && editedPost.platforms.length > 0 && post) {
      const updatedPost: Post = {
        ...post,
        title: editedPost.title,
        content: editedPost.caption || editedPost.content,
        type: editedPost.type === 'Tweet' ? 'Post' : editedPost.type as any,
        platform: editedPost.platforms[0] as any,
        platforms: editedPost.platforms as any,
        thumbnail: editedPost.thumbnail,
        scheduledDate: editedPost.scheduledDate,
        scheduledTime: editedPost.scheduledTime
      };
      onUpdatePost(updatedPost);
      setStep(1);
      onClose();
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlatformToggle = (platform: string) => {
    setEditedPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const resetModal = () => {
    setStep(1);
  };

  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetModal();
        onClose();
      }
    }}>
      <DialogContent className="bg-black/95 backdrop-blur-xl border border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide text-white shadow-2xl">
        <DialogHeader>
          <div>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Edit3 className="w-5 h-5 text-white" />
              Edit Content
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Step {step} of 4: {step === 1 ? 'Content type' : step === 2 ? 'Source' : step === 3 ? 'Configure content' : 'Schedule & publish'}
            </DialogDescription>
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-blue-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Step 1: Content Type Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="font-medium text-white">What type of content is this?</h3>
              <div className="grid grid-cols-2 gap-4">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.value}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ease-out hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg ${
                        editedPost.type === type.value
                          ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/20 border-blue-400/60 shadow-blue-500/20 shadow-lg'
                          : 'bg-black/40 border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => setEditedPost({ ...editedPost, type: type.value as any, platforms: [] })}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-white" />
                        <span className="font-medium text-white">{type.label}</span>
                      </div>
                      <p className="text-sm text-white/60">{type.description}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Source Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="font-medium text-white">Content source</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ease-out hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg bg-gradient-to-br from-blue-500/30 to-purple-500/20 border-blue-400/60 shadow-blue-500/20 shadow-lg`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Library className="w-5 h-5 text-white" />
                    <span className="font-medium text-white">From Library</span>
                  </div>
                  <p className="text-sm text-white/60">Editing existing content</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Content Configuration */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  placeholder={`Enter ${editedPost.type.toLowerCase()} title...`}
                  value={editedPost.title}
                  onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                  className="bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder:text-white/50"
                />
              </div>

              {/* Caption (conditional) */}
              {needsCaption(editedPost.type) && (
                <div className="space-y-2">
                  <Label htmlFor="caption" className="text-white">Caption</Label>
                  <Textarea
                    id="caption"
                    placeholder="Write your caption..."
                    value={editedPost.caption}
                    onChange={(e) => setEditedPost({ ...editedPost, caption: e.target.value })}
                    className="bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder:text-white/50 min-h-24 resize-none"
                    rows={4}
                  />
                </div>
              )}

              {/* Platform Selection */}
              <div className="space-y-3">
                <Label className="text-white">Select Platform(s)</Label>
                <div className="space-y-2">
                  {getPlatformOptions(editedPost.type).map((platform) => {
                    const Icon = platformIcons[platform as keyof typeof platformIcons];
                    const isSelected = editedPost.platforms.includes(platform);
                    
                    return (
                      <div
                        key={platform}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ease-out cursor-pointer hover:scale-[1.02] ${
                          isSelected 
                            ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/20 border-blue-400/60 shadow-lg shadow-blue-500/20' 
                            : 'bg-black/40 border-white/20 hover:bg-white/10 hover:border-white/30'
                        }`}
                        onClick={() => handlePlatformToggle(platform)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handlePlatformToggle(platform)}
                          className="border-white/30"
                        />
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${platformColors[platform as keyof typeof platformColors]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-white">{platform}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thumbnail Selection */}
              <div className="space-y-2">
                <Label className="text-white">Thumbnail Emoji</Label>
                <div className="grid grid-cols-10 gap-2">
                  {thumbnailOptions.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="outline"
                      className={`bg-black/40 border border-white/20 p-2 h-auto aspect-square text-lg hover:bg-white/10 hover:scale-110 transition-all duration-300 ease-out ${
                        editedPost.thumbnail === emoji ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/20 border-blue-400/60 shadow-lg shadow-blue-500/20' : ''
                      }`}
                      onClick={() => setEditedPost({ ...editedPost, thumbnail: emoji })}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Scheduling */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="font-medium text-white">Schedule your {editedPost.type.toLowerCase()}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-white">Date (Optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editedPost.scheduledDate || ''}
                    onChange={(e) => setEditedPost({ ...editedPost, scheduledDate: e.target.value })}
                    className="bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-white">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={editedPost.scheduledTime}
                    onChange={(e) => setEditedPost({ ...editedPost, scheduledTime: e.target.value })}
                    className="bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-black/40 rounded-xl p-4 space-y-3 border border-white/20">
                <h4 className="font-medium">Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{editedPost.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platforms:</span>
                    <span>{editedPost.platforms.length} selected</span>
                  </div>
                  {editedPost.scheduledDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span>{new Date(editedPost.scheduledDate).toLocaleDateString()} at {editedPost.scheduledTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={step === 1 ? onClose : handleBack}
              className="bg-black/40 border border-white/20 hover:bg-white/10 text-white transition-all duration-300 ease-out hover:scale-105"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            {step < 4 ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (step === 1 && !editedPost.type) ||
                  (step === 3 && (!editedPost.title.trim() || editedPost.platforms.length === 0))
                }
                className="bg-gradient-to-r from-blue-500/30 to-blue-600/20 border border-blue-400/60 hover:from-blue-500/40 hover:to-blue-600/30 text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!editedPost.title.trim() || editedPost.platforms.length === 0}
                className="bg-gradient-to-r from-green-500/30 to-emerald-500/20 border border-green-400/60 hover:from-green-500/40 hover:to-emerald-500/30 text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
              >
                Update & Schedule
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CreatePostModal = ({ onCreatePost }: { onCreatePost: (post: NewPost) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [newPost, setNewPost] = useState<NewPost>({
    title: '',
    content: '',
    type: 'Post',
    platforms: [],
    thumbnail: '📝',
    scheduledTime: '09:00',
    source: 'library',
    caption: ''
  });

  const contentTypes = [
    { value: 'Post', label: 'Post', icon: Image, description: 'Share images and text content' },
    { value: 'Video', label: 'Video', icon: Video, description: 'Upload and share video content' },
    { value: 'Blog', label: 'Blog', icon: FileText, description: 'Write and publish blog articles' },
    { value: 'Tweet', label: 'Tweet', icon: Twitter, description: 'Create social media posts' }
  ];

  const getPlatformOptions = (contentType: string) => {
    switch (contentType) {
      case 'Post':
      case 'Video':
        return ['Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'Twitter'];
      case 'Blog':
        return ['LinkedIn'];
      case 'Tweet':
        return ['Facebook', 'Twitter', 'LinkedIn'];
      default:
        return [];
    }
  };

  const needsCaption = (contentType: string) => {
    return contentType === 'Post' || contentType === 'Video' || contentType === 'Tweet';
  };

  const thumbnailOptions = ['📝', '🚀', '🎬', '📊', '🎙️', '📹', '👥', '🎭', '🎤', '💡', '🎉', '🔥', '✨', '💎', '🌟', '🎯', '🚨', '🎊', '💯', '👑'];

  const handleSubmit = () => {
    if (newPost.title.trim() && newPost.platforms.length > 0) {
      onCreatePost(newPost);
      setNewPost({
        title: '',
        content: '',
        type: 'Post',
        platforms: [],
        thumbnail: '📝',
        scheduledTime: '09:00',
        source: 'library',
        caption: ''
      });
      setStep(1);
      setIsOpen(false);
    }
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlatformToggle = (platform: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const resetModal = () => {
    setStep(1);
    setNewPost({
      title: '',
      content: '',
      type: 'Post',
      platforms: [],
      thumbnail: '📝',
      scheduledTime: '09:00',
      source: 'library',
      caption: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetModal();
    }}>
      <DialogTrigger asChild>
        <Button className="glass-card border-0 hover:bg-white/10 shrink-0 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Post
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 backdrop-blur-xl border border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide text-white shadow-2xl">
        <DialogHeader>
          <div>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Edit3 className="w-5 h-5 text-white" />
              Create New Content
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Step {step} of 4: {step === 1 ? 'Choose content type' : step === 2 ? 'Select source' : step === 3 ? 'Configure content' : 'Schedule & publish'}
            </DialogDescription>
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-blue-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Step 1: Content Type Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="font-medium text-white">What type of content do you want to create?</h3>
              <div className="grid grid-cols-2 gap-4">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.value}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ease-out hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg ${
                        newPost.type === type.value
                          ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/20 border-blue-400/60 shadow-blue-500/20 shadow-lg'
                          : 'bg-black/40 border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => setNewPost({ ...newPost, type: type.value as any, platforms: [] })}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-white" />
                        <span className="font-medium text-white">{type.label}</span>
                      </div>
                      <p className="text-sm text-white/60">{type.description}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Source Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="font-medium text-white">Where would you like to get your {newPost.type.toLowerCase()}?</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ease-out hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg ${
                    newPost.source === 'library'
                      ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/20 border-blue-400/60 shadow-blue-500/20 shadow-lg'
                      : 'bg-black/40 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setNewPost({ ...newPost, source: 'library' })}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Library className="w-5 h-5 text-white" />
                    <span className="font-medium text-white">From Library</span>
                  </div>
                  <p className="text-sm text-white/60">Choose from your existing content library</p>
                </div>
                <div
                  className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ease-out hover:bg-white/10 hover:scale-[1.02] hover:shadow-lg ${
                    newPost.source === 'upload'
                      ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/20 border-blue-400/60 shadow-blue-500/20 shadow-lg'
                      : 'bg-black/40 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setNewPost({ ...newPost, source: 'upload' })}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Upload className="w-5 h-5 text-white" />
                    <span className="font-medium text-white">Upload New</span>
                  </div>
                  <p className="text-sm text-white/60">Upload content from your device</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Content Configuration */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* File upload/selection area */}
              <div className="space-y-2">
                <Label className="text-white">Content {newPost.source === 'library' ? 'Selection' : 'Upload'}</Label>
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-all duration-300 ease-out bg-black/20 hover:bg-black/30">
                  <div className="flex flex-col items-center gap-3">
                    {newPost.source === 'library' ? (
                      <>
                        <Library className="w-8 h-8 text-white/60" />
                        <p className="font-medium text-white">Select from Library</p>
                        <p className="text-sm text-white/60">Choose from your saved content</p>
                        <Button variant="outline" className="bg-black/40 border border-white/20 hover:bg-white/10 text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                          Browse Library
                        </Button>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-white/60" />
                        <p className="font-medium text-white">Upload {newPost.type}</p>
                        <p className="text-sm text-white/60">Drag and drop or click to upload</p>
                        <Button variant="outline" className="bg-black/40 border border-white/20 hover:bg-white/10 text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
                          Choose File
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  placeholder={`Enter ${newPost.type.toLowerCase()} title...`}
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder:text-white/50"
                />
              </div>

              {/* Caption (conditional) */}
              {needsCaption(newPost.type) && (
                <div className="space-y-2">
                  <Label htmlFor="caption" className="text-white">Caption</Label>
                  <Textarea
                    id="caption"
                    placeholder="Write your caption..."
                    value={newPost.caption}
                    onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                    className="bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder:text-white/50 min-h-24 resize-none"
                    rows={4}
                  />
                </div>
              )}

              {/* Platform Selection */}
              <div className="space-y-3">
                <Label className="text-white">Select Platform(s)</Label>
                <div className="space-y-2">
                  {getPlatformOptions(newPost.type).map((platform) => {
                    const Icon = platformIcons[platform as keyof typeof platformIcons];
                    const isSelected = newPost.platforms.includes(platform);
                    
                    return (
                      <div
                        key={platform}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ease-out cursor-pointer hover:scale-[1.02] ${
                          isSelected 
                            ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/20 border-blue-400/60 shadow-lg shadow-blue-500/20' 
                            : 'bg-black/40 border-white/20 hover:bg-white/10 hover:border-white/30'
                        }`}
                        onClick={() => handlePlatformToggle(platform)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handlePlatformToggle(platform)}
                          className="border-white/30"
                        />
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-white ${platformColors[platform as keyof typeof platformColors]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-white">{platform}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Thumbnail Selection */}
              <div className="space-y-2">
                <Label className="text-white">Thumbnail Emoji</Label>
                <div className="grid grid-cols-10 gap-2">
                  {thumbnailOptions.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="outline"
                      className={`bg-black/40 border border-white/20 p-2 h-auto aspect-square text-lg hover:bg-white/10 hover:scale-110 transition-all duration-300 ease-out ${
                        newPost.thumbnail === emoji ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/20 border-blue-400/60 shadow-lg shadow-blue-500/20' : ''
                      }`}
                      onClick={() => setNewPost({ ...newPost, thumbnail: emoji })}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Scheduling */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="font-medium text-white">Schedule your {newPost.type.toLowerCase()}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-white">Date (Optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newPost.scheduledDate || ''}
                    onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                    className="bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-white">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newPost.scheduledTime}
                    onChange={(e) => setNewPost({ ...newPost, scheduledTime: e.target.value })}
                    className="bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-black/40 rounded-xl p-4 space-y-3 border border-white/20">
                <h4 className="font-medium">Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{newPost.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platforms:</span>
                    <span>{newPost.platforms.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source:</span>
                    <span className="capitalize">{newPost.source}</span>
                  </div>
                  {newPost.scheduledDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span>{new Date(newPost.scheduledDate).toLocaleDateString()} at {newPost.scheduledTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={step === 1 ? () => setIsOpen(false) : handleBack}
              className="bg-black/40 border border-white/20 hover:bg-white/10 text-white transition-all duration-300 ease-out hover:scale-105"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            {step < 4 ? (
              <Button 
                onClick={handleNext}
                disabled={
                  (step === 1 && !newPost.type) ||
                  (step === 2 && !newPost.source) ||
                  (step === 3 && (!newPost.title.trim() || newPost.platforms.length === 0))
                }
                className="bg-gradient-to-r from-blue-500/30 to-blue-600/20 border border-blue-400/60 hover:from-blue-500/40 hover:to-blue-600/30 text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!newPost.title.trim() || newPost.platforms.length === 0}
                className="bg-gradient-to-r from-green-500/30 to-emerald-500/20 border border-green-400/60 hover:from-green-500/40 hover:to-emerald-500/30 text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
              >
                Create & Schedule
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function SocialMediaScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHeatmapPlatform, setSelectedHeatmapPlatform] = useState('instagram');
  const [heatmapCollapsed, setHeatmapCollapsed] = useState(false);

  // Generate calendar days
  const generateCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfCalendar = new Date(firstDayOfMonth);
    firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfMonth.getDay());
    
    const days: CalendarDay[] = [];
    const currentDay = new Date(firstDayOfCalendar);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const dateStr = currentDay.toISOString().split('T')[0];
      const scheduledPosts = posts.filter(post => post.scheduledDate === dateStr);
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        posts: scheduledPosts
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays(currentDate);
  const unscheduledPosts = posts.filter(post => !post.scheduledDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    
    // Limit to 3 months ahead and 3 months back
    const now = new Date();
    const threeMonthsAhead = new Date(now.getFullYear(), now.getMonth() + 3, 1);
    const threeMonthsBack = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    
    if (newDate >= threeMonthsBack && newDate <= threeMonthsAhead) {
      setCurrentDate(newDate);
    }
  };

  const handleDrop = (postId: string, date: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, scheduledDate: date }
        : post
    ));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleCreatePost = (newPostData: NewPost) => {
    const newPost: Post = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: newPostData.title,
      content: newPostData.caption || newPostData.content,
      type: newPostData.type === 'Tweet' ? 'Post' : newPostData.type as any,
      platform: newPostData.platforms[0] as any,
      platforms: newPostData.platforms as any,
      thumbnail: newPostData.thumbnail,
      scheduledDate: newPostData.scheduledDate,
      scheduledTime: newPostData.scheduledTime,
      createdAt: new Date().toISOString()
    };
    setPosts([...posts, newPost]);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
    setEditingPost(null);
    setIsEditModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setEditingPost(null);
    setIsEditModalOpen(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const now = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const isAtStart = currentYear === now.getFullYear() && currentMonth === now.getMonth() - 3;
  const isAtEnd = currentYear === now.getFullYear() && currentMonth === now.getMonth() + 3;

  const scheduledPosts = posts.filter(post => post.scheduledDate);
  const totalPosts = posts.length;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-medium">Social Media Scheduler</h1>
            <p className="text-muted-foreground mt-1">
              Plan and schedule your social media content across multiple platforms and dates
            </p>
          </div>
          <div className="flex gap-3">
            <CreatePostModal onCreatePost={handleCreatePost} />
          </div>
        </motion.div>

        {/* Multi-Post Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card rounded-lg p-4 bg-gradient-to-r from-blue-500/5 to-green-500/5 border border-blue-500/20"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">Multiple Posts Per Day</h4>
              <p className="text-xs text-muted-foreground">
                Drag multiple content pieces to the same date. Posts automatically organize by time and you can schedule unlimited content per day.
              </p>
            </div>
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs glass-card border-0 bg-blue-500/20 text-blue-400">
                <Clock className="w-3 h-3 mr-1" />
                Time sorted
              </Badge>
              <Badge variant="outline" className="text-xs glass-card border-0 bg-green-500/20 text-green-400">∞ posts</Badge>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="glass-card border-0 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-semibold">{totalPosts}</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card border-0 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-semibold">{scheduledPosts.length}</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card border-0 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unscheduled</p>
                <p className="text-2xl font-semibold">{unscheduledPosts.length}</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card border-0 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Platforms</p>
                <p className="text-2xl font-semibold">5</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Optimal Posting Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Optimal Posting Schedule</h2>
            <div className="flex items-center gap-4">
              <Select value={selectedHeatmapPlatform} onValueChange={setSelectedHeatmapPlatform}>
                <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0 bg-black/90">
                  {platformOptionsHeatmap.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center gap-2">
                        <platform.icon className={`w-4 h-4 ${platform.color}`} />
                        {platform.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHeatmapCollapsed(!heatmapCollapsed)}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                {heatmapCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {!heatmapCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-x-auto"
            >
              {/* Platform Header */}
              <div className="flex items-center gap-3 mb-6">
                {(() => {
                  const selectedPlatformInfo = platformOptionsHeatmap.find(p => p.value === selectedHeatmapPlatform) || platformOptionsHeatmap[0];
                  return (
                    <>
                      <selectedPlatformInfo.icon className={`w-6 h-6 ${selectedPlatformInfo.color}`} />
                      <h3 className="text-lg font-medium text-white">
                        {selectedPlatformInfo.label} Engagement Patterns
                      </h3>
                    </>
                  );
                })()}
              </div>

              {/* Hour labels */}
              <div className="grid grid-cols-25 gap-1 min-w-[800px]">
                <div className="w-16"></div> {/* Day label space */}
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
                  const period = i < 12 ? 'AM' : 'PM';
                  return (
                    <div key={i} className="text-center text-xs text-gray-400 h-6 flex items-center justify-center">
                      {i % 4 === 0 ? `${hour}${period}` : ''}
                    </div>
                  );
                })}
              </div>
              
              {/* Heatmap grid */}
              <div className="space-y-1 min-w-[800px]">
                {(() => {
                  const currentHeatmapData = platformHeatmapData[selectedHeatmapPlatform as keyof typeof platformHeatmapData] || platformHeatmapData.instagram;
                  const getHeatmapColor = (value: number) => {
                    if (value >= 90) return 'bg-red-500';
                    if (value >= 80) return 'bg-orange-500';
                    if (value >= 60) return 'bg-yellow-500';
                    if (value >= 40) return 'bg-blue-500';
                    if (value >= 20) return 'bg-indigo-500';
                    return 'bg-gray-600';
                  };
                  
                  return currentHeatmapData.map((row, dayIndex) => (
                    <div key={row.day} className="grid grid-cols-25 gap-1">
                      <div className="w-16 text-sm text-gray-400 flex items-center">
                        {row.day}
                      </div>
                      {row.hours.map((value, hourIndex) => (
                        <div 
                          key={`${row.day}-${hourIndex}`}
                          className={`h-8 rounded ${getHeatmapColor(value)} flex items-center justify-center text-white text-xs font-medium transition-all duration-200 hover:scale-110 cursor-pointer`}
                          title={`${row.day} ${hourIndex}:00: ${value}% engagement`}
                        >
                          {value >= 80 ? value : ''}
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
              
              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <span className="text-sm text-gray-400">Low</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded bg-gray-600" title="0-20%"></div>
                  <div className="w-4 h-4 rounded bg-indigo-500" title="20-40%"></div>
                  <div className="w-4 h-4 rounded bg-blue-500" title="40-60%"></div>
                  <div className="w-4 h-4 rounded bg-yellow-500" title="60-80%"></div>
                  <div className="w-4 h-4 rounded bg-orange-500" title="80-90%"></div>
                  <div className="w-4 h-4 rounded bg-red-500" title="90-100%"></div>
                </div>
                <span className="text-sm text-gray-400">High</span>
              </div>
              
              {/* Platform-specific insights */}
              <div className="bg-white/5 rounded-lg p-4 mt-4">
                <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  {(() => {
                    const selectedPlatformInfo = platformOptionsHeatmap.find(p => p.value === selectedHeatmapPlatform) || platformOptionsHeatmap[0];
                    const insights = {
                      instagram: {
                        peakTime: 'Friday 5-7 PM',
                        bestDays: 'Thursday - Saturday',
                        avoid: 'Early mornings & Monday mornings'
                      },
                      linkedin: {
                        peakTime: 'Wednesday 10 AM - 12 PM',
                        bestDays: 'Tuesday - Thursday',
                        avoid: 'Weekends & late evenings'
                      },
                      twitter: {
                        peakTime: 'Friday 6-8 PM',
                        bestDays: 'Wednesday - Friday',
                        avoid: 'Sunday mornings & very late nights'
                      },
                      facebook: {
                        peakTime: 'Saturday 3-5 PM',
                        bestDays: 'Thursday - Saturday',
                        avoid: 'Monday & Tuesday mornings'
                      },
                      youtube: {
                        peakTime: 'Saturday 2-4 PM',
                        bestDays: 'Friday - Sunday',
                        avoid: 'Early weekday mornings'
                      }
                    };
                    const currentInsights = insights[selectedHeatmapPlatform as keyof typeof insights] || insights.instagram;
                    
                    return (
                      <>
                        <selectedPlatformInfo.icon className={`w-4 h-4 ${selectedPlatformInfo.color}`} />
                        {selectedPlatformInfo.label} Key Insights
                      </>
                    );
                  })()}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
                  {(() => {
                    const insights = {
                      instagram: {
                        peakTime: 'Friday 5-7 PM',
                        bestDays: 'Thursday - Saturday',
                        avoid: 'Early mornings & Monday mornings'
                      },
                      linkedin: {
                        peakTime: 'Wednesday 10 AM - 12 PM',
                        bestDays: 'Tuesday - Thursday',
                        avoid: 'Weekends & late evenings'
                      },
                      twitter: {
                        peakTime: 'Friday 6-8 PM',
                        bestDays: 'Wednesday - Friday',
                        avoid: 'Sunday mornings & very late nights'
                      },
                      facebook: {
                        peakTime: 'Saturday 3-5 PM',
                        bestDays: 'Thursday - Saturday',
                        avoid: 'Monday & Tuesday mornings'
                      },
                      youtube: {
                        peakTime: 'Saturday 2-4 PM',
                        bestDays: 'Friday - Sunday',
                        avoid: 'Early weekday mornings'
                      }
                    };
                    const currentInsights = insights[selectedHeatmapPlatform as keyof typeof insights] || insights.instagram;
                    
                    return (
                      <>
                        <div>
                          <span className="text-white font-medium">Peak Time:</span> {currentInsights.peakTime}
                        </div>
                        <div>
                          <span className="text-white font-medium">Best Days:</span> {currentInsights.bestDays}
                        </div>
                        <div>
                          <span className="text-white font-medium">Avoid:</span> {currentInsights.avoid}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-lg p-6"
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                disabled={isAtStart}
                className="glass-card border-0 bg-white/5 hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h2 className="text-xl font-medium">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                disabled={isAtEnd}
                className="glass-card border-0 bg-white/5 hover:bg-white/10 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Drag posts to schedule
                </span>
              </div>
              <Badge variant="outline" className="text-xs glass-card border-0 bg-green-500/20 text-green-400">
                Multiple posts per day
              </Badge>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-3 text-center font-medium text-muted-foreground border-b border-white/10">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0 border border-white/10 rounded-lg overflow-hidden">
            {calendarDays.map((day, index) => (
              <CalendarCell
                key={index}
                day={day}
                onDrop={handleDrop}
                onEdit={handleEditPost}
              />
            ))}
          </div>
        </motion.div>

        {/* Edit Post Modal */}
        <EditPostModal
          post={editingPost}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onUpdatePost={handleUpdatePost}
        />

        {/* Unscheduled Content Tray */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Unscheduled Content</h3>
            <Badge variant="outline" className="glass-card border-0 bg-white/5">
              {unscheduledPosts.length} items
            </Badge>
          </div>
          
          {unscheduledPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {unscheduledPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onDelete={handleDeletePost}
                  onEdit={handleEditPost}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium mb-2">All content scheduled!</h4>
              <p className="text-muted-foreground text-sm">
                Great job! All your content has been scheduled across multiple dates.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </DndProvider>
  );
}