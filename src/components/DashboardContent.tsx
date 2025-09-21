import { useState, useEffect } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SmartSuggestionEngine } from './SmartSuggestionEngine';
import { 
  ChevronDown, 
  ChevronUp,
  Calendar,
  FolderOpen,
  Library,
  Upload,
  Edit,
  Video,
  Music,
  Share2,
  Lightbulb,
  TrendingUp,
  Users,
  Target,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share,
  Play,
  BarChart3,
  PieChart,
  Zap,
  Star,
  ArrowRight,
  Repeat,
  X,
  Bookmark,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Download,
  Copy,
  Timer,
  Calendar as CalendarIcon,
  Activity,
  Youtube,
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Import Recharts components individually for better compatibility
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Enhanced engagement data with time periods and platforms
const engagementDataByPeriod = {
  7: {
    all: [
      { date: 'Jan 25', engagement: 1200, instagram: 450, linkedin: 280, twitter: 320, facebook: 150 },
      { date: 'Jan 26', engagement: 1350, instagram: 520, linkedin: 320, twitter: 350, facebook: 160 },
      { date: 'Jan 27', engagement: 1100, instagram: 380, linkedin: 300, twitter: 280, facebook: 140 },
      { date: 'Jan 28', engagement: 1500, instagram: 600, linkedin: 350, twitter: 400, facebook: 150 },
      { date: 'Jan 29', engagement: 1750, instagram: 700, linkedin: 420, twitter: 450, facebook: 180 },
      { date: 'Jan 30', engagement: 1900, instagram: 800, linkedin: 450, twitter: 480, facebook: 170 },
      { date: 'Jan 31', engagement: 2100, instagram: 850, linkedin: 500, twitter: 520, facebook: 230 }
    ],
    instagram: [
      { date: 'Jan 25', engagement: 450 },
      { date: 'Jan 26', engagement: 520 },
      { date: 'Jan 27', engagement: 380 },
      { date: 'Jan 28', engagement: 600 },
      { date: 'Jan 29', engagement: 700 },
      { date: 'Jan 30', engagement: 800 },
      { date: 'Jan 31', engagement: 850 }
    ],
    linkedin: [
      { date: 'Jan 25', engagement: 280 },
      { date: 'Jan 26', engagement: 320 },
      { date: 'Jan 27', engagement: 300 },
      { date: 'Jan 28', engagement: 350 },
      { date: 'Jan 29', engagement: 420 },
      { date: 'Jan 30', engagement: 450 },
      { date: 'Jan 31', engagement: 500 }
    ],
    twitter: [
      { date: 'Jan 25', engagement: 320 },
      { date: 'Jan 26', engagement: 350 },
      { date: 'Jan 27', engagement: 280 },
      { date: 'Jan 28', engagement: 400 },
      { date: 'Jan 29', engagement: 450 },
      { date: 'Jan 30', engagement: 480 },
      { date: 'Jan 31', engagement: 520 }
    ],
    facebook: [
      { date: 'Jan 25', engagement: 150 },
      { date: 'Jan 26', engagement: 160 },
      { date: 'Jan 27', engagement: 140 },
      { date: 'Jan 28', engagement: 150 },
      { date: 'Jan 29', engagement: 180 },
      { date: 'Jan 30', engagement: 170 },
      { date: 'Jan 31', engagement: 230 }
    ]
  },
  30: {
    all: [
      { date: 'Jan 1', engagement: 450, instagram: 180, linkedin: 120, twitter: 100, facebook: 50 },
      { date: 'Jan 5', engagement: 650, instagram: 280, linkedin: 150, twitter: 140, facebook: 80 },
      { date: 'Jan 10', engagement: 820, instagram: 350, linkedin: 200, twitter: 180, facebook: 90 },
      { date: 'Jan 15', engagement: 1200, instagram: 500, linkedin: 300, twitter: 280, facebook: 120 },
      { date: 'Jan 20', engagement: 950, instagram: 400, linkedin: 250, twitter: 220, facebook: 80 },
      { date: 'Jan 25', engagement: 1400, instagram: 600, linkedin: 350, twitter: 320, facebook: 130 },
      { date: 'Jan 31', engagement: 2100, instagram: 850, linkedin: 500, twitter: 520, facebook: 230 }
    ],
    instagram: [
      { date: 'Jan 1', engagement: 180 },
      { date: 'Jan 5', engagement: 280 },
      { date: 'Jan 10', engagement: 350 },
      { date: 'Jan 15', engagement: 500 },
      { date: 'Jan 20', engagement: 400 },
      { date: 'Jan 25', engagement: 600 },
      { date: 'Jan 31', engagement: 850 }
    ],
    linkedin: [
      { date: 'Jan 1', engagement: 120 },
      { date: 'Jan 5', engagement: 150 },
      { date: 'Jan 10', engagement: 200 },
      { date: 'Jan 15', engagement: 300 },
      { date: 'Jan 20', engagement: 250 },
      { date: 'Jan 25', engagement: 350 },
      { date: 'Jan 31', engagement: 500 }
    ],
    twitter: [
      { date: 'Jan 1', engagement: 100 },
      { date: 'Jan 5', engagement: 140 },
      { date: 'Jan 10', engagement: 180 },
      { date: 'Jan 15', engagement: 280 },
      { date: 'Jan 20', engagement: 220 },
      { date: 'Jan 25', engagement: 320 },
      { date: 'Jan 31', engagement: 520 }
    ],
    facebook: [
      { date: 'Jan 1', engagement: 50 },
      { date: 'Jan 5', engagement: 80 },
      { date: 'Jan 10', engagement: 90 },
      { date: 'Jan 15', engagement: 120 },
      { date: 'Jan 20', engagement: 80 },
      { date: 'Jan 25', engagement: 130 },
      { date: 'Jan 31', engagement: 230 }
    ]
  },
  90: {
    all: [
      { date: 'Nov 1', engagement: 200, instagram: 80, linkedin: 50, twitter: 45, facebook: 25 },
      { date: 'Nov 15', engagement: 350, instagram: 140, linkedin: 80, twitter: 90, facebook: 40 },
      { date: 'Dec 1', engagement: 480, instagram: 200, linkedin: 120, twitter: 110, facebook: 50 },
      { date: 'Dec 15', engagement: 650, instagram: 280, linkedin: 150, twitter: 140, facebook: 80 },
      { date: 'Jan 1', engagement: 850, instagram: 350, linkedin: 200, twitter: 200, facebook: 100 },
      { date: 'Jan 15', engagement: 1200, instagram: 500, linkedin: 300, twitter: 280, facebook: 120 },
      { date: 'Jan 31', engagement: 2100, instagram: 850, linkedin: 500, twitter: 520, facebook: 230 }
    ],
    instagram: [
      { date: 'Nov 1', engagement: 80 },
      { date: 'Nov 15', engagement: 140 },
      { date: 'Dec 1', engagement: 200 },
      { date: 'Dec 15', engagement: 280 },
      { date: 'Jan 1', engagement: 350 },
      { date: 'Jan 15', engagement: 500 },
      { date: 'Jan 31', engagement: 850 }
    ],
    linkedin: [
      { date: 'Nov 1', engagement: 50 },
      { date: 'Nov 15', engagement: 80 },
      { date: 'Dec 1', engagement: 120 },
      { date: 'Dec 15', engagement: 150 },
      { date: 'Jan 1', engagement: 200 },
      { date: 'Jan 15', engagement: 300 },
      { date: 'Jan 31', engagement: 500 }
    ],
    twitter: [
      { date: 'Nov 1', engagement: 45 },
      { date: 'Nov 15', engagement: 90 },
      { date: 'Dec 1', engagement: 110 },
      { date: 'Dec 15', engagement: 140 },
      { date: 'Jan 1', engagement: 200 },
      { date: 'Jan 15', engagement: 280 },
      { date: 'Jan 31', engagement: 520 }
    ],
    facebook: [
      { date: 'Nov 1', engagement: 25 },
      { date: 'Nov 15', engagement: 40 },
      { date: 'Dec 1', engagement: 50 },
      { date: 'Dec 15', engagement: 80 },
      { date: 'Jan 1', engagement: 100 },
      { date: 'Jan 15', engagement: 120 },
      { date: 'Jan 31', engagement: 230 }
    ]
  }
};

// Platform-specific content distribution data
const contentDistributionByPlatform = {
  all: [
    { name: 'Posts', value: 35, count: 24, color: '#8b5cf6' },
    { name: 'Reels', value: 28, count: 19, color: '#06b6d4' },
    { name: 'Videos', value: 20, count: 14, color: '#10b981' },
    { name: 'Stories', value: 12, count: 8, color: '#f59e0b' },
    { name: 'Blogs', value: 5, count: 3, color: '#ef4444' }
  ],
  instagram: [
    { name: 'Reels', value: 45, count: 18, color: '#e11d48' },
    { name: 'Posts', value: 30, count: 12, color: '#8b5cf6' },
    { name: 'Stories', value: 15, count: 6, color: '#06b6d4' },
    { name: 'Carousels', value: 10, count: 4, color: '#10b981' }
  ],
  linkedin: [
    { name: 'Posts', value: 50, count: 15, color: '#8b5cf6' },
    { name: 'Carousels', value: 25, count: 8, color: '#10b981' },
    { name: 'Videos', value: 20, count: 6, color: '#f59e0b' },
    { name: 'Articles', value: 5, count: 2, color: '#ef4444' }
  ],
  twitter: [
    { name: 'Tweets', value: 60, count: 18, color: '#8b5cf6' },
    { name: 'Threads', value: 25, count: 8, color: '#06b6d4' },
    { name: 'Videos', value: 15, count: 5, color: '#f59e0b' }
  ],
  facebook: [
    { name: 'Posts', value: 40, count: 12, color: '#8b5cf6' },
    { name: 'Videos', value: 35, count: 11, color: '#f59e0b' },
    { name: 'Stories', value: 15, count: 5, color: '#06b6d4' },
    { name: 'Events', value: 10, count: 3, color: '#10b981' }
  ]
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
  ],
  tiktok: [
    {
      day: 'Mon',
      hours: [30, 25, 22, 18, 15, 18, 25, 35, 45, 55, 65, 70, 75, 80, 85, 90, 95, 98, 92, 85, 75, 65, 50, 40]
    },
    {
      day: 'Tue', 
      hours: [32, 28, 25, 20, 18, 22, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 98, 100, 95, 88, 78, 68, 55, 42]
    },
    {
      day: 'Wed',
      hours: [35, 30, 28, 22, 20, 25, 35, 45, 55, 65, 75, 80, 85, 90, 95, 98, 100, 98, 95, 90, 80, 70, 58, 45]
    },
    {
      day: 'Thu',
      hours: [38, 32, 30, 25, 22, 28, 38, 48, 58, 68, 78, 85, 90, 95, 98, 100, 98, 95, 90, 85, 78, 68, 58, 48]
    },
    {
      day: 'Fri',
      hours: [40, 35, 32, 28, 25, 32, 42, 52, 62, 72, 82, 90, 95, 98, 100, 98, 95, 90, 85, 80, 75, 65, 55, 45]
    },
    {
      day: 'Sat',
      hours: [45, 40, 35, 30, 28, 35, 45, 55, 65, 75, 85, 92, 96, 100, 98, 95, 90, 85, 80, 75, 70, 62, 52, 48]
    },
    {
      day: 'Sun',
      hours: [42, 38, 32, 28, 25, 32, 40, 50, 60, 70, 80, 88, 92, 95, 92, 88, 82, 78, 72, 68, 62, 55, 48, 42]
    }
  ]
};

