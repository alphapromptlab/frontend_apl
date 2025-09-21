import { useState, useEffect, useCallback, useMemo } from 'react';
import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles,
  Image as ImageIcon,
  Play,
  Copy,
  EyeOff,
  MoreHorizontal,
  Send,
  Settings,
  Upload,
  Shuffle,
  Zap,
  Video
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { NoiseOverlay } from './NoiseOverlay';
import { toast } from 'sonner@2.0.3';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3';
  liked: boolean;
  timestamp: Date;
  seed?: number;
  stylization: number;
  quality: 'low' | 'standard' | 'high';
}

interface GenerationSession {
  id: string;
  name: string;
  prompt: string;
  images: GeneratedImage[];
  settings: {
    aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3';
    stylization: number;
    quality: 'low' | 'standard' | 'high';
    seed?: number;
    seedLocked: boolean;
    promptWeighting: number;
    isPrivate: boolean;
  };
  isGenerating: boolean;
  createdAt: Date;
}

interface ImageGeneratorProps {}

// Mock sessions data with different aspect ratios and dates
const mockSessions: GenerationSession[] = [
  {
    id: '1',
    name: 'Surreal Clock Tower',
    prompt: 'a surreal scene of a giant clock tower exploding in slow motion, time fragments floating mid-air pocket watches, ancient sundials, digital screens all suspended as if frozen, background shows different landscapes from history pyramids, skyscrapers, battlefield ruins, cyberpunk skyline cinematic surrealism, concept art, moody lighting, photorealistic textures',
    images: [
      { id: '1-1', url: '', prompt: 'Surreal clock tower scene', aspectRatio: '16:9', liked: false, timestamp: new Date(), seed: 12345, stylization: 200, quality: 'high' },
      { id: '1-2', url: '', prompt: 'Surreal clock tower scene', aspectRatio: '16:9', liked: true, timestamp: new Date(), seed: 12346, stylization: 200, quality: 'high' },
      { id: '1-3', url: '', prompt: 'Surreal clock tower scene', aspectRatio: '16:9', liked: false, timestamp: new Date(), seed: 12347, stylization: 200, quality: 'high' },
      { id: '1-4', url: '', prompt: 'Surreal clock tower scene', aspectRatio: '16:9', liked: false, timestamp: new Date(), seed: 12348, stylization: 200, quality: 'high' }
    ],
    settings: {
      aspectRatio: '16:9',
      stylization: 200,
      quality: 'high',
      seed: 12345,
      seedLocked: false,
      promptWeighting: 100,
      isPrivate: false
    },
    isGenerating: false,
    createdAt: new Date('2025-08-22T10:30:00')
  },
  {
    id: '2',
    name: 'Portrait Session',
    prompt: 'a majestic floating castle in the clouds with ethereal lighting',
    images: [
      { id: '2-1', url: '', prompt: 'Floating castle portrait', aspectRatio: '9:16', liked: false, timestamp: new Date(), seed: 22345, stylization: 100, quality: 'standard' },
      { id: '2-2', url: '', prompt: 'Floating castle portrait', aspectRatio: '9:16', liked: true, timestamp: new Date(), seed: 22346, stylization: 100, quality: 'standard' },
      { id: '2-3', url: '', prompt: 'Floating castle portrait', aspectRatio: '9:16', liked: false, timestamp: new Date(), seed: 22347, stylization: 100, quality: 'standard' },
      { id: '2-4', url: '', prompt: 'Floating castle portrait', aspectRatio: '9:16', liked: false, timestamp: new Date(), seed: 22348, stylization: 100, quality: 'standard' }
    ],
    settings: {
      aspectRatio: '9:16',
      stylization: 100,
      quality: 'standard',
      seed: 22345,
      seedLocked: false,
      promptWeighting: 100,
      isPrivate: false
    },
    isGenerating: false,
    createdAt: new Date('2025-08-22T14:45:00')
  },
  {
    id: '3',
    name: 'Landscape Study',
    prompt: 'dramatic mountain landscape with golden hour lighting and misty valleys',
    images: [
      { id: '3-1', url: '', prompt: 'Mountain landscape', aspectRatio: '16:9', liked: true, timestamp: new Date(), seed: 32345, stylization: 150, quality: 'high' },
      { id: '3-2', url: '', prompt: 'Mountain landscape', aspectRatio: '16:9', liked: false, timestamp: new Date(), seed: 32346, stylization: 150, quality: 'high' },
      { id: '3-3', url: '', prompt: 'Mountain landscape', aspectRatio: '16:9', liked: false, timestamp: new Date(), seed: 32347, stylization: 150, quality: 'high' },
      { id: '3-4', url: '', prompt: 'Mountain landscape', aspectRatio: '16:9', liked: true, timestamp: new Date(), seed: 32348, stylization: 150, quality: 'high' }
    ],
    settings: {
      aspectRatio: '16:9',
      stylization: 150,
      quality: 'high',
      seed: 32345,
      seedLocked: false,
      promptWeighting: 100,
      isPrivate: false
    },
    isGenerating: false,
    createdAt: new Date('2025-08-21T16:20:00')
  },
  {
    id: '4',
    name: 'Abstract Art',
    prompt: 'vibrant abstract composition with flowing geometric shapes',
    images: [
      { id: '4-1', url: '', prompt: 'Abstract art', aspectRatio: '1:1', liked: false, timestamp: new Date(), seed: 42345, stylization: 300, quality: 'standard' },
      { id: '4-2', url: '', prompt: 'Abstract art', aspectRatio: '1:1', liked: true, timestamp: new Date(), seed: 42346, stylization: 300, quality: 'standard' },
      { id: '4-3', url: '', prompt: 'Abstract art', aspectRatio: '1:1', liked: false, timestamp: new Date(), seed: 42347, stylization: 300, quality: 'standard' },
      { id: '4-4', url: '', prompt: 'Abstract art', aspectRatio: '1:1', liked: false, timestamp: new Date(), seed: 42348, stylization: 300, quality: 'standard' }
    ],
    settings: {
      aspectRatio: '1:1',
      stylization: 300,
      quality: 'standard',
      seed: 42345,
      seedLocked: false,
      promptWeighting: 100,
      isPrivate: false
    },
    isGenerating: false,
    createdAt: new Date('2025-08-21T11:15:00')
  },
  {
    id: '5',
    name: 'Character Design',
    prompt: 'futuristic cyberpunk character with neon accessories',
    images: [
      { id: '5-1', url: '', prompt: 'Cyberpunk character', aspectRatio: '9:16', liked: true, timestamp: new Date(), seed: 52345, stylization: 250, quality: 'high' },
      { id: '5-2', url: '', prompt: 'Cyberpunk character', aspectRatio: '9:16', liked: false, timestamp: new Date(), seed: 52346, stylization: 250, quality: 'high' },
      { id: '5-3', url: '', prompt: 'Cyberpunk character', aspectRatio: '9:16', liked: true, timestamp: new Date(), seed: 52347, stylization: 250, quality: 'high' },
      { id: '5-4', url: '', prompt: 'Cyberpunk character', aspectRatio: '9:16', liked: false, timestamp: new Date(), seed: 52348, stylization: 250, quality: 'high' }
    ],
    settings: {
      aspectRatio: '9:16',
      stylization: 250,
      quality: 'high',
      seed: 52345,
      seedLocked: false,
      promptWeighting: 100,
      isPrivate: false
    },
    isGenerating: false,
    createdAt: new Date('2025-08-20T09:30:00')
  }
];

