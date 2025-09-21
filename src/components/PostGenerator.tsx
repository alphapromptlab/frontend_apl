import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MousePointer, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Smile, 
  Eraser, 
  Layers, 
  Trash2,
  Upload,
  Palette,
  Shapes,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Copy,
  Wand2,
  Hash,
  MessageCircle,
  Target,
  Settings,
  ChevronDown,
  Search,
  Star,
  Heart,
  TrendingUp,
  Sparkles,
  Plus,
  Filter,
  Layout,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
  };
}

const templates = [
  { id: 1, name: 'Instagram Post', size: '1080x1080', category: 'Social Media', preview: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop' },
  { id: 2, name: 'Instagram Story', size: '1080x1920', category: 'Social Media', preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=300&fit=crop' },
  { id: 3, name: 'Facebook Post', size: '1200x630', category: 'Social Media', preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=105&fit=crop' },
  { id: 4, name: 'LinkedIn Post', size: '1200x627', category: 'Professional', preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=105&fit=crop' },
  { id: 5, name: 'Twitter Header', size: '1500x500', category: 'Social Media', preview: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=67&fit=crop' },
  { id: 6, name: 'YouTube Thumbnail', size: '1280x720', category: 'Video', preview: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=113&fit=crop' },
];

const aiAssets = [
  { id: 1, url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop', type: 'person', tags: ['portrait', 'professional'] },
  { id: 2, url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop', type: 'business', tags: ['office', 'workspace'] },
  { id: 3, url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop', type: 'data', tags: ['charts', 'analytics'] },
  { id: 4, url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop', type: 'team', tags: ['collaboration', 'meeting'] },
  { id: 5, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop', type: 'portrait', tags: ['headshot', 'person'] },
  { id: 6, url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=200&fit=crop', type: 'workspace', tags: ['desk', 'minimal'] },
];

const toneOptions = [
  { value: 'professional', label: 'Professional', icon: Target, color: 'bg-blue-500/10 text-blue-400 border-blue-400/20' },
  { value: 'casual', label: 'Casual', icon: Smile, color: 'bg-green-500/10 text-green-400 border-green-400/20' },
  { value: 'engaging', label: 'Engaging', icon: MessageCircle, color: 'bg-purple-500/10 text-purple-400 border-purple-400/20' },
  { value: 'trending', label: 'Trending', icon: TrendingUp, color: 'bg-orange-500/10 text-orange-400 border-orange-400/20' },
];

export function PostGenerator() {
  const [selectedTool, setSelectedTool] = useState<string>('cursor');
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [caption, setCaption] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [hashtags, setHashtags] = useState('#design #creative #marketing');
  const [cta, setCta] = useState('Learn more in our bio!');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleToolSelect = useCallback((tool: string) => {
    setSelectedTool(tool);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedTool === 'text') {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const newElement: CanvasElement = {
          id: Date.now().toString(),
          type: 'text',
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          width: 200,
          height: 40,
          content: 'Your text here',
          style: {
            fontSize: 18,
            fontWeight: '500',
            color: '#ffffff',
          }
        };
        setCanvasElements(prev => [...prev, newElement]);
      }
    }
  }, [selectedTool]);

  const handleGenerateCaption = useCallback(() => {
    setIsGeneratingCaption(true);
    setTimeout(() => {
      const sampleCaptions = {
        professional: "Elevate your brand with stunning visual content that converts. Our design tools help you create professional posts that engage your audience and drive results.",
        casual: "Hey there! 👋 Ready to make some amazing content? We've got all the tools you need to bring your creative ideas to life!",
        engaging: "🚀 Transform your social media presence with designs that stop the scroll! What story will you tell today?",
        trending: "✨ This is your sign to level up your content game! Join thousands of creators making viral-worthy posts with our tools. 🔥"
      };
      setCaption(sampleCaptions[selectedTone as keyof typeof sampleCaptions]);
      setIsGeneratingCaption(false);
    }, 2000);
  }, [selectedTone]);

  const handleDeleteElement = useCallback((elementId: string) => {
    setCanvasElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElement(null);
  }, []);

  return (
    <div className="h-full flex bg-background text-foreground overflow-hidden">
      {/* Left Sidebar - Assets */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-80 glass-card border-r border-border/50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Design Assets</h2>
              <p className="text-xs text-muted-foreground">Templates, images & more</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search assets..." 
              className="pl-10 bg-input-background border-border/50 text-foreground placeholder-muted-foreground focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <Tabs defaultValue="templates" className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-4 bg-secondary/50 border border-border/30">
                <TabsTrigger value="templates" className="text-xs font-medium">Templates</TabsTrigger>
                <TabsTrigger value="images" className="text-xs font-medium">Images</TabsTrigger>
                <TabsTrigger value="uploads" className="text-xs font-medium">Uploads</TabsTrigger>
                <TabsTrigger value="brand" className="text-xs font-medium">Brand</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="templates" className="px-6 pb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Popular Templates</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {templates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/50 hover:bg-card/80 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center p-4 gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted/50">
                        <ImageWithFallback
                          src={template.preview}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{template.name}</h4>
                        <p className="text-xs text-muted-foreground">{template.size}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="images" className="px-6 pb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">AI Generated</h3>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-medium">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {aiAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group cursor-pointer rounded-lg overflow-hidden border border-border/30 bg-card/30"
                  >
                    <ImageWithFallback
                      src={asset.url}
                      alt={asset.type}
                      className="w-full h-24 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {asset.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-black/50 text-white border-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="uploads" className="px-6 pb-6 space-y-4">
              <h3 className="font-medium text-foreground">Your Uploads</h3>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2">Upload Files</h4>
                <p className="text-sm text-muted-foreground mb-4">Drag & drop or click to browse</p>
                <Button className="bg-primary/90 hover:bg-primary text-primary-foreground">
                  Browse Files
                </Button>
              </motion.div>
            </TabsContent>

            <TabsContent value="brand" className="px-6 pb-6 space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-4">Brand Colors</h3>
                <div className="grid grid-cols-6 gap-3">
                  {['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'].map((color, index) => (
                    <motion.div
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group"
                    >
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-border/30 cursor-pointer shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {color}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-foreground mb-4">Brand Fonts</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-card/50 rounded-lg border border-border/30">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">Inter</span>
                      <Badge variant="secondary" className="text-xs">Primary</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Clean, modern sans-serif</p>
                  </div>
                  <div className="p-4 bg-card/50 rounded-lg border border-border/30">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">Roboto</span>
                      <Badge variant="outline" className="text-xs">Secondary</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Versatile body text</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      {/* Center Canvas */}
      <div className="flex-1 flex flex-col bg-muted/10">
        {/* Canvas Controls */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h2 className="font-semibold text-foreground">Instagram Post</h2>
                <p className="text-sm text-muted-foreground">1080 × 1080px</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <div className="px-3 py-1 bg-muted/50 rounded-md min-w-[60px] text-center">
                  <span className="text-sm font-medium text-foreground">{zoomLevel}%</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className={showGrid ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl border-2 border-border/10"
            style={{ 
              width: `${400 * (zoomLevel / 100)}px`, 
              height: `${400 * (zoomLevel / 100)}px`,
            }}
          >
            <div
              ref={canvasRef}
              className="absolute inset-0 cursor-crosshair rounded-2xl overflow-hidden"
              onClick={handleCanvasClick}
              style={{
                background: showGrid 
                  ? `linear-gradient(135deg, #667eea 0%, #764ba2 100%), 
                     radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: showGrid ? 'cover, 20px 20px' : 'cover'
              }}
            >
              {/* Canvas Elements */}
              {canvasElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-move border-2 rounded-lg transition-all duration-200 ${
                    selectedElement === element.id 
                      ? 'border-primary shadow-lg shadow-primary/20' 
                      : 'border-transparent hover:border-primary/50'
                  }`}
                  style={{
                    left: element.x * (zoomLevel / 100),
                    top: element.y * (zoomLevel / 100),
                    width: element.width * (zoomLevel / 100),
                    height: element.height * (zoomLevel / 100),
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement(element.id);
                  }}
                >
                  {element.type === 'text' && (
                    <div
                      className="w-full h-full flex items-center justify-center px-2"
                      style={{
                        fontSize: `${(element.style?.fontSize || 18) * (zoomLevel / 100)}px`,
                        fontWeight: element.style?.fontWeight,
                        color: element.style?.color,
                        backgroundColor: element.style?.backgroundColor,
                        borderRadius: element.style?.borderRadius,
                      }}
                    >
                      {element.content}
                    </div>
                  )}
                  {selectedElement === element.id && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-10 -right-2 w-8 h-8 p-0 rounded-full shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteElement(element.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Sidebar - Caption Generator */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-80 glass-card border-l border-border/50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">AI Caption</h2>
              <p className="text-xs text-muted-foreground">Smart content generation</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide">
          {/* Tone Selection */}
          <div>
            <label className="text-sm font-medium text-foreground mb-4 block">Writing Tone</label>
            <div className="grid grid-cols-2 gap-3">
              {toneOptions.map((tone) => {
                const IconComponent = tone.icon;
                return (
                  <motion.button
                    key={tone.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTone(tone.value)}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                      selectedTone === tone.value 
                        ? tone.color
                        : 'bg-card/30 text-muted-foreground hover:text-foreground hover:bg-card/50 border-border/30'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{tone.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Generated Caption */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-foreground">Caption Content</label>
              <Button 
                size="sm" 
                onClick={handleGenerateCaption}
                disabled={isGeneratingCaption}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 font-medium"
              >
                {isGeneratingCaption ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                Generate
              </Button>
            </div>
            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Your AI-generated caption will appear here..."
              className="min-h-[120px] bg-input-background border-border/50 text-foreground placeholder-muted-foreground resize-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Hashtags */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
              <Hash className="w-4 h-4 text-primary" />
              Hashtags
            </label>
            <Input
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#design #creative #marketing"
              className="bg-input-background border-border/50 text-foreground placeholder-muted-foreground focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Call to Action */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Call to Action
            </label>
            <Select value={cta} onValueChange={setCta}>
              <SelectTrigger className="bg-input-background border-border/50 text-foreground focus:border-primary/50 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/50">
                <SelectItem value="Learn more in our bio!">Learn more in our bio!</SelectItem>
                <SelectItem value="Link in bio 👆">Link in bio 👆</SelectItem>
                <SelectItem value="DM us for more info">DM us for more info</SelectItem>
                <SelectItem value="Save this post for later">Save this post for later</SelectItem>
                <SelectItem value="Tag a friend who needs this">Tag a friend who needs this</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          <div className="bg-card/50 rounded-xl p-5 border border-border/30">
            <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              Preview
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">{caption}</p>
              <p className="text-sm text-primary font-medium">{hashtags}</p>
              <p className="text-sm text-green-500 font-medium">{cta}</p>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/30">
              <div className="flex gap-3">
                <Heart className="w-4 h-4 text-red-400" />
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <Copy className="w-4 h-4 text-muted-foreground" />
              </div>
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                <Copy className="w-3 h-3 mr-1" />
                Copy All
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Bottom Toolbar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl px-6 py-3 shadow-2xl"
        >
          <div className="flex items-center gap-2">
            {[
              { id: 'cursor', icon: MousePointer, label: 'Select' },
              { id: 'text', icon: Type, label: 'Text' },
              { id: 'image', icon: ImageIcon, label: 'Image' },
              { id: 'shapes', icon: Square, label: 'Shapes' },
              { id: 'emoji', icon: Smile, label: 'Emoji' },
              { id: 'eraser', icon: Eraser, label: 'Remove BG' },
              { id: 'layers', icon: Layers, label: 'Layers' },
              { id: 'delete', icon: Trash2, label: 'Delete' },
            ].map((tool) => {
              const IconComponent = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToolSelect(tool.id)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    selectedTool === tool.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  title={tool.label}
                >
                  <IconComponent className="w-4 h-4" />
                </motion.button>
              );
            })}
            <div className="w-px h-6 bg-border/50 mx-2" />
            <Button
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 h-11 rounded-xl font-medium shadow-lg shadow-green-500/25"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}