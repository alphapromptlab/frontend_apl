import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lightbulb, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ChevronDown,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Heart,
  MessageCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Save,
  X,
  ThumbsUp,
  ThumbsDown,
  Play,
  Image,
  FileText,
  Video,
  Hash
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner@2.0.3';

// Mock data for demonstration
const performanceData = [
  { name: 'Mon', impressions: 4000, engagement: 2400 },
  { name: 'Tue', impressions: 3000, engagement: 1398 },
  { name: 'Wed', impressions: 2000, engagement: 9800 },
  { name: 'Thu', impressions: 2780, engagement: 3908 },
  { name: 'Fri', impressions: 1890, engagement: 4800 },
  { name: 'Sat', impressions: 2390, engagement: 3800 },
  { name: 'Sun', impressions: 3490, engagement: 4300 },
];

const topPerformingContent = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=120&h=120&fit=crop',
    caption: 'Behind the scenes of our new workspace setup...',
    platform: 'instagram',
    likes: 12500,
    views: 45000,
    comments: 234
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=120&h=120&fit=crop',
    caption: 'Quick productivity tips for remote workers',
    platform: 'youtube',
    likes: 8900,
    views: 156000,
    comments: 567
  },
  {
    id: 3,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=120&h=120&fit=crop',
    caption: 'The future of AI in business automation',
    platform: 'linkedin',
    likes: 3400,
    views: 23000,
    comments: 89
  }
];

const trendingTopics = [
  {
    hashtag: '#AIProductivity',
    trend: 'rising',
    emoji: '🔥',
    description: 'AI-powered productivity tools'
  },
  {
    hashtag: '#RemoteWork',
    trend: 'peaking',
    emoji: '📈',
    description: 'Remote work best practices'
  },
  {
    hashtag: '#SustainableTech',
    trend: 'declining',
    emoji: '📉',
    description: 'Eco-friendly technology'
  }
];

