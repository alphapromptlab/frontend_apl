import React, { useState, useCallback, useRef, memo, useMemo } from "react";
// import higgsFieldVideo from 'figma:asset/2b383f358bf5c6b0024a63f352d694786425be7f.png';
import Masonry from "react-responsive-masonry";
import {
  Download,
  Wand2,
  Sparkles,
  Video,
  Sliders,
  ChevronRight,
  Volume2,
  User,
  X,
  Edit2,
  ImagePlus,
  Shuffle,
  Star,
  Search,
  CheckCircle,
  Share2,
  Loader,
  Users,
  Upload,
  ArrowRight,
  ArrowLeft,
  Clapperboard,
  Camera,
} from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { toast } from "sonner@2.0.3";

// Optimized constants
const PROCESSING_STEPS = [
  { id: 1, label: "Queued", description: "Added to generation queue" },
  { id: 2, label: "Processing", description: "AI is analyzing your prompt" },
  { id: 3, label: "Rendering Frames", description: "Creating video frames" },
  { id: 4, label: "Finalizing", description: "Rendering final video" },
];

const GENERATION_TIPS = [
  "Use both start & end frames for smoother transitions.",
  "Cinematic style works best with motion blur effects.",
  "Shorter videos generate faster and use fewer credits.",
];

const VIDEO_MODELS = [
  {
    category: "Higgsfield Models",
    icon: "🟣",
    models: [
      {
        id: "higgsfield-lite",
        label: "Higgsfield Lite",
        description: "Basic speed, standard queue",
        specs: "720p | 3s–5s",
        credits: 2,
        isPremium: false,
        rating: 4.2,
      },
    ],
  },
];

// Optimized camera motion data with reduced size
const SPEAK_CAMERA_MOTIONS = {
  higgsfield: [
    {
      id: "static",
      label: "STATIC",
      description: "Fixed camera position",
      isTopChoice: true,
      category: "basic",
      height: 140,
    },
    {
      id: "selfie",
      label: "SELFIE",
      description: "Close-up selfie shot",
      isTopChoice: true,
      category: "basic",
      height: 160,
    },
    {
      id: "general",
      label: "GENERAL",
      description: "General purpose shot",
      isTopChoice: true,
      category: "basic",
      height: 180,
    },
    {
      id: "selling",
      label: "SELLING",
      description: "Sales presentation mode",
      isTopChoice: false,
      category: "effects",
      height: 170,
    },
    {
      id: "walk-talk",
      label: "WALK & TALK",
      description: "Walking while speaking",
      isTopChoice: false,
      category: "epic",
      height: 190,
    },
    {
      id: "car-grip",
      label: "CAR GRIP",
      description: "Car-mounted camera",
      isTopChoice: false,
      category: "epic",
      height: 200,
    },
  ],
  veo3: [
    {
      id: "fire-selfie",
      label: "FIRE SELFIE",
      description: "High energy selfie",
      isTopChoice: false,
      category: "effects",
      height: 210,
    },
    {
      id: "thundergod",
      label: "THUNDERGOD",
      description: "Epic thunder god effect",
      isTopChoice: false,
      category: "effects",
      height: 250,
    },
  ],
};

const CAMERA_MOTIONS = {
  higgsfield: [
    {
      id: "general",
      label: "GENERAL",
      description: "Basic camera setup",
      isTopChoice: true,
      isMixed: false,
      category: "basic",
      tags: ["basic", "static"],
      height: 200,
    },
    {
      id: "earth-zoom-out",
      label: "EARTH ZOOM OUT",
      description: "Zoom out from earth",
      isTopChoice: true,
      isMixed: false,
      category: "effects",
      tags: ["zoom", "space"],
      height: 280,
    },
    {
      id: "eyes-in",
      label: "EYES IN",
      description: "Focus on eyes",
      isTopChoice: true,
      isMixed: false,
      category: "epic",
      tags: ["focus", "portrait"],
      height: 240,
    },
    {
      id: "building-explosion",
      label: "BUILDING EXPLOSION",
      description: "Explosive building destruction",
      isTopChoice: true,
      isMixed: false,
      category: "effects",
      tags: ["explosion", "dramatic"],
      height: 260,
    },
    {
      id: "static",
      label: "STATIC",
      description: "Fixed camera position",
      isTopChoice: true,
      isMixed: false,
      category: "basic",
      tags: ["static", "fixed"],
      height: 160,
    },
    {
      id: "arc-right",
      label: "ARC RIGHT",
      description: "Right arc camera movement",
      isTopChoice: true,
      isMixed: false,
      category: "basic",
      tags: ["arc", "movement"],
      height: 180,
    },
    {
      id: "3d-rotation",
      label: "3D ROTATION",
      description: "3D rotational camera movement",
      isTopChoice: true,
      isMixed: false,
      category: "epic",
      tags: ["3d", "rotation"],
      height: 220,
    },
    {
      id: "turning-metal",
      label: "TURNING METAL",
      description: "Metal turning transformation",
      isTopChoice: true,
      isMixed: false,
      category: "effects",
      tags: ["metal", "transformation"],
      height: 200,
    },
  ],
  veo3: [
    {
      id: "fpv-drone",
      label: "FPV DRONE",
      description: "First Person View drone footage",
      isTopChoice: false,
      isMixed: false,
      category: "epic",
      tags: ["fpv", "drone"],
      height: 220,
    },
    {
      id: "handheld",
      label: "HANDHELD",
      description: "Natural handheld camera shake",
      isTopChoice: false,
      isMixed: false,
      category: "basic",
      tags: ["handheld", "natural"],
      height: 170,
    },
    {
      id: "levitation",
      label: "LEVITATION",
      description: "Floating levitation effect",
      isTopChoice: false,
      isMixed: false,
      category: "effects",
      tags: ["levitation", "floating"],
      height: 200,
    },
  ],
  minimax: [
    {
      id: "flood",
      label: "FLOOD",
      description: "Water flood effect",
      isTopChoice: false,
      isMixed: false,
      category: "effects",
      tags: ["flood", "water"],
      height: 210,
    },
    {
      id: "robo-arm",
      label: "ROBO ARM",
      description: "Robotic arm camera movement",
      isTopChoice: false,
      isMixed: false,
      category: "epic",
      tags: ["robot", "arm"],
      height: 190,
    },
  ],
};

const CAMERA_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "trending", label: "Trending" },
  { id: "effects", label: "Effects" },
  { id: "basic", label: "Basic Camera Control" },
  { id: "epic", label: "Epic Camera Control" },
  { id: "mix", label: "Mix" },
];

// Optimized interfaces
interface UploadedFile {
  file: File;
  preview: string;
  name: string;
  aspectRatio?: string;
}

interface GenerationState {
  status: "idle" | "processing" | "completed" | "error";
  currentStep: number;
  progress: number;
  result?: {
    videoUrl: string;
    duration: string;
    resolution: string;
    credits: number;
    generationTime: string;
  };
}

type GeneratorMode = "video" | "speak" | "ugc";

interface VideoGeneratorProps {
  currentMode?: GeneratorMode;
  onModeChange?: (mode: GeneratorMode) => void;
}

// Optimized memoized components
const LoadingSpinner = memo(() => (
  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mx-auto">
    <Loader className="w-10 h-10 text-white animate-spin" />
  </div>
));

const MotionCard = memo<{
  motion: any;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}>(({ motion, isSelected, onClick, className }) => (
  <div
    className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 mb-4 hover:scale-105 ${
      isSelected ? "ring-2 ring-yellow-400" : ""
    } ${className || ""}`}
    style={{ height: motion.height }}
    onClick={onClick}
  >
    <div className="w-full h-full relative">
      <img
        // src={higgsFieldVideo}
        alt={motion.label}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/30" />

      {motion.isTopChoice && (
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium text-white">Top Choice</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-white font-bold text-lg tracking-wider drop-shadow-lg">
          {motion.label}
        </div>
      </div>
    </div>
  </div>
));

const FileUploadArea = memo<{
  onFileUpload: (file: File) => void;
  fileRef: React.RefObject<HTMLInputElement>;
}>(({ onFileUpload, fileRef }) => (
  <div className="rounded-xl">
    <div
      className="rounded-xl p-4 sm:p-8 h-24 sm:h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-transparent transition-all duration-200 group bg-transparent"
      style={{
        outline: "2px dashed rgb(113, 113, 130, 0.4)",
        outlineStyle: "dashed",
        outlineOffset: "-2px",
      }}
      onClick={() => fileRef.current?.click()}
    >
      <div className="w-8 sm:w-12 h-8 sm:h-12 rounded-full bg-muted/20 flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-muted/30 transition-colors">
        <ImagePlus className="w-4 sm:w-6 h-4 sm:h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <div className="text-center">
        <div className="font-medium text-foreground mb-1 text-sm sm:text-base">
          Upload image or generate it
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          PNG, JPG or Paste from clipboard
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileUpload(file);
        }}
      />
    </div>
  </div>
));

export const VideoGenerator = memo<VideoGeneratorProps>(
  ({ currentMode = "video", onModeChange }) => {
    // Optimized state management
    const [startFrame, setStartFrame] = useState<UploadedFile | null>(null);
    const [prompt, setPrompt] = useState("");
    const [script, setScript] = useState("");
    const [ugcPrompt, setUgcPrompt] = useState("");
    const [enhanceOn, setEnhanceOn] = useState(true);
    const [duration, setDuration] = useState(5);
    const [selectedModel] = useState("higgsfield-lite");
    const [selectedCameraMotion, setSelectedCameraMotion] = useState("general");
    const [showCameraMotionPanel, setShowCameraMotionPanel] = useState(false);
    const [cameraMotionMode, setCameraMotionMode] = useState<"single" | "mix">(
      "single"
    );
    const [selectedMotions, setSelectedMotions] = useState<string[]>([
      "general",
    ]);
    const [editingMotionIndex, setEditingMotionIndex] = useState<number | null>(
      null
    );
    const [selectedCameraProvider, setSelectedCameraProvider] = useState<
      "higgsfield" | "veo3" | "minimax"
    >("higgsfield");
    const [selectedCameraCategory, setSelectedCameraCategory] = useState("all");
    const [cameraMotionSearch, setCameraMotionSearch] = useState("");
    const [selectedSpeakCameraMotion, setSelectedSpeakCameraMotion] =
      useState("static");
    const [generationState, setGenerationState] = useState<GenerationState>({
      status: "idle",
      currentStep: 0,
      progress: 0,
    });
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [showAudioOptions, setShowAudioOptions] = useState(false);
    const [showUgcBuilder, setShowUgcBuilder] = useState(false);
    const [ugcCurrentStep, setUgcCurrentStep] = useState("template");
    const [ugcSelectedTemplate, setUgcSelectedTemplate] = useState("selling");

    const startFrameRef = useRef<HTMLInputElement>(null);

    // Memoized computed values
    const selectedModelData = useMemo(
      () =>
        VIDEO_MODELS.flatMap((category) => category.models).find(
          (model) => model.id === selectedModel
        ),
      [selectedModel]
    );

    const totalCredits = selectedModelData?.credits || 2;
    const canGenerate = useMemo(
      () =>
        prompt.trim().length > 10 ||
        script.trim().length > 10 ||
        ugcPrompt.trim().length > 10,
      [prompt, script, ugcPrompt]
    );

    const filteredCameraMotions = useMemo(() => {
      const providers =
        currentMode === "speak" ? SPEAK_CAMERA_MOTIONS : CAMERA_MOTIONS;
      const providerMotions =
        providers[selectedCameraProvider] || providers.higgsfield;

      let filtered = providerMotions;

      if (selectedCameraCategory !== "all") {
        filtered = filtered.filter(
          (motion) => motion.category === selectedCameraCategory
        );
      }

      if (cameraMotionSearch) {
        const search = cameraMotionSearch.toLowerCase();
        filtered = filtered.filter(
          (motion) =>
            motion.label.toLowerCase().includes(search) ||
            motion.description.toLowerCase().includes(search) ||
            motion.tags?.some((tag) => tag.toLowerCase().includes(search))
        );
      }

      return filtered;
    }, [
      currentMode,
      selectedCameraProvider,
      selectedCameraCategory,
      cameraMotionSearch,
    ]);

    // Helper function to get motion details by ID
    const getMotionDetailsById = useCallback(
      (motionId: string) => {
        const providers =
          currentMode === "speak" ? SPEAK_CAMERA_MOTIONS : CAMERA_MOTIONS;
        const provider =
          providers[selectedCameraProvider] || providers.higgsfield;
        return provider.find((motion) => motion.id === motionId);
      },
      [currentMode, selectedCameraProvider]
    );

    const currentMotionDetails = useMemo(() => {
      return getMotionDetailsById(selectedCameraMotion);
    }, [getMotionDetailsById, selectedCameraMotion]);

    const currentSpeakMotionDetails = useMemo(() => {
      return getMotionDetailsById(selectedSpeakCameraMotion);
    }, [getMotionDetailsById, selectedSpeakCameraMotion]);

    // Optimized event handlers
    const handleFileUpload = useCallback((file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = `${img.width}:${img.height}`;
          const uploadedFile: UploadedFile = {
            file,
            preview: e.target?.result as string,
            name: file.name,
            aspectRatio,
          };
          setStartFrame(uploadedFile);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }, []);

    const handleGenerate = useCallback(async () => {
      if (!canGenerate) return;

      setGenerationState({ status: "processing", currentStep: 0, progress: 0 });

      const tipInterval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % GENERATION_TIPS.length);
      }, 3000);

      for (let step = 0; step < PROCESSING_STEPS.length; step++) {
        setGenerationState((prev) => ({
          ...prev,
          currentStep: step,
          progress: (step + 1) * 25,
        }));
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }

      clearInterval(tipInterval);

      setGenerationState({
        status: "completed",
        currentStep: 4,
        progress: 100,
        result: {
          videoUrl:
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          duration: `${duration}s`,
          resolution: "1080p",
          credits: totalCredits,
          generationTime: "47s",
        },
      });

      toast.success(
        `${
          currentMode === "video"
            ? "Video"
            : currentMode === "speak"
            ? "Speech"
            : "UGC content"
        } generated successfully!`
      );
    }, [canGenerate, duration, totalCredits, currentMode]);

    const handleCameraMotionSelect = useCallback(
      (motionId: string) => {
        if (currentMode === "speak") {
          setSelectedSpeakCameraMotion(motionId);
          setShowCameraMotionPanel(false);
        } else {
          if (cameraMotionMode === "mix") {
            if (editingMotionIndex !== null) {
              setSelectedMotions((prev) => {
                const newMotions = [...prev];
                newMotions[editingMotionIndex] = motionId;
                return newMotions;
              });
              setShowCameraMotionPanel(false);
              setEditingMotionIndex(null);
              toast.success(
                `Updated motion ${editingMotionIndex + 1} successfully!`
              );
            } else {
              if (selectedMotions.length === 1) {
                setSelectedMotions([selectedMotions[0], motionId]);
                setShowCameraMotionPanel(false);
                toast.success("Second camera motion added! Your mix is ready.");
              } else {
                setSelectedMotions([selectedMotions[0], motionId]);
                setShowCameraMotionPanel(false);
                toast.success("Second motion updated successfully!");
              }
            }
          } else {
            setSelectedCameraMotion(motionId);
            setSelectedMotions([motionId]);
            setShowCameraMotionPanel(false);
          }
        }
      },
      [currentMode, cameraMotionMode, editingMotionIndex, selectedMotions]
    );

    const handleCameraMotionModeChange = useCallback(
      (mode: "single" | "mix") => {
        setCameraMotionMode(mode);

        if (mode === "mix") {
          setSelectedCameraCategory("all");
          setShowCameraMotionPanel(true);
          if (selectedMotions.length === 1) {
            setSelectedMotions([selectedMotions[0], "general"]);
          }
          toast.success("Mix mode enabled! Select your second camera motion.");
        } else {
          setSelectedMotions([selectedMotions[0]]);
          setSelectedCameraMotion(selectedMotions[0]);
        }
      },
      [selectedMotions]
    );

    const removeFile = useCallback(() => {
      setStartFrame(null);
    }, []);

    const handleRemoveSecondMotion = useCallback(() => {
      setSelectedMotions([selectedMotions[0]]);
      setCameraMotionMode("single");
      setSelectedCameraMotion(selectedMotions[0]);
      toast.success("Removed second camera motion");
    }, [selectedMotions]);

    // Optimized render functions
    const renderVideoModeContent = useCallback(
      () => (
        <div className="space-y-4 sm:space-y-6">
          {/* Camera Motion Preview Cards - Responsive */}
          {selectedMotions.length > 1 ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {selectedMotions.slice(0, 2).map((motionId, index) => {
                const motionDetails = getMotionDetailsById(motionId);
                return (
                  <div key={`motion-${index}`} className="relative">
                    <div
                      className="relative h-20 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 cursor-pointer hover:scale-105 transition-all duration-200"
                      onClick={() => {
                        setEditingMotionIndex(index);
                        setCameraMotionMode("mix");
                        setShowCameraMotionPanel(true);
                      }}
                    >
                      <img
                        // src={higgsFieldVideo}
                        alt={`${motionDetails?.label || "Motion"} preview`}
                        className="w-full h-full object-cover opacity-70"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30" />

                      {index === 1 && (
                        <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSecondMotion();
                            }}
                            className="h-5 w-5 sm:h-6 sm:w-6 p-0 bg-black/50 backdrop-blur-sm text-white hover:bg-red-500/80 hover:text-white"
                          >
                            <X className="w-2 sm:w-3 h-2 sm:h-3" />
                          </Button>
                        </div>
                      )}

                      <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                        <Edit2 className="w-2 sm:w-3 h-2 sm:h-3 text-white/80" />
                      </div>

                      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2">
                        <div className="text-yellow-400 text-xs sm:text-sm font-bold tracking-wider leading-tight">
                          {motionDetails?.label || `MOTION ${index + 1}`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="relative">
              <div className="relative h-24 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                <img
                  // src={higgsFieldVideo}
                  alt={`${currentMotionDetails?.label || "Static"} preview`}
                  className="w-full h-full object-cover opacity-70"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1 sm:gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setCameraMotionMode("single");
                      setEditingMotionIndex(null);
                      setShowCameraMotionPanel(true);
                    }}
                    className="h-6 sm:h-8 px-2 sm:px-3 text-xs bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
                  >
                    <Edit2 className="w-2 sm:w-3 h-2 sm:h-3 mr-1" />
                    <span className="hidden sm:inline">Change</span>
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      handleCameraMotionModeChange("mix");
                      setEditingMotionIndex(null);
                    }}
                    className="h-6 sm:h-8 px-2 sm:px-3 text-xs bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
                  >
                    <Shuffle className="w-2 sm:w-3 h-2 sm:h-3 mr-1" />
                    <span className="hidden sm:inline">Mix</span>
                  </Button>
                </div>

                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                  <div className="text-yellow-400 text-base sm:text-xl font-bold tracking-wider">
                    {currentMotionDetails?.label || "GENERAL"}
                  </div>
                  <div className="text-white/80 text-xs sm:text-sm">
                    Higgsfield DoP
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Section - Responsive */}
          {startFrame ? (
            <div className="glass-card rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-3 p-2 sm:p-3 bg-muted/30 rounded-lg">
                <img
                  src={startFrame.preview}
                  alt={startFrame.name}
                  className="w-10 sm:w-12 h-10 sm:h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {startFrame.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {startFrame.aspectRatio} •{" "}
                    {(startFrame.file.size / 1024 / 1024).toFixed(1)} MB
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-3 sm:w-4 h-3 sm:h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <FileUploadArea
              onFileUpload={handleFileUpload}
              fileRef={startFrameRef}
            />
          )}

          {/* Prompt Section - Responsive */}
          <div>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Prompt</Label>

              <Textarea
                placeholder="Describe the scene you imagine, with details"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-16 sm:min-h-20 resize-none text-sm leading-relaxed shadow-none outline-none focus:ring-0 focus:border-none focus:outline-none focus:shadow-none px-3 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 rounded-lg text-foreground"
                style={{
                  backgroundColor: "transparent",
                  border: "2px solid grey",
                  boxShadow: "none",
                }}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setEnhanceOn(!enhanceOn)}
                className="flex items-center gap-2 h-7 sm:h-8 px-2 sm:px-3 py-1 text-xs bg-muted/50 border-0 text-foreground focus:ring-0 focus:ring-offset-0 rounded-lg"
              >
                <Sparkles className="w-3 h-3" />
                Enhance {enhanceOn ? "on" : "off"}
              </Button>
            </div>
          </div>

          {/* Model Section - Responsive */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex-1 h-10 sm:h-12 px-3 sm:px-4 py-2 sm:py-3 bg-muted/50 border-0 justify-between text-foreground"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">Model</span>
                <span className="text-sm font-medium text-foreground">
                  {selectedModelData?.label || "Higgsfield Lite"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-10 sm:h-12 w-10 sm:w-12 p-0 bg-muted/50 border-0 text-foreground"
            >
              <Sliders className="w-4 h-4 text-foreground" />
            </Button>
          </div>
        </div>
      ),
      [
        selectedMotions,
        currentMotionDetails,
        startFrame,
        prompt,
        enhanceOn,
        selectedModelData,
        handleFileUpload,
        removeFile,
        handleCameraMotionModeChange,
        getMotionDetailsById,
        handleRemoveSecondMotion,
      ]
    );

    const renderSpeakModeContent = useCallback(
      () => (
        <div className="space-y-4 sm:space-y-6">
          {/* Camera Motion Preview Card - Responsive */}
          <div className="relative">
            <div className="relative h-24 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
              <img
                // src={higgsFieldVideo}
                alt={`${currentSpeakMotionDetails?.label || "Static"} preview`}
                className="w-full h-full object-cover opacity-70"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCameraMotionPanel(true)}
                  className="h-6 sm:h-8 px-2 sm:px-3 text-xs bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-black/70"
                >
                  <Edit2 className="w-2 sm:w-3 h-2 sm:h-3 mr-1" />
                  <span className="hidden sm:inline">Change</span>
                </Button>
              </div>

              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                <div className="text-yellow-400 text-base sm:text-xl font-bold tracking-wider">
                  {currentSpeakMotionDetails?.label || "STATIC"}
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  Higgsfield DoP
                </div>
              </div>
            </div>
          </div>

          {/* Upload Grid - Responsive */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div
              className="rounded-lg sm:rounded-xl p-3 sm:p-6 h-20 sm:h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-transparent transition-all duration-200 group bg-transparent"
              style={{
                outline: "2px dashed rgb(251, 191, 36, 0.6)",
                outlineStyle: "dashed",
                outlineOffset: "-2px",
              }}
              onClick={() => startFrameRef.current?.click()}
            >
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-yellow-500/20 flex items-center justify-center mb-1 sm:mb-2 group-hover:bg-yellow-500/30 transition-colors">
                <ImagePlus className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500" />
              </div>
              <span className="text-xs font-medium text-center">
                Upload image
              </span>
            </div>

            <div
              className="rounded-lg sm:rounded-xl p-3 sm:p-6 h-20 sm:h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-transparent transition-all duration-200 group bg-transparent"
              style={{
                outline: "2px dashed rgb(34, 197, 94, 0.6)",
                outlineStyle: "dashed",
                outlineOffset: "-2px",
              }}
            >
              <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center mb-1 sm:mb-2 group-hover:bg-green-500/30 transition-colors">
                <User className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
              </div>
              <span className="text-xs font-medium text-center">
                Select Avatar
              </span>
            </div>
          </div>

          {/* Audio Upload - Responsive */}
          <Popover open={showAudioOptions} onOpenChange={setShowAudioOptions}>
            <PopoverTrigger asChild>
              <div
                className="rounded-lg sm:rounded-xl p-3 sm:p-6 h-20 sm:h-24 flex flex-col items-center justify-center cursor-pointer hover:bg-transparent transition-all duration-200 group bg-transparent"
                style={{
                  outline: "2px dashed rgb(147, 51, 234, 0.6)",
                  outlineStyle: "dashed",
                  outlineOffset: "-2px",
                }}
              >
                <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-1 sm:mb-2 group-hover:bg-purple-500/30 transition-colors">
                  <Volume2 className="w-3 sm:w-4 h-3 sm:h-4 text-purple-500" />
                </div>
                <span className="text-xs font-medium text-center">
                  Upload audio or generate speech
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="center">
              <div className="space-y-1 p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 text-left"
                  onClick={() => {
                    setShowAudioOptions(false);
                    toast.info("Upload from device clicked");
                  }}
                >
                  <Upload className="w-4 h-4 mr-3 text-blue-500" />
                  <div>
                    <div className="font-medium text-sm">
                      Upload from device
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Upload audio files from your computer
                    </div>
                  </div>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Script Section - Responsive */}
          <div>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Script</Label>

              <Textarea
                placeholder="Enter your script here..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="min-h-16 sm:min-h-20 resize-none text-sm leading-relaxed shadow-none outline-none focus:ring-0 focus:border-none focus:outline-none focus:shadow-none px-3 py-3 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60 rounded-lg text-foreground"
                style={{
                  backgroundColor: "transparent",
                  border: "2px solid grey",
                  boxShadow: "none",
                }}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => setEnhanceOn(!enhanceOn)}
                className="flex items-center gap-2 h-7 sm:h-8 px-2 sm:px-3 py-1 text-xs bg-muted/50 border-0 text-foreground focus:ring-0 focus:ring-offset-0 rounded-lg"
              >
                <Volume2 className="w-3 h-3" />
                Voice {enhanceOn ? "on" : "off"}
              </Button>
            </div>
          </div>

          {/* Model Section - Responsive */}
          <div className="grid grid-cols-10 gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="col-span-7 h-10 sm:h-12 px-3 sm:px-4 py-2 sm:py-3 bg-muted/50 border-0 justify-between text-foreground"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">Model</span>
                <span className="text-sm font-medium text-foreground">
                  Higgsfield Speak
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              className="col-span-3 h-10 sm:h-12 px-2 sm:px-3 py-2 sm:py-3 bg-muted/50 border-0 justify-between text-foreground"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground">Quality</span>
                <span className="text-sm font-medium text-foreground">
                  High
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      ),
      [currentSpeakMotionDetails, showAudioOptions, script, enhanceOn]
    );

    const renderUgcModeContent = useCallback(
      () => (
        <div className="h-full flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto">
              <Wand2 className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium mb-2 text-sm sm:text-base">
                UGC Builder Loading...
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Opening the UGC Builder for professional content creation
              </p>
            </div>
            <Button
              onClick={() => setShowUgcBuilder(true)}
              className="bg-purple-500 hover:bg-purple-600 text-white text-sm"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Open UGC Builder
            </Button>
          </div>
        </div>
      ),
      []
    );

    // Camera Motion Panel Component
    const CameraMotionPanel = memo(() => (
      <Dialog
        open={showCameraMotionPanel}
        onOpenChange={setShowCameraMotionPanel}
      >
        <DialogContent className="max-w-full sm:max-w-7xl h-[90vh] p-0 bg-black text-white border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Choose Camera Motion</DialogTitle>
            <DialogDescription>
              Select camera motion and movement styles for your video generation
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col h-full">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 pb-4 border-b border-gray-800 gap-4">
              {/* Provider Tabs */}
              <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto w-full sm:w-auto">
                {Object.keys(
                  currentMode === "speak"
                    ? SPEAK_CAMERA_MOTIONS
                    : CAMERA_MOTIONS
                ).map((provider) => {
                  const isSelected = selectedCameraProvider === provider;
                  const providerIcons = {
                    higgsfield: "🟡",
                    veo3: "⚫",
                    minimax: "⚪",
                  };

                  return (
                    <button
                      key={provider}
                      onClick={() => setSelectedCameraProvider(provider as any)}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        isSelected
                          ? "bg-white/10 text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="text-base">
                        {providerIcons[provider as keyof typeof providerIcons]}
                      </span>
                      <span className="capitalize">{provider}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search and Close */}
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                {editingMotionIndex !== null && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 rounded-lg">
                    <Edit2 className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">
                      Editing Motion {editingMotionIndex + 1}
                    </span>
                  </div>
                )}

                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    value={cameraMotionSearch}
                    onChange={(e) => setCameraMotionSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 bg-gray-800/50 border-0 text-white placeholder:text-gray-500 focus:bg-gray-800 transition-colors"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowCameraMotionPanel(false);
                    setEditingMotionIndex(null);
                  }}
                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Category Filter - Responsive */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-800">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {CAMERA_CATEGORIES.map((category) => {
                  const isActive = selectedCameraCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCameraCategory(category.id)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? "bg-lime-400 text-black"
                          : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                      }`}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Motion Grid - Responsive */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
              <Masonry
                columnsCount={
                  window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 4
                }
                gutter="16px"
              >
                {filteredCameraMotions.map((motion) => {
                  const isSelected =
                    currentMode === "speak"
                      ? selectedSpeakCameraMotion === motion.id
                      : selectedMotions.includes(motion.id);

                  return (
                    <MotionCard
                      key={motion.id}
                      motion={motion}
                      isSelected={isSelected}
                      onClick={() => handleCameraMotionSelect(motion.id)}
                    />
                  );
                })}
              </Masonry>

              {filteredCameraMotions.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="font-medium mb-2 text-white">
                    No motions found
                  </h3>
                  <p className="text-sm text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    ));

    return (
      <>
        <div className="h-full flex flex-col sm:flex-row">
          {/* Left Sidebar - Responsive */}
          {currentMode !== "ugc" && (
            <div className="w-full sm:w-80 glass-sidebar p-4 sm:p-6 overflow-y-auto scrollbar-hide order-2 sm:order-1">
              {currentMode === "video" && renderVideoModeContent()}
              {currentMode === "speak" && renderSpeakModeContent()}

              {/* Generate Button - Responsive */}
              <div className="mt-4 sm:mt-6 space-y-4">
                <Button
                  onClick={handleGenerate}
                  disabled={
                    !canGenerate || generationState.status === "processing"
                  }
                  className="w-full h-10 sm:h-12 bg-purple-500 hover:bg-purple-600 text-white font-medium disabled:opacity-50"
                >
                  {generationState.status === "processing" ? (
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    `Generate • ${totalCredits} credits`
                  )}
                </Button>

                {generationState.status === "processing" && (
                  <div className="space-y-2">
                    <Progress
                      value={generationState.progress}
                      className="h-2"
                    />
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {PROCESSING_STEPS[generationState.currentStep]?.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {
                          PROCESSING_STEPS[generationState.currentStep]
                            ?.description
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Content Area - Responsive */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-hide order-1 sm:order-2">
            {currentMode === "ugc" ? (
              renderUgcModeContent()
            ) : generationState.status === "idle" ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
                    <Video className="w-6 sm:w-8 h-6 sm:h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2 text-sm sm:text-base">
                      Ready to generate
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {currentMode === "video" &&
                        "Add your prompt and settings to generate a video"}
                      {currentMode === "speak" &&
                        "Add your script and settings to generate speech"}
                    </p>
                  </div>
                </div>
              </div>
            ) : generationState.status === "processing" ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md px-4">
                  <LoadingSpinner />
                  <div>
                    <h3 className="font-medium mb-2">
                      {PROCESSING_STEPS[generationState.currentStep]?.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {
                        PROCESSING_STEPS[generationState.currentStep]
                          ?.description
                      }
                    </p>
                    <div className="text-xs text-muted-foreground italic">
                      💡 {GENERATION_TIPS[currentTipIndex]}
                    </div>
                  </div>
                </div>
              </div>
            ) : generationState.status === "completed" &&
              generationState.result ? (
              <div className="h-full flex items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-6">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <video
                      src={generationState.result.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="secondary"
                        className="bg-green-500/20 text-green-400"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Generated
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {generationState.result.duration} •{" "}
                        {generationState.result.resolution} •{" "}
                        {generationState.result.credits} credits
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Camera Motion Panel */}
        <CameraMotionPanel />

        {/* Hidden file input */}
        <input
          ref={startFrameRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
      </>
    );
  }
);

VideoGenerator.displayName = "VideoGenerator";