const quickActions = [
  { icon: Target, label: 'Campaign Planner', color: 'bg-blue-500', page: 'Campaign Planner' },
  { icon: FolderOpen, label: 'Projects', color: 'bg-purple-500', page: 'Projects' },
  { icon: Edit, label: 'Post Generator', color: 'bg-green-500', page: 'Content Generator' },
  { icon: Video, label: 'Video Generator', color: 'bg-red-500', page: 'Image Generator' },
  { icon: Music, label: 'Audio Generator', color: 'bg-orange-500', page: 'Content Generator' },
  { icon: Library, label: 'Library', color: 'bg-indigo-500', page: 'Library' },
  { icon: Upload, label: 'Upload', color: 'bg-pink-500', page: 'Library' },
  { icon: BarChart3, label: 'Analytics', color: 'bg-cyan-500', page: 'Dashboard' }
];

// Smart AI suggestions based on data analysis
const smartSuggestions = [
  {
    id: 1,
    icon: Timer,
    title: 'Peak Engagement Window',
    message: 'Your audience is most active Fridays 5-7 PM. Post reels during this time for 4x better reach.',
    color: 'bg-blue-500',
    type: 'timing'
  },
  {
    id: 2,
    icon: CalendarIcon,
    title: 'Best Days Strategy',
    message: 'Tuesday-Friday show 60% higher engagement than weekends. Focus content planning mid-week.',
    color: 'bg-green-500',
    type: 'scheduling'
  },
  {
    id: 3,
    icon: Instagram,
    title: 'Platform Performance',
    message: 'Instagram reels outperform posts by 3.2x. Consider converting static posts to video format.',
    color: 'bg-purple-500',
    type: 'platform'
  },
  {
    id: 4,
    icon: Activity,
    title: 'Content Format Insight',
    message: 'Carousel posts get 2.8x more saves than single images. Try multi-slide storytelling.',
    color: 'bg-orange-500',
    type: 'format'
  },
  {
    id: 5,
    icon: TrendingUp,
    title: 'Engagement Pattern',
    message: 'Morning posts (8-10 AM) drive 40% more professional engagement on LinkedIn.',
    color: 'bg-cyan-500',
    type: 'timing'
  }
];