const suggestionCards = [
  {
    id: 1,
    title: 'BTS of your setup using trending audio',
    platforms: ['instagram', 'youtube'],
    trendStrength: 'strong',
    insight: 'Behind-the-scenes content performs 40% better with trending audio',
    format: 'Reel',
    performance: 85,
    caption: 'Take your followers behind the scenes of your workspace setup! Show the process, the chaos, and the final result. Use trending audio to boost reach.',
    hashtags: '#BehindTheScenes #WorkspaceSetup #ProductivityTips #HomeOffice #TechSetup',
    audioSuggestion: 'Trending: "Aesthetic workspace vibes" - 2.3M uses'
  },
  {
    id: 2,
    title: 'Quick productivity hack carousel',
    platforms: ['instagram', 'linkedin'],
    trendStrength: 'emerging',
    insight: 'Educational carousels have 3x higher save rates',
    format: 'Carousel',
    performance: 78,
    caption: '5 productivity hacks that changed my work life 💡\n\nSwipe through these game-changing tips that helped me boost productivity by 200%',
    hashtags: '#ProductivityHacks #WorkTips #TimeManagement #Efficiency #LifeHacks',
    audioSuggestion: 'Use: Upbeat instrumental music'
  },
  {
    id: 3,
    title: 'AI tool comparison thread',
    platforms: ['twitter', 'linkedin'],
    trendStrength: 'strong',
    insight: 'AI comparison content drives high engagement and shares',
    format: 'Tweet',
    performance: 92,
    caption: 'I tested 5 AI productivity tools for 30 days. Here\'s what I found 🧵\n\n1/ The tools I tested:\n• Tool A\n• Tool B\n• Tool C\n• Tool D\n• Tool E',
    hashtags: '#AI #ProductivityTools #TechReview #Automation #DigitalTools',
    audioSuggestion: 'Not applicable for text content'
  },
  {
    id: 4,
    title: 'Day in the life with AI assistant',
    platforms: ['youtube', 'instagram'],
    trendStrength: 'emerging',
    insight: 'Day-in-the-life content with AI themes is trending upward',
    format: 'Video',
    performance: 71,
    caption: 'How AI transformed my daily routine ⚡\n\nFrom morning planning to evening review, see how I integrate AI tools into every part of my day.',
    hashtags: '#DayInTheLife #AIAssistant #ProductivityJourney #TechLife #Automation',
    audioSuggestion: 'Trending: "That girl morning routine" - 1.8M uses'
  },
  {
    id: 5,
    title: 'Content strategy breakdown',
    platforms: ['linkedin', 'twitter'],
    trendStrength: 'strong',
    insight: 'Strategy breakdowns get 65% more professional engagement',
    format: 'Carousel',
    performance: 89,
    caption: 'My content strategy that grew 50K followers in 90 days 📈\n\nBreaking down the exact framework I used, including timing, platforms, and metrics.',
    hashtags: '#ContentStrategy #SocialMediaGrowth #MarketingTips #CreatorEconomy',
    audioSuggestion: 'Use: Professional background music'
  },
  {
    id: 6,
    title: 'Quick tech tutorial series',
    platforms: ['youtube', 'instagram'],
    trendStrength: 'emerging',
    insight: 'Tutorial content has 45% higher completion rates',
    format: 'Video',
    performance: 76,
    caption: '60-second tutorials that will change how you work ⚡\n\nQuick, actionable tips for mastering the tools you use every day.',
    hashtags: '#TechTutorials #ProductivityTips #SkillBuilding #TechHacks #QuickTips',
    audioSuggestion: 'Trending: "Tech vibes instrumental" - 1.2M uses'
  },
  {
    id: 7,
    title: 'Workspace transformation timelapse',
    platforms: ['instagram', 'youtube'],
    trendStrength: 'strong',
    insight: 'Transformation content gets 3.5x more shares',
    format: 'Reel',
    performance: 91,
    caption: 'From chaos to calm: my home office transformation ✨\n\nWatch this 5-hour makeover condensed into 60 seconds of pure satisfaction.',
    hashtags: '#WorkspaceTransformation #HomeOffice #OrganizationHacks #Productivity #Makeover',
    audioSuggestion: 'Trending: "Transformation magic" - 3.1M uses'
  },
  {
    id: 8,
    title: 'Morning routine optimization',
    platforms: ['linkedin', 'instagram'],
    trendStrength: 'emerging',
    insight: 'Morning routine content performs best at 6-8 AM',
    format: 'Carousel',
    performance: 82,
    caption: 'How I optimized my morning routine for peak productivity 🌅\n\n5 simple changes that added 2 hours to my productive day.',
    hashtags: '#MorningRoutine #ProductivityTips #LifeHacks #TimeManagement #PersonalDevelopment',
    audioSuggestion: 'Use: Calm morning acoustic music'
  },
  {
    id: 9,
    title: 'Tool stack reveal for creators',
    platforms: ['twitter', 'youtube'],
    trendStrength: 'strong',
    insight: 'Tool recommendations drive 4x more clicks',
    format: 'Thread',
    performance: 88,
    caption: 'My complete creator tool stack revealed 🛠️\n\nFrom ideation to publication - every tool I use to create content that converts.',
    hashtags: '#CreatorTools #ContentCreation #ToolStack #Productivity #CreatorEconomy',
    audioSuggestion: 'Not applicable for text content'
  },
  {
    id: 10,
    title: 'Focus music for deep work',
    platforms: ['youtube', 'instagram'],
    trendStrength: 'emerging',
    insight: 'Study/focus content has strong retention rates',
    format: 'Video',
    performance: 74,
    caption: '3 hours of focus music for deep work sessions 🎵\n\nInstrumental beats designed to boost concentration and productivity.',
    hashtags: '#FocusMusic #DeepWork #StudyMusic #Productivity #Concentration',
    audioSuggestion: 'Feature: Lo-fi hip hop instrumental'
  },
  {
    id: 11,
    title: 'Productivity myth-busting',
    platforms: ['linkedin', 'twitter'],
    trendStrength: 'strong',
    insight: 'Contrarian content generates 2.8x more discussion',
    format: 'Carousel',
    performance: 86,
    caption: '5 productivity myths that are actually hurting your performance 🚫\n\nTime to debunk these popular but harmful productivity "hacks".',
    hashtags: '#ProductivityMyths #TimeManagement #WorkSmart #Efficiency #PersonalDevelopment',
    audioSuggestion: 'Use: Engaging discussion music'
  },
  {
    id: 12,
    title: 'Minimal desk setup tour',
    platforms: ['instagram', 'youtube'],
    trendStrength: 'emerging',
    insight: 'Minimalist content appeals to productivity audiences',
    format: 'Reel',
    performance: 79,
    caption: 'My minimal desk setup that maximizes productivity ⚪\n\nSometimes less really is more. Here\'s how I simplified my workspace.',
    hashtags: '#MinimalSetup #DeskTour #Minimalism #ProductiveWorkspace #CleanDesk',
    audioSuggestion: 'Trending: "Calm minimalist vibes" - 1.7M uses'
  }
];

const platformIcons = {
  instagram: <Instagram className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />
};