// Hook to detect screen size
const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return screenSize;
};

// Get aspect ratio dimensions for styling
const getAspectRatioStyle = (aspectRatio: string) => {
  switch (aspectRatio) {
    case '16:9':
      return 'aspect-[16/9]';
    case '9:16':
      return 'aspect-[9/16]';
    case '4:3':
      return 'aspect-[4/3]';
    case '3:4':
      return 'aspect-[3/4]';
    case '3:2':
      return 'aspect-[3/2]';
    case '2:3':
      return 'aspect-[2/3]';
    case '1:1':
    default:
      return 'aspect-square';
  }
};

// Group sessions by date
const groupSessionsByDate = (sessions: GenerationSession[]) => {
  const groups: { [key: string]: GenerationSession[] } = {};
  
  sessions.forEach(session => {
    const dateKey = session.createdAt.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
  });
  
  // Sort groups by date (most recent first)
  const sortedGroupKeys = Object.keys(groups).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  return sortedGroupKeys.map(dateKey => ({
    date: new Date(dateKey),
    sessions: groups[dateKey].sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    )
  }));
};

// Format date for display
const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short' 
  };
  return date.toLocaleDateString('en-US', options);
};

// Responsive Image Tile Component
const ImageTile = ({ 
  image, 
  onClick, 
  onVSubtle,
  onVStrong,
  onAnimate,
  className = "",
  isMobile = false
}: {
  image: GeneratedImage;
  onClick: (image: GeneratedImage) => void;
  onVSubtle: (id: string) => void;
  onVStrong: (id: string) => void;
  onAnimate: (id: string) => void;
  className?: string;
  isMobile?: boolean;
}) => {
  const aspectClass = getAspectRatioStyle(image.aspectRatio);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative group cursor-pointer bg-gray-800 rounded-sm overflow-hidden hover:bg-gray-700 transition-all duration-200 ${aspectClass} ${className}`}
      onClick={() => onClick(image)}
    >
      {/* Image Placeholder */}
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <ImageIcon className={`mx-auto mb-2 opacity-60 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
          <p className={`font-medium ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Generated Image</p>
          <p className={`opacity-60 mt-1 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>{image.aspectRatio}</p>
        </div>
      </div>

      {/* Action Buttons Overlay - Centered */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center">
        {/* Centered Action Buttons */}
        <div className={`flex items-center justify-center ${isMobile ? 'gap-1 mb-4' : 'gap-2 mb-6'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onVSubtle(image.id);
            }}
            className={`p-0 bg-white/20 text-white hover:bg-blue-500/80 border-none ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}
            title="V Subtle"
          >
            <Shuffle className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onVStrong(image.id);
            }}
            className={`p-0 bg-white/20 text-white hover:bg-purple-500/80 border-none ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}
            title="V Strong"
          >
            <Zap className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAnimate(image.id);
            }}
            className={`p-0 bg-white/20 text-white hover:bg-green-500/80 border-none ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}
            title="Animate"
          >
            <Video className={isMobile ? 'w-3 h-3' : 'w-4 h-4'} />
          </Button>
        </div>

        {/* Dark Variation Labels Below Buttons */}
        <div className={`flex justify-center gap-1 ${isMobile ? 'text-[8px]' : 'text-[9px]'} text-white/90 font-medium`}>
          <span className="bg-black/80 px-2 py-1 rounded-md text-blue-400">V Subtle</span>
          <span className="bg-black/80 px-2 py-1 rounded-md text-purple-400">V Strong</span>
          <span className="bg-black/80 px-2 py-1 rounded-md text-green-400">Animate</span>
        </div>
      </div>
    </motion.div>
  );
};