// Expanded recent posts array - 15 posts total
const recentPosts = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=300&h=200&fit=crop',
    platform: 'Instagram',
    platformIcon: Instagram,
    date: 'Posted on Jul 31, 2025',
    caption: 'Summer vibes and good energy 🌞 What\'s your favorite...',
    contentType: 'Reels',
    metrics: {
      likes: 1240,
      comments: 85,
      shares: 42,
      reach: 3400,
      saves: 156
    },
    engagementData: [
      { time: '6h', engagement: 280 },
      { time: '24h', engagement: 820 },
      { time: '48h', engagement: 1240 },
      { time: '72h', engagement: 1180 }
    ]
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
    platform: 'LinkedIn',
    platformIcon: Linkedin,
    date: 'Posted on Jul 30, 2025',
    caption: '5 tips for better productivity in remote work...',
    contentType: 'Posts',
    metrics: {
      likes: 680,
      comments: 45,
      shares: 78,
      reach: 2100,
      saves: 89
    },
    engagementData: [
      { time: '6h', engagement: 180 },
      { time: '24h', engagement: 520 },
      { time: '48h', engagement: 680 },
      { time: '72h', engagement: 650 }
    ]
  },
  {
    id: 3,
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
    platform: 'Twitter',
    platformIcon: Twitter,
    date: 'Posted on Jul 29, 2025',
    caption: 'Behind the scenes of our latest project launch...',
    contentType: 'Tweets',
    metrics: {
      likes: 420,
      comments: 28,
      shares: 95,
      reach: 1800,
      saves: 32
    },
    engagementData: [
      { time: '6h', engagement: 120 },
      { time: '24h', engagement: 320 },
      { time: '48h', engagement: 420 },
      { time: '72h', engagement: 400 }
    ]
  },
  {
    id: 4,
    thumbnail: 'https://images.unsplash.com/photo-1720195094087-9c0b5c6a2b9d?w=300&h=200&fit=crop',
    platform: 'Instagram',
    platformIcon: Instagram,
    date: 'Posted on Jul 28, 2025',
    caption: 'Step-by-step tutorial for better content creation...',
    contentType: 'Carousels',
    metrics: {
      likes: 890,
      comments: 67,
      shares: 34,
      reach: 2800,
      saves: 234
    },
    engagementData: [
      { time: '6h', engagement: 180 },
      { time: '24h', engagement: 560 },
      { time: '48h', engagement: 890 },
      { time: '72h', engagement: 820 }
    ]
  },
  {
    id: 5,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
    platform: 'Facebook',
    platformIcon: Facebook,
    date: 'Posted on Jul 27, 2025',
    caption: 'Exploring new marketing strategies for 2025...',
    contentType: 'Posts',
    metrics: {
      likes: 312,
      comments: 23,
      shares: 18,
      reach: 1200,
      saves: 45
    },
    engagementData: [
      { time: '6h', engagement: 78 },
      { time: '24h', engagement: 190 },
      { time: '48h', engagement: 312 },
      { time: '72h', engagement: 298 }
    ]
  },
  {
    id: 6,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop',
    platform: 'LinkedIn',
    platformIcon: Linkedin,
    date: 'Posted on Jul 26, 2025',
    caption: 'The future of AI in creative industries...',
    contentType: 'Articles',
    metrics: {
      likes: 1120,
      comments: 89,
      shares: 156,
      reach: 4200,
      saves: 278
    },
    engagementData: [
      { time: '6h', engagement: 340 },
      { time: '24h', engagement: 780 },
      { time: '48h', engagement: 1120 },
      { time: '72h', engagement: 1098 }
    ]
  },
  {
    id: 7,
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=300&h=200&fit=crop',
    platform: 'Instagram',
    platformIcon: Instagram,
    date: 'Posted on Jul 25, 2025',
    caption: 'Monday motivation: Start your week strong! 💪',
    contentType: 'Stories',
    metrics: {
      likes: 567,
      comments: 34,
      shares: 23,
      reach: 1800,
      saves: 89
    },
    engagementData: [
      { time: '6h', engagement: 145 },
      { time: '24h', engagement: 378 },
      { time: '48h', engagement: 567 },
      { time: '72h', engagement: 523 }
    ]
  },
  {
    id: 8,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=200&fit=crop',
    platform: 'Twitter',
    platformIcon: Twitter,
    date: 'Posted on Jul 24, 2025',
    caption: 'Thread: 10 tools every content creator needs...',
    contentType: 'Threads',
    metrics: {
      likes: 892,
      comments: 67,
      shares: 145,
      reach: 3100,
      saves: 189
    },
    engagementData: [
      { time: '6h', engagement: 223 },
      { time: '24h', engagement: 556 },
      { time: '48h', engagement: 892 },
      { time: '72h', engagement: 834 }
    ]
  },
  {
    id: 9,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
    platform: 'LinkedIn',
    platformIcon: Linkedin,
    date: 'Posted on Jul 23, 2025',
    caption: 'Analytics deep dive: What your metrics really mean...',
    contentType: 'Carousels',
    metrics: {
      likes: 1456,
      comments: 112,
      shares: 234,
      reach: 5600,
      saves: 345
    },
    engagementData: [
      { time: '6h', engagement: 412 },
      { time: '24h', engagement: 945 },
      { time: '48h', engagement: 1456 },
      { time: '72h', engagement: 1398 }
    ]
  },
  {
    id: 10,
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=200&fit=crop',
    platform: 'Instagram',
    platformIcon: Instagram,
    date: 'Posted on Jul 22, 2025',
    caption: 'Quick recipe for creativity: Mix passion with persistence...',
    contentType: 'Reels',
    metrics: {
      likes: 1789,
      comments: 156,
      shares: 89,
      reach: 4800,
      saves: 267
    },
    engagementData: [
      { time: '6h', engagement: 456 },
      { time: '24h', engagement: 1123 },
      { time: '48h', engagement: 1789 },
      { time: '72h', engagement: 1645 }
    ]
  },
  {
    id: 11,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
    platform: 'Facebook',
    platformIcon: Facebook,
    date: 'Posted on Jul 21, 2025',
    caption: 'Community event: Join us for a creative workshop...',
    contentType: 'Events',
    metrics: {
      likes: 234,
      comments: 45,
      shares: 67,
      reach: 1500,
      saves: 78
    },
    engagementData: [
      { time: '6h', engagement: 67 },
      { time: '24h', engagement: 145 },
      { time: '48h', engagement: 234 },
      { time: '72h', engagement: 221 }
    ]
  },
  {
    id: 12,
    thumbnail: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=300&h=200&fit=crop',
    platform: 'Twitter',
    platformIcon: Twitter,
    date: 'Posted on Jul 20, 2025',
    caption: 'Breaking: New features announced for content creators...',
    contentType: 'Tweets',
    metrics: {
      likes: 1345,
      comments: 89,
      shares: 234,
      reach: 6700,
      saves: 123
    },
    engagementData: [
      { time: '6h', engagement: 356 },
      { time: '24h', engagement: 789 },
      { time: '48h', engagement: 1345 },
      { time: '72h', engagement: 1256 }
    ]
  },
  {
    id: 13,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop',
    platform: 'LinkedIn',
    platformIcon: Linkedin,
    date: 'Posted on Jul 19, 2025',
    caption: 'Case study: How we increased engagement by 300%...',
    contentType: 'Posts',
    metrics: {
      likes: 2134,
      comments: 178,
      shares: 345,
      reach: 8900,
      saves: 456
    },
    engagementData: [
      { time: '6h', engagement: 534 },
      { time: '24h', engagement: 1234 },
      { time: '48h', engagement: 2134 },
      { time: '72h', engagement: 2045 }
    ]
  },
  {
    id: 14,
    thumbnail: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&h=200&fit=crop',
    platform: 'Instagram',
    platformIcon: Instagram,
    date: 'Posted on Jul 18, 2025',
    caption: 'Behind the lens: Photography tips for beginners...',
    contentType: 'Carousels',
    metrics: {
      likes: 1567,
      comments: 123,
      shares: 67,
      reach: 3800,
      saves: 234
    },
    engagementData: [
      { time: '6h', engagement: 389 },
      { time: '24h', engagement: 912 },
      { time: '48h', engagement: 1567 },
      { time: '72h', engagement: 1456 }
    ]
  },
  {
    id: 15,
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    platform: 'Facebook',
    platformIcon: Facebook,
    date: 'Posted on Jul 17, 2025',
    caption: 'Celebrating our community: Thank you for 10k followers!',
    contentType: 'Videos',
    metrics: {
      likes: 3456,
      comments: 267,
      shares: 456,
      reach: 12000,
      saves: 678
    },
    engagementData: [
      { time: '6h', engagement: 867 },
      { time: '24h', engagement: 1934 },
      { time: '48h', engagement: 3456 },
      { time: '72h', engagement: 3234 }
    ]
  }
];

// Inspirational quotes array (removed quotes)
const inspirationalQuotes = [
  "Creativity thrives on clarity. Let your data guide the masterpiece.",
  "Behind every great idea is insight. Behind every insight is attention.",
  "Your content tells a story — your analytics tell you how it's heard.",
  "Design with feeling. Refine with facts.",
  "The numbers don't limit creativity — they amplify it.",
  "You can't improve what you don't measure. But what you measure, you can master.",
  "Art meets algorithm here.",
  "Inspiration creates. Analytics elevates."
];

// Platform options for dropdown
const platformOptions = [
  { value: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
  { value: 'twitter', label: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-700' },
  { value: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { value: 'tiktok', label: 'TikTok', label: 'TikTok', icon: Music, color: 'text-black' }
];

// Platform colors for line chart
const platformColors = {
  instagram: '#e11d48',
  linkedin: '#0077b5',
  twitter: '#1da1f2',
  facebook: '#1877f2',
  all: '#8b5cf6'
};

interface DashboardContentProps {
  onNavigateToPage?: (page: string) => void;
}

export function DashboardContent({ onNavigateToPage }: DashboardContentProps = {}) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [quickActionsCollapsed, setQuickActionsCollapsed] = useState(false);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [postDateFilter, setPostDateFilter] = useState('7');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [dismissedSuggestions, setDismissedSuggestions] = useState<number[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [selectedHeatmapPlatform, setSelectedHeatmapPlatform] = useState('instagram');
  const [engagementTimePeriod, setEngagementTimePeriod] = useState('30');
  const [displayedPosts, setDisplayedPosts] = useState(4); // Show 4 posts initially in single row
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentQuote = inspirationalQuotes[currentQuoteIndex];
    let timeoutId: NodeJS.Timeout;
    
    if (isTyping && !isFadingOut) {
      // Typing phase
      const nextCharIndex = displayedText.length;
      if (nextCharIndex < currentQuote.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(currentQuote.slice(0, nextCharIndex + 1));
        }, 50); // Typing speed
      } else {
        // Finished typing, wait before starting fade out
        timeoutId = setTimeout(() => {
          setIsTyping(false);
          setIsFadingOut(true);
        }, 5000); // Stay visible for 5 seconds
      }
    } else if (isFadingOut) {
      // Fade out complete, move to next quote
      timeoutId = setTimeout(() => {
        setDisplayedText('');
        setIsFadingOut(false);
        setIsTyping(true);
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % inspirationalQuotes.length);
      }, 1000); // Fade out duration
    }

    return () => clearTimeout(timeoutId);
  }, [currentQuoteIndex, displayedText, isTyping, isFadingOut]);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const dismissSuggestion = (id: number) => {
    setDismissedSuggestions(prev => [...prev, id]);
  };

  const saveSuggestion = (id: number) => {
    console.log('Saved suggestion:', id);
  };

  const getHeatmapColor = (value: number) => {
    if (value >= 90) return 'bg-red-500';
    if (value >= 80) return 'bg-orange-500';
    if (value >= 60) return 'bg-yellow-500';
    if (value >= 40) return 'bg-blue-500';
    if (value >= 20) return 'bg-indigo-500';
    return 'bg-gray-600';
  };

  const handleQuickActionClick = (action: typeof quickActions[0]) => {
    if (onNavigateToPage) {
      onNavigateToPage(action.page);
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate loading delay
    setTimeout(() => {
      setDisplayedPosts(prev => Math.min(prev + 4, filteredPosts.length));
      setIsLoadingMore(false);
    }, 1000);
  };

  const filteredPosts = recentPosts.filter(post => {
    const platformMatch = platformFilter === 'all' || post.platform.toLowerCase() === platformFilter.toLowerCase();
    const contentTypeMatch = contentTypeFilter === 'all' || post.contentType.toLowerCase() === contentTypeFilter.toLowerCase();
    return platformMatch && contentTypeMatch;
  });

  const postsToShow = filteredPosts.slice(0, displayedPosts);
  const hasMorePosts = displayedPosts < filteredPosts.length;

  // Get current heatmap data based on selected platform
  const getCurrentHeatmapData = () => {
    return platformHeatmapData[selectedHeatmapPlatform as keyof typeof platformHeatmapData] || platformHeatmapData.instagram;
  };

  const currentHeatmapData = getCurrentHeatmapData();

  // Get engagement data based on time period and platform
  const getCurrentEngagementData = () => {
    const timeKey = engagementTimePeriod as keyof typeof engagementDataByPeriod;
    const periodData = engagementDataByPeriod[timeKey];
    
    if (platformFilter === 'all') {
      return periodData.all;
    } else {
      return periodData[platformFilter as keyof typeof periodData] || periodData.all;
    }
  };

  const currentEngagementData = getCurrentEngagementData();

  // Get content distribution data based on platform
  const getCurrentContentDistribution = () => {
    return contentDistributionByPlatform[platformFilter as keyof typeof contentDistributionByPlatform] || contentDistributionByPlatform.all;
  };

  const currentContentDistribution = getCurrentContentDistribution();

  // Get platform-specific insights
  const getPlatformInsights = () => {
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
      },
      tiktok: {
        peakTime: 'Saturday 7-9 PM',
        bestDays: 'Thursday - Sunday',
        avoid: 'Monday mornings & midweek afternoons'
      }
    };
    
    return insights[selectedHeatmapPlatform as keyof typeof insights] || insights.instagram;
  };

  const currentInsights = getPlatformInsights();

  // Generate hour labels
  const hourLabels = Array.from({ length: 24 }, (_, i) => {
    const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour}${period}`;
  });

  // Get the selected platform info for display
  const getSelectedPlatformInfo = () => {
    return platformOptions.find(p => p.value === selectedHeatmapPlatform) || platformOptions[0];
  };

  const selectedPlatformInfo = getSelectedPlatformInfo();

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full border-b border-white/10"
      >
        <div className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Creative Floating Geometric Animation */}
              <div className="relative w-12 h-12 overflow-hidden">
                {/* Central anchor point */}
                <div className="absolute inset-0 rounded-lg bg-black/5 border border-white/10" />
                
                {/* Floating Circle 1 */}
                <motion.div
                  className="absolute w-3 h-3 bg-blue-500 rounded-full"
                  animate={{
                    x: [0, 8, -4, 6, 0],
                    y: [0, -6, 4, -8, 0],
                    scale: [1, 1.3, 0.8, 1.1, 1],
                    opacity: [0.7, 1, 0.5, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0,
                  }}
                  style={{ top: '15%', left: '20%' }}
                />

                {/* Floating Square 1 */}
                <motion.div
                  className="absolute w-2 h-2 bg-purple-500 rounded-sm"
                  animate={{
                    x: [0, -6, 8, -4, 0],
                    y: [0, 5, -3, 7, 0],
                    rotate: [0, 180, 90, 270, 360],
                    scale: [1, 0.7, 1.4, 0.9, 1],
                    opacity: [0.6, 0.9, 0.4, 0.8, 0.6],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  style={{ top: '60%', left: '70%' }}
                />

                {/* Other floating elements */}
                <motion.div
                  className="absolute w-0 h-0 border-l-2 border-r-2 border-b-3 border-l-transparent border-r-transparent border-b-emerald-500"
                  animate={{
                    x: [0, 4, -7, 5, 0],
                    y: [0, -4, 6, -5, 0],
                    rotate: [0, 120, 240, 90, 0],
                    scale: [1, 1.2, 0.9, 1.3, 1],
                    opacity: [0.8, 0.5, 1, 0.6, 0.8],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                  }}
                  style={{ top: '40%', left: '10%' }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, Alex Rivera!
                </h1>
                <p className="text-lg text-gray-300">
                  Creativity doesn't wait for that perfect moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="p-6 space-y-8">
        {/* 1. Quick Action Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-transparent rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuickActionsCollapsed(!quickActionsCollapsed)}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              {quickActionsCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
          
          <AnimatePresence>
            {!quickActionsCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid grid-cols-8 gap-4"
              >
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer"
                    onClick={() => handleQuickActionClick(action)}
                  >
                    <Card className="glass-card border-0 hover:bg-white/10 p-4 text-center transition-all duration-300 hover:shadow-lg hover:shadow-white/10 min-h-[100px] flex flex-col justify-between">
                      <div className={`w-12 h-12 rounded-xl ${action.color} mx-auto mb-3 flex items-center justify-center shadow-lg`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-white font-medium">{action.label}</p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Smart Suggestion Engine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-transparent rounded-2xl"
        >
          <SmartSuggestionEngine />
        </motion.div>

        {/* 2. Engagement Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-transparent rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Engagement Over Time</h2>
            <div className="flex items-center gap-4">
              <Select value={engagementTimePeriod} onValueChange={setEngagementTimePeriod}>
                <SelectTrigger className="w-32 glass-card border-0 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0 bg-black/90">
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0 bg-black/90">
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('growth')}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                {collapsedSections.growth ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {!collapsedSections.growth && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Line Chart - Takes up 2/3 of the space */}
                  <div className="lg:col-span-2">
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentEngagementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                          <XAxis 
                            dataKey="date" 
                            stroke="rgba(255,255,255,0.7)"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.7)"
                            fontSize={12}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              background: 'rgba(0,0,0,0.9)', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: 'white'
                            }} 
                          />
                          
                          {/* Show all platform lines when 'all' is selected */}
                          {platformFilter === 'all' ? (
                            <>
                              <Line 
                                type="monotone" 
                                dataKey="instagram" 
                                stroke={platformColors.instagram}
                                strokeWidth={2}
                                dot={{ fill: platformColors.instagram, strokeWidth: 1, r: 4 }}
                                name="Instagram"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="linkedin" 
                                stroke={platformColors.linkedin}
                                strokeWidth={2}
                                dot={{ fill: platformColors.linkedin, strokeWidth: 1, r: 4 }}
                                name="LinkedIn"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="twitter" 
                                stroke={platformColors.twitter}
                                strokeWidth={2}
                                dot={{ fill: platformColors.twitter, strokeWidth: 1, r: 4 }}
                                name="Twitter"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="facebook" 
                                stroke={platformColors.facebook}
                                strokeWidth={2}
                                dot={{ fill: platformColors.facebook, strokeWidth: 1, r: 4 }}
                                name="Facebook"
                              />
                            </>
                          ) : (
                            /* Show single platform line when specific platform is selected */
                            <Line 
                              type="monotone" 
                              dataKey="engagement" 
                              stroke={platformColors[platformFilter as keyof typeof platformColors] || platformColors.all}
                              strokeWidth={3}
                              dot={{ fill: platformColors[platformFilter as keyof typeof platformColors] || platformColors.all, strokeWidth: 2, r: 6 }}
                              activeDot={{ r: 8, fill: platformColors[platformFilter as keyof typeof platformColors] || platformColors.all }}
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Platform Legend for All Platforms view */}
                    {platformFilter === 'all' && (
                      <div className="flex items-center justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platformColors.instagram }}></div>
                          <span className="text-sm text-gray-300">Instagram</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platformColors.linkedin }}></div>
                          <span className="text-sm text-gray-300">LinkedIn</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platformColors.twitter }}></div>
                          <span className="text-sm text-gray-300">Twitter</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platformColors.facebook }}></div>
                          <span className="text-sm text-gray-300">Facebook</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Distribution Pie Chart - Takes up 1/3 of the space */}
                  <div className="bg-transparent rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {platformFilter === 'all' ? 'Overall Content' : `${platformFilter.charAt(0).toUpperCase() + platformFilter.slice(1)}`} Breakdown
                    </h3>
                    
                    <div className="h-48 w-full mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={currentContentDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {currentContentDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name, props) => [
                              `${value}% (${props.payload.count} items)`, 
                              name
                            ]}
                            contentStyle={{ 
                              background: 'rgba(0,0,0,0.9)', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              color: 'white'
                            }} 
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-2">
                      {currentContentDistribution.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-white">{item.name}</span>
                          </div>
                          <span className="text-sm text-gray-400">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 3. Optimal Posting Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-transparent rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Optimal Posting Schedule</h2>
            <div className="flex items-center gap-4">
              <Select value={selectedHeatmapPlatform} onValueChange={setSelectedHeatmapPlatform}>
                <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0 bg-black/90">
                  {platformOptions.map((platform) => (
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
                onClick={() => toggleSection('heatmap')}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                {collapsedSections.heatmap ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {!collapsedSections.heatmap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-x-auto"
              >
                {/* Platform Header */}
                <div className="flex items-center gap-3 mb-6">
                  <selectedPlatformInfo.icon className={`w-6 h-6 ${selectedPlatformInfo.color}`} />
                  <h3 className="text-lg font-medium text-white">
                    {selectedPlatformInfo.label} Engagement Patterns
                  </h3>
                </div>

                {/* Hour labels */}
                <div className="grid grid-cols-25 gap-1 min-w-[800px]">
                  <div className="w-16"></div> {/* Day label space */}
                  {hourLabels.map((hour, index) => (
                    <div key={index} className="text-center text-xs text-gray-400 h-6 flex items-center justify-center">
                      {index % 4 === 0 ? hour : ''}
                    </div>
                  ))}
                </div>
                
                {/* Heatmap grid */}
                <div className="space-y-1 min-w-[800px]">
                  {currentHeatmapData.map((row, dayIndex) => (
                    <div key={row.day} className="grid grid-cols-25 gap-1">
                      <div className="w-16 text-sm text-gray-400 flex items-center">
                        {row.day}
                      </div>
                      {row.hours.map((value, hourIndex) => (
                        <div 
                          key={`${row.day}-${hourIndex}`}
                          className={`h-8 rounded ${getHeatmapColor(value)} flex items-center justify-center text-white text-xs font-medium transition-all duration-200 hover:scale-110 cursor-pointer`}
                          title={`${row.day} ${hourLabels[hourIndex]}: ${value}% engagement on ${selectedPlatformInfo.label}`}
                        >
                          {value >= 80 ? value : ''}
                        </div>
                      ))}
                    </div>
                  ))}
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
                    <selectedPlatformInfo.icon className={`w-4 h-4 ${selectedPlatformInfo.color}`} />
                    {selectedPlatformInfo.label} Key Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-300">
                    <div>
                      <span className="text-white font-medium">Peak Time:</span> {currentInsights.peakTime}
                    </div>
                    <div>
                      <span className="text-white font-medium">Best Days:</span> {currentInsights.bestDays}
                    </div>
                    <div>
                      <span className="text-white font-medium">Avoid:</span> {currentInsights.avoid}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 4. Smart Insights & Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-transparent rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Smart Insights & Recommendations</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('suggestions')}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              {collapsedSections.suggestions ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>

          <AnimatePresence>
            {!collapsedSections.suggestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
              >
                {smartSuggestions
                  .filter(suggestion => !dismissedSuggestions.includes(suggestion.id))
                  .map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      whileHover={{ scale: 1.02 }}
                      className="relative"
                    >
                      <Card className="glass-card border-0 p-4 hover:bg-white/5 transition-colors h-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissSuggestion(suggestion.id)}
                          className="absolute top-2 right-2 w-6 h-6 p-0 text-gray-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        
                        <div className={`w-8 h-8 ${suggestion.color} rounded-lg mb-3 flex items-center justify-center`}>
                          <suggestion.icon className="w-4 h-4 text-white" />
                        </div>
                        
                        <h3 className="font-medium text-white mb-2 text-sm">{suggestion.title}</h3>
                        <p className="text-xs text-gray-300 mb-3 line-clamp-3">{suggestion.message}</p>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => saveSuggestion(suggestion.id)}
                            className="flex-1 glass-card border-0 bg-white/10 hover:bg-white/20 text-white text-xs"
                          >
                            <Bookmark className="w-3 h-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 5. Recent Post Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-transparent rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Post Performance</h2>
            <div className="flex items-center gap-4">
              <Select value={platformFilter} onValueChange={(value) => {
                setPlatformFilter(value);
                setContentTypeFilter('all'); // Reset content type filter when platform changes
                setDisplayedPosts(4); // Reset displayed posts when filter changes
              }}>
                <SelectTrigger className="w-40 glass-card border-0 bg-white/5">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent className="glass-card border-0 bg-black/90">
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
              <Select value={postDateFilter} onValueChange={setPostDateFilter}>
                <SelectTrigger className="w-32 glass-card border-0 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-0 bg-black/90">
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('posts')}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                {collapsedSections.posts ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {!collapsedSections.posts && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                {/* Single Row Vertical Scrollable Posts */}
                <div className="flex items-center gap-4">
                  {/* Posts Container */}
                  <div className="flex-1 relative">
                    <div 
                      className="flex gap-6 overflow-y-auto scrollbar-hide"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitScrollbarWidth: 'none'
                      }}
                    >
                      {postsToShow.map((post) => (
                        <Card key={post.id} className="glass-card border-0 overflow-hidden hover:bg-white/5 transition-colors w-80 flex-shrink-0">
                          <div className="relative">
                            <ImageWithFallback
                              src={post.thumbnail}
                              alt="Post thumbnail"
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute top-2 left-2">
                              <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                                <post.platformIcon className="w-4 h-4 text-white" />
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className="glass-card border-0 bg-black/50 text-white text-xs">
                                {post.contentType}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <p className="text-xs text-gray-400 mb-2">{post.date}</p>
                            <p className="text-sm text-white mb-4 line-clamp-2">{post.caption}</p>
                            
                            {/* Metrics Row */}
                            <div className="grid grid-cols-5 gap-2 mb-4 text-center">
                              <div>
                                <Heart className="w-3 h-3 mx-auto mb-1 text-red-400" />
                                <p className="text-xs text-gray-300">{post.metrics.likes}</p>
                              </div>
                              <div>
                                <MessageCircle className="w-3 h-3 mx-auto mb-1 text-blue-400" />
                                <p className="text-xs text-gray-300">{post.metrics.comments}</p>
                              </div>
                              <div>
                                <Share className="w-3 h-3 mx-auto mb-1 text-green-400" />
                                <p className="text-xs text-gray-300">{post.metrics.shares}</p>
                              </div>
                              <div>
                                <Eye className="w-3 h-3 mx-auto mb-1 text-purple-400" />
                                <p className="text-xs text-gray-300">{post.metrics.reach}</p>
                              </div>
                              <div>
                                <Bookmark className="w-3 h-3 mx-auto mb-1 text-orange-400" />
                                <p className="text-xs text-gray-300">{post.metrics.saves}</p>
                              </div>
                            </div>
                            
                            {/* Mini Graph */}
                            <div className="h-16 mb-4 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={post.engagementData}>
                                  <Line 
                                    type="monotone" 
                                    dataKey="engagement" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={2}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 1, r: 3 }}
                                  />
                                  <Tooltip 
                                    formatter={(value: any, name: any, props: any) => [
                                      `${props.payload.time}: ${value} interactions`, 
                                      'Engagement'
                                    ]}
                                    contentStyle={{ 
                                      background: 'rgba(0,0,0,0.9)', 
                                      border: '1px solid rgba(255,255,255,0.1)',
                                      borderRadius: '8px',
                                      color: 'white',
                                      fontSize: '12px'
                                    }} 
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                            
                            {/* Legend */}
                            <div className="flex items-center gap-4 text-xs mb-4">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                <Heart className="w-3 h-3" />
                                <span className="text-gray-400">Likes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                <MessageCircle className="w-3 h-3" />
                                <span className="text-gray-400">Comments</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                <Share className="w-3 h-3" />
                                <span className="text-gray-400">Shares</span>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1 glass-card border-0 bg-blue-500 hover:bg-blue-600 text-white">
                                <Repeat className="w-3 h-3 mr-1" />
                                Repurpose
                              </Button>
                              <Button size="sm" variant="outline" className="glass-card border-white/20 text-gray-300 hover:text-white">
                                View Insights
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Load More Button on the Right */}
                  {hasMorePosts && (
                    <div className="flex-shrink-0">
                      <Button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="glass-card border-0 bg-white/10 hover:bg-white/20 text-white p-4 h-auto flex flex-col items-center justify-center min-h-[100px] w-20"
                      >
                        {isLoadingMore ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mb-2"
                            />
                            <span className="text-xs">Loading...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-6 h-6 mb-2" />
                            <span className="text-xs text-center">Load More</span>
                            <span className="text-xs text-gray-400 mt-1">({filteredPosts.length - displayedPosts})</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Inspirational Quote Section with Typewriter Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-transparent rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-center min-h-[120px]">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h3 
                className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
                initial={{ opacity: 1 }}
                animate={{ opacity: isFadingOut ? 0 : 1 }}
                transition={{ duration: 1 }}
                style={{
                  background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #f093fb, #f5576c)',
                  backgroundSize: '400% 400%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradient-x 4s ease infinite',
                  minHeight: '4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {displayedText}
                {isTyping && !isFadingOut && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ 
                      duration: 1, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    className="ml-1"
                  >
                    |
                  </motion.span>
                )}
              </motion.h3>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}