const formatIcons = {
  Reel: <Video className="w-4 h-4" />,
  Video: <Video className="w-4 h-4" />,
  Carousel: <Image className="w-4 h-4" />,
  Tweet: <FileText className="w-4 h-4" />,
  Thread: <FileText className="w-4 h-4" />,
  Post: <FileText className="w-4 h-4" />
};

export function SmartSuggestionEngine() {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [timeRange, setTimeRange] = useState('7');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [trendStatusFilter, setTrendStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [savedIdeas, setSavedIdeas] = useState<Set<number>>(new Set());
  const [dismissedIdeas, setDismissedIdeas] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState('suggestions');
  const [currentPage, setCurrentPage] = useState(0);

  const handleSaveIdea = useCallback((id: number) => {
    setSavedIdeas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        toast.success('Idea removed from saved');
      } else {
        newSet.add(id);
        toast.success('Idea saved successfully');
      }
      return newSet;
    });
  }, []);

  const handleDismissIdea = useCallback((id: number) => {
    setDismissedIdeas(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      toast.info('Idea dismissed');
      return newSet;
    });
  }, []);



  const toggleCardExpansion = useCallback((id: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const nextCarouselItem = useCallback(() => {
    setCurrentCarouselIndex(prev => (prev + 1) % topPerformingContent.length);
  }, []);

  const prevCarouselItem = useCallback(() => {
    setCurrentCarouselIndex(prev => (prev - 1 + topPerformingContent.length) % topPerformingContent.length);
  }, []);

  const getTrendBadge = (strength: string) => {
    switch (strength) {
      case 'strong':
        return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">🔥 Strong</Badge>;
      case 'emerging':
        return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">👀 Emerging</Badge>;
      case 'low':
        return <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">🧊 Low</Badge>;
      default:
        return null;
    }
  };

  const filteredSuggestions = suggestionCards.filter(card => {
    if (activeTab === 'dismissed' && !dismissedIdeas.has(card.id)) return false;
    if (activeTab === 'saved' && !savedIdeas.has(card.id)) return false;
    if (activeTab === 'suggestions' && dismissedIdeas.has(card.id)) return false;
    if (searchQuery && !card.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (contentTypeFilter !== 'all' && card.format.toLowerCase() !== contentTypeFilter) return false;
    if (trendStatusFilter !== 'all' && card.trendStrength !== trendStatusFilter) return false;
    return true;
  });

  // Pagination logic for 8 cards at a time
  const cardsPerPage = 8;
  const totalPages = Math.ceil(filteredSuggestions.length / cardsPerPage);
  const startIndex = currentPage * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = filteredSuggestions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedCards(new Set()); // Reset expanded cards when changing page
  };

  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-purple-400 flex-shrink-0" />
          <h1 className="text-xl sm:text-2xl font-semibold">Smart Suggestion Engine</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-full sm:w-48 glass-card">
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent className="glass-popup">
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Summary Panel - Fixed height removed, now content-adaptive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass-card rounded-xl p-4 sm:p-6 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-12 gap-4 lg:gap-6 min-h-fit">
          {/* Performance Overview - More flexible sizing */}
          <div className="lg:col-span-1 xl:col-span-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-semibold text-sm sm:text-base">Performance Overview</h3>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-32 h-8 text-xs glass-subtle">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-popup">
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="h-32 lg:h-28 xl:h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Bar dataKey="impressions" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="engagement" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Performing Content - More flexible sizing */}
          <div className="lg:col-span-1 xl:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm sm:text-base">Top Performing Content</h3>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevCarouselItem}
                  className="h-6 w-6 p-0 rounded-full hover:bg-white/10"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextCarouselItem}
                  className="h-6 w-6 p-0 rounded-full hover:bg-white/10"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCarouselIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="glass-subtle rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={topPerformingContent[currentCarouselIndex].thumbnail}
                    alt="Content thumbnail"
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm truncate">{topPerformingContent[currentCarouselIndex].caption}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {platformIcons[topPerformingContent[currentCarouselIndex].platform as keyof typeof platformIcons]}
                      <span className="text-xs text-muted-foreground">
                        {topPerformingContent[currentCarouselIndex].likes.toLocaleString()} likes
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Trend Radar - Now content-adaptive with no fixed constraints */}
          <div className="lg:col-span-1 xl:col-span-3 space-y-3">
            <h3 className="font-semibold text-sm sm:text-base">Trend Radar</h3>
            <div className="space-y-2">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={topic.hashtag}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="flex items-start gap-2 p-2 glass-subtle rounded-lg min-h-fit"
                >
                  <span className={`text-sm flex-shrink-0 ${topic.trend === 'rising' ? 'animate-pulse' : ''}`}>
                    {topic.emoji}
                  </span>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs sm:text-sm font-medium leading-tight">{topic.hashtag}</p>
                    <p className="text-xs text-muted-foreground leading-tight break-words">{topic.description}</p>
                  </div>
                  {topic.trend === 'rising' && (
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="flex-shrink-0"
                    >
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Combined Tab Navigation and Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="glass-card rounded-xl p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tab Navigation - Left Side */}
          <div className="flex items-center gap-1">
            <Button
              variant={activeTab === 'suggestions' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setActiveTab('suggestions');
                setCurrentPage(0);
              }}
              className="px-4 py-2"
            >
              Smart Suggestions
            </Button>
            <Button
              variant={activeTab === 'saved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setActiveTab('saved');
                setCurrentPage(0);
              }}
              className="px-4 py-2"
            >
              Saved Ideas ({savedIdeas.size})
            </Button>
            <Button
              variant={activeTab === 'dismissed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => {
                setActiveTab('dismissed');
                setCurrentPage(0);
              }}
              className="px-4 py-2"
            >
              Dismissed Ideas ({dismissedIdeas.size})
            </Button>
          </div>

          {/* Filters - Right Side */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-40 h-8 text-sm glass-subtle"
                />
              </div>
              
              <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                <SelectTrigger className="w-full sm:w-32 h-8 text-sm glass-subtle">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="glass-popup">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="reel">Reel</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="tweet">Tweet</SelectItem>
                  <SelectItem value="thread">Thread</SelectItem>
                </SelectContent>
              </Select>

              <Select value={trendStatusFilter} onValueChange={setTrendStatusFilter}>
                <SelectTrigger className="w-full sm:w-32 h-8 text-sm glass-subtle">
                  <SelectValue placeholder="Trend" />
                </SelectTrigger>
                <SelectContent className="glass-popup">
                  <SelectItem value="all">All Trends</SelectItem>
                  <SelectItem value="strong">Strong</SelectItem>
                  <SelectItem value="emerging">Emerging</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>


            </div>
          </div>
        </div>
      </motion.div>

      {/* 4-Column Suggestion Cards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="space-y-6"
      >
        {activeTab === 'suggestions' && filteredSuggestions.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No suggestions found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more suggestions</p>
          </div>
        ) : activeTab === 'saved' && savedIdeas.size === 0 ? (
          <div className="text-center py-12">
            <Save className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No saved ideas</h3>
            <p className="text-muted-foreground">Save ideas from suggestions to see them here</p>
          </div>
        ) : activeTab === 'dismissed' && dismissedIdeas.size === 0 ? (
          <div className="text-center py-12">
            <X className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No dismissed ideas</h3>
            <p className="text-muted-foreground">Dismissed ideas will appear here</p>
          </div>
        ) : (
          <>
            {/* 4-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {currentCards.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="glass-card rounded-xl p-4 space-y-4 group h-fit"
                >
                  {/* Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{suggestion.title}</h3>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {suggestion.platforms.map(platform => (
                            <div key={platform} className="text-muted-foreground">
                              {platformIcons[platform as keyof typeof platformIcons]}
                            </div>
                          ))}
                          {getTrendBadge(suggestion.trendStrength)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {formatIcons[suggestion.format as keyof typeof formatIcons]}
                      <span>{suggestion.format}</span>
                    </div>
                  </div>

                  {/* Performance Meter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Performance</span>
                      <span className="font-medium">{suggestion.performance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${suggestion.performance}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.insight}</p>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {expandedCards.has(suggestion.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 pt-3 border-t border-white/10"
                      >
                        <div>
                          <h4 className="font-medium mb-1 text-xs">Caption</h4>
                          <p className="text-xs text-muted-foreground line-clamp-3">{suggestion.caption}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1 text-xs">Hashtags</h4>
                          <p className="text-xs text-blue-400 break-words line-clamp-2">{suggestion.hashtags}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1 text-xs">Audio</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.audioSuggestion}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCardExpansion(suggestion.id)}
                        className="hover:bg-white/10 text-xs px-2 py-1 h-auto"
                      >
                        {expandedCards.has(suggestion.id) ? 'Less' : 'More'}
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveIdea(suggestion.id)}
                          className={`hover:bg-white/10 p-1 h-auto ${savedIdeas.has(suggestion.id) ? 'text-yellow-400' : ''}`}
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismissIdea(suggestion.id)}
                          className="hover:bg-red-500/10 hover:text-red-400 p-1 h-auto"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handlePageChange(i)}
                      className="w-8 h-8 p-0 text-xs"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}