// Responsive Generation Tab Component
const GenerationTab = ({ 
  session, 
  onImageClick, 
  onVSubtle,
  onVStrong,
  onAnimate,
  screenSize
}: {
  session: GenerationSession;
  onImageClick: (image: GeneratedImage) => void;
  onVSubtle: (id: string) => void;
  onVStrong: (id: string) => void;
  onAnimate: (id: string) => void;
  screenSize: { isMobile: boolean; isTablet: boolean; isDesktop: boolean };
}) => {
  const { isMobile, isTablet, isDesktop } = screenSize;
  
  // Responsive layout logic
  const getResponsiveLayout = () => {
    if (isMobile) {
      return {
        containerClass: "flex flex-col gap-4",
        imageContainerClass: "w-full",
        promptContainerClass: "w-full",
        imageGridClass: "grid grid-cols-2 gap-2 max-h-[300px]",
        padding: "px-3 py-1",
        promptPadding: "px-3"
      };
    }
    
    if (isTablet) {
      return {
        containerClass: "flex flex-col lg:flex-row gap-4",
        imageContainerClass: "w-full lg:w-[65%]",
        promptContainerClass: "w-full lg:w-[35%]",
        imageGridClass: session.settings.aspectRatio === '16:9' 
          ? "grid grid-cols-2 gap-2 max-h-[350px]"
          : "flex flex-row gap-2 max-h-[400px]",
        padding: "px-4 py-1",
        promptPadding: "px-3"
      };
    }
    
    // Desktop
    return {
      containerClass: "flex gap-0.5 h-full",
      imageContainerClass: "w-[70%]",
      promptContainerClass: "w-[30%] flex flex-col",
      imageGridClass: session.settings.aspectRatio === '16:9' 
        ? "grid grid-cols-2 gap-2 h-full max-h-[400px]"
        : "flex flex-row gap-2 h-full max-h-[500px]",
      padding: "px-6 py-1",
      promptPadding: "px-4"
    };
  };

  const layout = getResponsiveLayout();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full mx-auto ${isDesktop ? 'max-w-[1600px]' : ''}`}
    >
      {/* Generation Status */}
      <AnimatePresence>
        {session.isGenerating && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mb-4 p-3 bg-blue-900/20 rounded-lg ${isMobile ? 'mx-3' : 'mb-6 p-4'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`bg-blue-600 rounded-md flex items-center justify-center ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`}>
                <Sparkles className={`text-white animate-spin ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-white ${isMobile ? 'text-sm' : ''}`}>Generating images...</h3>
                <p className={`text-gray-400 truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>"{session.prompt}"</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Tab */}
      <div className={`bg-transparent rounded-lg shadow-lg ${layout.padding}`}>
        <div className={layout.containerClass}>
          
          {/* Image Output Section */}
          <div className={layout.imageContainerClass}>
            <AnimatePresence mode="wait">
              {session.images.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={layout.imageGridClass}
                >
                  {session.images.map((image) => (
                    <ImageTile
                      key={image.id}
                      image={image}
                      onClick={onImageClick}
                      onVSubtle={onVSubtle}
                      onVStrong={onVStrong}
                      onAnimate={onAnimate}
                      className={!session.settings.aspectRatio.includes('16:9') && isDesktop ? "flex-1" : ""}
                      isMobile={isMobile}
                    />
                  ))}
                </motion.div>
              ) : !session.isGenerating ? (
                /* Empty State */
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-center flex flex-col items-center justify-center ${
                    isMobile ? 'py-12 min-h-[200px]' : 'py-20 h-full'
                  }`}
                >
                  <div className={`bg-gray-800 rounded-lg flex items-center justify-center mb-4 ${
                    isMobile ? 'w-12 h-12' : 'w-16 h-16'
                  }`}>
                    <ImageIcon className={`text-gray-400 ${isMobile ? 'w-6 h-6' : 'w-8 h-8'}`} />
                  </div>
                  <h3 className={`font-medium mb-2 text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>
                    Ready to create
                  </h3>
                  <p className={`text-gray-400 max-w-md ${isMobile ? 'text-sm px-4' : ''}`}>
                    Your generated images will appear here in {session.settings.aspectRatio === '16:9' ? '2×2 grid' : 'horizontal row'} layout
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          
          {/* Prompt Display Section */}
          <div className={layout.promptContainerClass}>
            <div className={`bg-transparent rounded-lg flex-1 flex flex-col ${layout.promptPadding} ${
              isMobile ? 'max-h-none' : 'max-h-[500px]'
            }`}>
              {/* Full Prompt Text */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-3"
              >
                <p className={`text-gray-200 leading-relaxed ${isMobile ? 'text-xs' : ''}`} 
                   style={{ fontSize: isMobile ? '11px' : '10px' }}>
                  {session.prompt}
                </p>
              </motion.div>
              
              {/* Parameter Tags */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`flex flex-wrap gap-1.5 ${isMobile ? 'mb-3' : 'gap-2 mb-4'}`}
              >
                {[
                  `ar ${session.settings.aspectRatio}`,
                  'style raw',
                  'chaos 400',
                  'weird 200',
                  `stylize ${session.settings.stylization}`,
                  `quality ${session.settings.quality}`
                ].map((tag) => (
                  <Badge 
                    key={tag}
                    className={`bg-gray-700 text-gray-300 rounded-full font-medium border-none ${
                      isMobile ? 'px-2 py-0.5' : 'px-3 py-1'
                    }`} 
                    style={{ fontSize: isMobile ? '9px' : '10px' }}
                  >
                    {tag}
                  </Badge>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`${isMobile ? 'grid grid-cols-2 gap-2 mt-auto' : 'flex gap-2 mt-auto'}`}
              >
                {[
                  { icon: Play, text: 'Rerun' },
                  { icon: Copy, text: 'Use' },
                  { icon: EyeOff, text: 'Hide' }
                ].map(({ icon: Icon, text }) => (
                  <Button
                    key={text}
                    variant="ghost"
                    size="sm"
                    className={`bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white border-none font-medium transition-colors duration-200 ${
                      isMobile 
                        ? 'h-7 text-[9px] px-2' 
                        : 'flex-1 h-8 text-[10px]'
                    }`}
                  >
                    <Icon className={`mr-1 ${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
                    {isMobile && text === 'Hide' ? '••••' : text}
                  </Button>
                ))}
                
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white border-none h-8 p-0 transition-colors duration-200"
                    style={{ fontSize: '10px' }}
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ImageGenerator: React.FC<ImageGeneratorProps> = () => {
  const [sessions, setSessions] = useState<GenerationSession[]>(mockSessions);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<GenerationSession | null>(null);
  const screenSize = useScreenSize();

  const handleImageClick = useCallback((image: GeneratedImage) => {
    // Find the session that contains this image
    const session = sessions.find(s => s.images.some(img => img.id === image.id));
    setSelectedImage(image);
    setSelectedSession(session || null);
    setIsImageDialogOpen(true);
    console.log('Opening image:', image.id);
  }, [sessions]);

  const handleVSubtle = useCallback((imageId: string) => {
    console.log('V Subtle variation for image:', imageId);
    toast.success('Creating subtle variation...');
    // Here you would implement the subtle variation logic
  }, []);

  const handleVStrong = useCallback((imageId: string) => {
    console.log('V Strong variation for image:', imageId);
    toast.success('Creating strong variation...');
    // Here you would implement the strong variation logic
  }, []);

  const handleAnimate = useCallback((imageId: string) => {
    console.log('Animating image:', imageId);
    toast.success('Creating animation...');
    // Here you would implement the animation logic
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate images');
      return;
    }

    setIsGenerating(true);

    try {
      // Create new session
      const newSession: GenerationSession = {
        id: Date.now().toString(),
        name: prompt.length > 30 ? `${prompt.substring(0, 27)}...` : prompt,
        prompt: prompt.trim(),
        images: [],
        settings: {
          aspectRatio: '16:9',
          stylization: 200,
          quality: 'high',
          seedLocked: false,
          promptWeighting: 100,
          isPrivate: false
        },
        isGenerating: true,
        createdAt: new Date()
      };

      // Add new session to the beginning
      setSessions(prev => [newSession, ...prev]);

      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

      // Generate mock images
      const generatedImages: GeneratedImage[] = Array.from({ length: 4 }, (_, index) => ({
        id: `${newSession.id}-${index + 1}`,
        url: '',
        prompt: newSession.prompt,
        aspectRatio: newSession.settings.aspectRatio,
        liked: false,
        timestamp: new Date(),
        seed: Math.floor(Math.random() * 100000),
        stylization: newSession.settings.stylization,
        quality: newSession.settings.quality
      }));

      // Update session with generated images
      setSessions(prev => prev.map(session => 
        session.id === newSession.id 
          ? { ...session, images: generatedImages, isGenerating: false }
          : session
      ));

      setPrompt('');
      toast.success('Images generated successfully!');
    } catch (error) {
      toast.error('Failed to generate images');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) {
        handleGenerate();
      }
    }
  }, [prompt, handleGenerate]);

  const handleDialogClose = useCallback(() => {
    setIsImageDialogOpen(false);
    setSelectedImage(null);
    setSelectedSession(null);
  }, []);

  // Parse prompt for parameter tags
  const parsePromptTags = useCallback((prompt: string, settings: GenerationSession['settings']) => {
    const tags = [
      `ar ${settings.aspectRatio}`,
      'style raw',
      'chaos 400',
      'weird 200',
      `stylize ${settings.stylization}`,
      `quality ${settings.quality}`
    ];
    return tags;
  }, []);

  // Group sessions by date
  const groupedSessions = useMemo(() => groupSessionsByDate(sessions), [sessions]);

  return (
    <div className="h-full bg-black text-white overflow-hidden">
      <NoiseOverlay intensity="light" />
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Main Content with Responsive Padding */}
        <div className="flex-1 p-0 overflow-y-auto pb-32">
          {/* Date-Grouped Generation Tabs */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={screenSize.isMobile ? "space-y-4" : "space-y-6"}
          >
            <AnimatePresence>
              {groupedSessions.map((group, index) => (
                <motion.div 
                  key={group.date.toDateString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  {/* Date Header */}
                  <div className={screenSize.isMobile ? "px-3 pt-4 pb-1" : "px-6 pt-6 pb-1"}>
                    <h2 className={`font-medium text-white ${
                      screenSize.isMobile ? 'text-base' : 'text-lg'
                    }`}>
                      {formatDate(group.date)}
                    </h2>
                  </div>
                  
                  {/* Sessions for this date */}
                  <div className="space-y-0">
                    {group.sessions.map((session) => (
                      <GenerationTab
                        key={session.id}
                        session={session}
                        onImageClick={handleImageClick}
                        onVSubtle={handleVSubtle}
                        onVStrong={handleVStrong}
                        onAnimate={handleAnimate}
                        screenSize={screenSize}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Input Toolbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--form-bg)] p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.15)] z-20">
          <div className="flex items-end gap-3 max-w-7xl mx-auto">
            {/* Prompt Input */}
            <div className="flex-1">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe the image you want to generate... (e.g., 'a serene mountain landscape at sunset with golden lighting')"
                className="resize-none min-h-[60px] max-h-[200px] bg-[var(--form-input-bg)] border-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)] rounded-lg"
                disabled={isGenerating}
                rows={2}
                style={{ 
                  backgroundColor: 'var(--form-input-bg)',
                  border: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Settings Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 bg-[var(--form-input-bg)] hover:bg-[var(--form-hover-bg)] border-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                disabled={isGenerating}
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* Upload Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 bg-[var(--form-input-bg)] hover:bg-[var(--form-hover-bg)] border-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                disabled={isGenerating}
              >
                <Upload className="w-4 h-4" />
              </Button>

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-12 h-10 p-0 bg-purple-600 hover:bg-purple-700 text-white shadow-[0_2px_6px_rgba(147,51,234,0.3)] border-0"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Character Count and Help Text */}
          {prompt.length > 0 && (
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground max-w-7xl mx-auto">
              <span>Press Enter to generate, Shift + Enter for new line</span>
              <span className={prompt.length > 1900 ? 'text-orange-400' : prompt.length > 1950 ? 'text-red-400' : ''}>
                {prompt.length}/2000
              </span>
            </div>
          )}
        </div>

        {/* Image Detail Dialog */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent 
            className="max-w-6xl h-[80vh] bg-[var(--solid-popup-bg)] border-0 shadow-[0_12px_24px_rgba(0,0,0,0.6)] p-0 overflow-hidden"
            onPointerDownOutside={handleDialogClose}
            onEscapeKeyDown={handleDialogClose}
          >
            <DialogTitle className="sr-only">Image Details</DialogTitle>
            <DialogDescription className="sr-only">
              View detailed information about the generated image, including prompt, parameters, and creation options
            </DialogDescription>
            
            {selectedImage && selectedSession && (
              <div className="flex h-full">
                {/* Left Panel - Prompt and Tags */}
                <div className="w-1/2 p-6 overflow-y-auto bg-[var(--solid-card-bg)]">
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-foreground">Image Details</h2>
                      <p className="text-sm text-muted-foreground">
                        Generated on {selectedImage.timestamp.toLocaleDateString()}
                      </p>
                    </div>

                    {/* Prompt Section */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-foreground">Prompt</h3>
                      <div className="bg-[var(--form-input-bg)] rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
                        <p className="text-sm leading-relaxed text-foreground">
                          {selectedSession.prompt}
                        </p>
                      </div>
                    </div>

                    {/* Parameter Tags */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-foreground">Parameters</h3>
                      <div className="flex flex-wrap gap-2">
                        {parsePromptTags(selectedSession.prompt, selectedSession.settings).map((tag) => (
                          <Badge 
                            key={tag}
                            className="bg-gray-700 text-gray-300 rounded-full font-medium border-none px-3 py-1 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-foreground">Image Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Aspect Ratio:</span>
                          <p className="font-medium text-foreground">{selectedImage.aspectRatio}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quality:</span>
                          <p className="font-medium text-foreground capitalize">{selectedImage.quality}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stylization:</span>
                          <p className="font-medium text-foreground">{selectedImage.stylization}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Seed:</span>
                          <p className="font-medium text-foreground">{selectedImage.seed}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <h3 className="font-medium text-foreground">Actions</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          onClick={() => {
                            handleVSubtle(selectedImage.id);
                            handleDialogClose();
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        >
                          <Shuffle className="w-3 h-3 mr-1" />
                          V Subtle
                        </Button>
                        <Button
                          onClick={() => {
                            handleVStrong(selectedImage.id);
                            handleDialogClose();
                          }}
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          V Strong
                        </Button>
                        <Button
                          onClick={() => {
                            handleAnimate(selectedImage.id);
                            handleDialogClose();
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs"
                        >
                          <Video className="w-3 h-3 mr-1" />
                          Animate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Image Display */}
                <div className="w-1/2 bg-gray-900 flex items-center justify-center p-6">
                  <div className="max-w-full max-h-full flex items-center justify-center">
                    <div className={`bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${getAspectRatioStyle(selectedImage.aspectRatio)} w-full max-w-md`}>
                      <div className="text-center">
                        <ImageIcon className="mx-auto mb-4 w-16 h-16 opacity-60" />
                        <p className="font-medium text-lg">Generated Image</p>
                        <p className="opacity-60 mt-2">{selectedImage.aspectRatio}</p>
                        <p className="text-xs opacity-40 mt-2">
                          ID: {selectedImage.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImageGenerator;