import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause,
  Download, 
  Settings,
  History,
  Volume2,
  MoreHorizontal,
  RotateCcw,
  Send,
  Waveform,
  User,
  MessageSquare,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

// Types
interface AudioSettings {
  voice: string;
  speed: number;
  stability: number;
  similarity: number;
  styleExaggeration: number;
  speakerBoost: boolean;
}

interface SoundEffectsSettings {
  duration: number;
  autoDuration: boolean;
  promptInfluence: number;
}

type AudioMode = 'speech' | 'soundeffects';

interface GeneratedAudio {
  id: string;
  text: string;
  settings: AudioSettings | SoundEffectsSettings;
  timestamp: Date;
  duration: string;
  status: 'generating' | 'completed' | 'failed';
  audioUrl?: string;
  mode: AudioMode;
}

interface AudioGeneratorProps {
  currentMode?: AudioMode;
  onModeChange?: (mode: AudioMode) => void;
}

// Default settings
const defaultSpeechSettings: AudioSettings = {
  voice: 'Rachel',
  speed: 50,
  stability: 75,
  similarity: 75,
  styleExaggeration: 0,
  speakerBoost: false
};

const defaultSoundEffectsSettings: SoundEffectsSettings = {
  duration: 0,
  autoDuration: true,
  promptInfluence: 50
};

// Mock data
const mockHistory: GeneratedAudio[] = [
  {
    id: '1',
    text: 'Hello, this is a testing prompt for audio generation.',
    settings: { ...defaultSpeechSettings },
    timestamp: new Date(Date.now() - 60000),
    duration: '0:03',
    status: 'completed',
    audioUrl: 'mock-url-1',
    mode: 'speech'
  },
  {
    id: '2', 
    text: 'Welcome to Alpha Prompt Lab, your comprehensive AI tools dashboard.',
    settings: { ...defaultSpeechSettings, voice: 'Ross', speed: 60 },
    timestamp: new Date(Date.now() - 300000),
    duration: '0:05',
    status: 'completed',
    audioUrl: 'mock-url-2',
    mode: 'speech'
  },
  {
    id: '3',
    text: 'Thunderstorm with heavy rain and lightning strikes',
    settings: { ...defaultSoundEffectsSettings, duration: 15, autoDuration: false, promptInfluence: 75 },
    timestamp: new Date(Date.now() - 900000),
    duration: '0:15',
    status: 'completed',
    audioUrl: 'mock-url-3',
    mode: 'soundeffects'
  }
];

const voiceOptions = [
  { value: 'Rachel', label: 'Rachel', gender: 'female' },
  { value: 'Ross', label: 'Ross', gender: 'male' },
  { value: 'Joey', label: 'Joey', gender: 'male' },
  { value: 'Abhinav', label: 'Abhinav', gender: 'male' },
  { value: 'Rahul', label: 'Rahul', gender: 'male' },
  { value: 'Pooja', label: 'Pooja', gender: 'female' },
  { value: 'Anjali', label: 'Anjali', gender: 'female' },
  { value: 'Isha', label: 'Isha', gender: 'female' }
];

// Speech Settings Panel Component
const SpeechSettingsPanel: React.FC<{
  settings: AudioSettings;
  onSettingsChange: (settings: AudioSettings) => void;
  onReset: () => void;
}> = ({ settings, onSettingsChange, onReset }) => {
  const handleVoiceChange = useCallback((voice: string) => {
    onSettingsChange({ ...settings, voice });
  }, [settings, onSettingsChange]);

  const handleSliderChange = useCallback((key: keyof AudioSettings, value: number[]) => {
    onSettingsChange({ ...settings, [key]: value[0] });
  }, [settings, onSettingsChange]);

  const handleSwitchChange = useCallback((speakerBoost: boolean) => {
    onSettingsChange({ ...settings, speakerBoost });
  }, [settings, onSettingsChange]);

  return (
    <div className="pb-6 space-y-6">
      {/* Voice Selection */}
      <div className="space-y-3">
        <label className="block font-medium text-foreground">Voice</label>
        <Select value={settings.voice} onValueChange={handleVoiceChange}>
          <SelectTrigger className="bg-[var(--form-input-bg)] border-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[var(--solid-popup-bg)] border-0 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
            {voiceOptions.map((voice) => (
              <SelectItem key={voice.value} value={voice.value} className="hover:bg-[var(--solid-popup-hover)]">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${voice.gender === 'female' ? 'bg-purple-500' : 'bg-blue-500'}`} />
                  {voice.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Speed */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-medium text-foreground">Speed</label>
          <span className="text-xs text-muted-foreground">{settings.speed}%</span>
        </div>
        <div className="space-y-2">
          <Slider
            value={[settings.speed]}
            onValueChange={(value) => handleSliderChange('speed', value)}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slower</span>
            <span>Faster</span>
          </div>
        </div>
      </div>

      {/* Stability */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-medium text-foreground">Stability</label>
          <span className="text-xs text-muted-foreground">{settings.stability}%</span>
        </div>
        <div className="space-y-2">
          <Slider
            value={[settings.stability]}
            onValueChange={(value) => handleSliderChange('stability', value)}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>More variable</span>
            <span>More stable</span>
          </div>
        </div>
      </div>

      {/* Similarity */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-medium text-foreground">Similarity</label>
          <span className="text-xs text-muted-foreground">{settings.similarity}%</span>
        </div>
        <div className="space-y-2">
          <Slider
            value={[settings.similarity]}
            onValueChange={(value) => handleSliderChange('similarity', value)}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Style Exaggeration */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-medium text-foreground">Style Exaggeration</label>
          <span className="text-xs text-muted-foreground">{settings.styleExaggeration}%</span>
        </div>
        <div className="space-y-2">
          <Slider
            value={[settings.styleExaggeration]}
            onValueChange={(value) => handleSliderChange('styleExaggeration', value)}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>None</span>
            <span>Exaggerated</span>
          </div>
        </div>
      </div>

      {/* Speaker Boost */}
      <div className="flex items-center justify-between">
        <label className="font-medium text-foreground">Speaker Boost</label>
        <Switch
          checked={settings.speakerBoost}
          onCheckedChange={handleSwitchChange}
        />
      </div>

      {/* Reset Button */}
      <Button 
        onClick={onReset}
        variant="outline"
        className="w-full bg-[var(--form-input-bg)] hover:bg-[var(--form-hover-bg)] border-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Values
      </Button>
    </div>
  );
};

// Sound Effects Settings Panel Component
const SoundEffectsSettingsPanel: React.FC<{
  settings: SoundEffectsSettings;
  onSettingsChange: (settings: SoundEffectsSettings) => void;
  onReset: () => void;
}> = ({ settings, onSettingsChange, onReset }) => {
  const handleSliderChange = useCallback((key: keyof SoundEffectsSettings, value: number[]) => {
    const newValue = value[0];
    let newSettings = { ...settings, [key]: newValue };
    
    // Auto-enable autoDuration when duration is set to 0
    if (key === 'duration' && newValue === 0) {
      newSettings.autoDuration = true;
    }
    
    onSettingsChange(newSettings);
  }, [settings, onSettingsChange]);

  const handleSwitchChange = useCallback((autoDuration: boolean) => {
    onSettingsChange({ ...settings, autoDuration });
  }, [settings, onSettingsChange]);

  return (
    <div className="pb-6 space-y-6">
      {/* Duration */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-medium text-foreground">Duration</label>
          <span className="text-xs text-muted-foreground">
            {settings.duration === 0 ? 'Auto' : `${settings.duration}s`}
          </span>
        </div>
        <div className="space-y-2">
          <Slider
            value={[settings.duration]}
            onValueChange={(value) => handleSliderChange('duration', value)}
            max={22}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Auto</span>
            <span>22s</span>
          </div>
        </div>
      </div>

      {/* Auto Duration Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <label className="font-medium text-foreground">Auto Duration</label>
          <span className="text-xs text-muted-foreground">
            Automatically set duration based on prompt
          </span>
        </div>
        <Switch
          checked={settings.autoDuration}
          onCheckedChange={handleSwitchChange}
          disabled={settings.duration === 0}
        />
      </div>

      {/* Prompt Influence */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-medium text-foreground">Prompt Influence</label>
          <span className="text-xs text-muted-foreground">{settings.promptInfluence}%</span>
        </div>
        <div className="space-y-2">
          <Slider
            value={[settings.promptInfluence]}
            onValueChange={(value) => handleSliderChange('promptInfluence', value)}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <Button 
        onClick={onReset}
        variant="outline"
        className="w-full bg-[var(--form-input-bg)] hover:bg-[var(--form-hover-bg)] border-0 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset Values
      </Button>
    </div>
  );
};

// History Panel Component
const HistoryPanel: React.FC<{
  history: GeneratedAudio[];
  onPlay: (audio: GeneratedAudio) => void;
  onDownload: (audio: GeneratedAudio) => void;
  onShowDetails: (audio: GeneratedAudio) => void;
}> = ({ history, onPlay, onDownload, onShowDetails }) => {
  return (
    <div className="pb-6">
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Volume2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No audio generated yet</p>
            <p className="text-xs mt-1">Your generated audio will appear here</p>
          </div>
        ) : (
          history.map((audio) => (
            <motion.div
              key={audio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--solid-card-bg)] rounded-lg p-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  audio.status === 'completed' ? 'bg-green-500' : 
                  audio.status === 'generating' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                    {audio.text}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {audio.mode === 'speech' ? (audio.settings as AudioSettings).voice : audio.mode === 'soundeffects' ? 'Sound FX' : 'Unknown'}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${audio.mode === 'speech' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'} dark:bg-opacity-20 dark:border-opacity-30`}>
                      {audio.mode === 'speech' ? 'Speech' : 'Sound Effects'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {audio.timestamp.toLocaleTimeString()} • {audio.duration}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => onPlay(audio)}
                      className="bg-purple-600 hover:bg-purple-700 text-white h-8 px-3"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDownload(audio)}
                      className="bg-[var(--form-input-bg)] hover:bg-[var(--form-hover-bg)] border-0 h-8 px-3"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onShowDetails(audio)}
                      className="bg-[var(--form-input-bg)] hover:bg-[var(--form-hover-bg)] border-0 h-8 px-3"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

// Audio Details Dialog
const AudioDetailsDialog: React.FC<{
  audio: GeneratedAudio | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ audio, isOpen, onClose }) => {
  if (!audio) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[var(--solid-popup-bg)] border-0 shadow-[0_12px_24px_rgba(0,0,0,0.6)]">
        <DialogTitle>Audio Details</DialogTitle>
        <DialogDescription className="sr-only">
          View detailed information about the generated audio including settings and parameters
        </DialogDescription>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Text</h4>
            <p className="text-sm text-muted-foreground bg-[var(--form-input-bg)] rounded-lg p-3">
              {audio.text}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-foreground mb-1">Mode</h4>
              <p className="text-sm text-muted-foreground capitalize">{audio.mode === 'soundeffects' ? 'Sound Effects' : audio.mode}</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Duration</h4>
              <p className="text-sm text-muted-foreground">{audio.duration}</p>
            </div>
            
            {audio.mode === 'speech' ? (
              <>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Voice</h4>
                  <p className="text-sm text-muted-foreground">{(audio.settings as AudioSettings).voice}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Speed</h4>
                  <p className="text-sm text-muted-foreground">{(audio.settings as AudioSettings).speed}%</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Stability</h4>
                  <p className="text-sm text-muted-foreground">{(audio.settings as AudioSettings).stability}%</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Similarity</h4>
                  <p className="text-sm text-muted-foreground">{(audio.settings as AudioSettings).similarity}%</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Duration Setting</h4>
                  <p className="text-sm text-muted-foreground">
                    {(audio.settings as SoundEffectsSettings).duration === 0 ? 'Auto' : `${(audio.settings as SoundEffectsSettings).duration}s`}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Auto Duration</h4>
                  <p className="text-sm text-muted-foreground">
                    {(audio.settings as SoundEffectsSettings).autoDuration ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Prompt Influence</h4>
                  <p className="text-sm text-muted-foreground">{(audio.settings as SoundEffectsSettings).promptInfluence}%</p>
                </div>
                <div></div>
              </>
            )}
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-1">Generated</h4>
            <p className="text-sm text-muted-foreground">
              {audio.timestamp.toLocaleString()}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Bottom Audio Player
const BottomAudioPlayer: React.FC<{
  currentAudio: GeneratedAudio | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onDownload: () => void;
}> = ({ currentAudio, isPlaying, onPlayPause, onDownload }) => {
  if (!currentAudio) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-[var(--solid-header-bg)] border-0 shadow-[0_-2px_8px_rgba(0,0,0,0.3)] z-50"
    >
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <Button
            size="sm"
            onClick={onPlayPause}
            className="bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full p-0 flex-shrink-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          {/* Audio Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate text-sm">
              {currentAudio.text}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{currentAudio.mode === 'speech' ? (currentAudio.settings as AudioSettings).voice : 'Sound FX'}</span>
              <span>•</span>
              <span>{currentAudio.mode === 'speech' ? 'Speech' : 'Sound Effects'}</span>
              <span>•</span>
              <span>{currentAudio.timestamp.toLocaleTimeString()}</span>
              <span>•</span>
              <span>{currentAudio.duration}</span>
            </div>
          </div>

          {/* Waveform Placeholder */}
          <div className="hidden md:flex items-center gap-1 mx-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-purple-400 rounded-full transition-all duration-200 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{
                  height: `${Math.random() * 20 + 8}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* Download Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={onDownload}
            className="bg-[var(--form-input-bg)] hover:bg-[var(--form-hover-bg)] border-0 w-10 h-10 rounded-full p-0 flex-shrink-0"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export const AudioGenerator: React.FC<AudioGeneratorProps> = ({ 
  currentMode = 'speech', 
  onModeChange 
}) => {
  const [speechSettings, setSpeechSettings] = useState<AudioSettings>(defaultSpeechSettings);
  const [soundEffectsSettings, setSoundEffectsSettings] = useState<SoundEffectsSettings>(defaultSoundEffectsSettings);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedAudio[]>(mockHistory);
  const [currentAudio, setCurrentAudio] = useState<GeneratedAudio | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<GeneratedAudio | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const currentSettings = currentMode === 'speech' ? speechSettings : soundEffectsSettings;

  const handleSpeechSettingsChange = useCallback((newSettings: AudioSettings) => {
    setSpeechSettings(newSettings);
  }, []);

  const handleSoundEffectsSettingsChange = useCallback((newSettings: SoundEffectsSettings) => {
    setSoundEffectsSettings(newSettings);
  }, []);

  const handleSpeechReset = useCallback(() => {
    setSpeechSettings(defaultSpeechSettings);
    toast.success('Speech settings reset to default values');
  }, []);

  const handleSoundEffectsReset = useCallback(() => {
    setSoundEffectsSettings(defaultSoundEffectsSettings);
    toast.success('Sound effects settings reset to default values');
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!inputText.trim()) {
      toast.error(`Please enter some text to generate ${currentMode === 'speech' ? 'speech' : 'sound effects'}`);
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate duration based on mode
      let calculatedDuration;
      if (currentMode === 'speech') {
        calculatedDuration = '0:' + Math.floor(Math.random() * 50 + 10).toString().padStart(2, '0');
      } else {
        const settings = soundEffectsSettings;
        if (settings.autoDuration || settings.duration === 0) {
          calculatedDuration = '0:' + Math.floor(Math.random() * 20 + 5).toString().padStart(2, '0');
        } else {
          calculatedDuration = '0:' + settings.duration.toString().padStart(2, '0');
        }
      }
      
      const newAudio: GeneratedAudio = {
        id: Date.now().toString(),
        text: inputText,
        settings: currentMode === 'speech' ? { ...speechSettings } : { ...soundEffectsSettings },
        timestamp: new Date(),
        duration: calculatedDuration,
        status: 'completed',
        audioUrl: `mock-url-${Date.now()}`,
        mode: currentMode
      };

      setHistory(prev => [newAudio, ...prev]);
      setCurrentAudio(newAudio);
      toast.success(`${currentMode === 'speech' ? 'Speech' : 'Sound effects'} generated successfully!`);
      setInputText('');
    } catch (error) {
      toast.error(`Failed to generate ${currentMode === 'speech' ? 'speech' : 'sound effects'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [inputText, currentMode, speechSettings, soundEffectsSettings]);

  const handlePlay = useCallback((audio: GeneratedAudio) => {
    setCurrentAudio(audio);
    setIsPlaying(true);
    const description = audio.mode === 'speech' 
      ? `${(audio.settings as AudioSettings).voice} voice` 
      : 'sound effects';
    toast.success(`Playing: ${description}`);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleDownload = useCallback((audio: GeneratedAudio) => {
    toast.success(`Downloading: ${audio.text.substring(0, 30)}...`);
  }, []);

  const handleShowDetails = useCallback((audio: GeneratedAudio) => {
    setSelectedAudio(audio);
    setIsDetailsDialogOpen(true);
  }, []);

  const handleDownloadCurrent = useCallback(() => {
    if (currentAudio) {
      handleDownload(currentAudio);
    }
  }, [currentAudio, handleDownload]);

  const characterCount = inputText.length;
  const characterLimit = 2500;

  return (
    <div className="h-full flex flex-col bg-background text-foreground">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 glass-sidebar flex flex-col">
          <Tabs defaultValue="settings" className="h-full flex flex-col">
            <div className="p-4">
              <TabsList className="grid w-full grid-cols-2 bg-[var(--form-input-bg)] rounded-lg">
                <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm">
                  <History className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="settings" className="flex-1 overflow-y-auto scrollbar-hide m-0 px-4">
              {currentMode === 'speech' ? (
                <SpeechSettingsPanel
                  settings={speechSettings}
                  onSettingsChange={handleSpeechSettingsChange}
                  onReset={handleSpeechReset}
                />
              ) : (
                <SoundEffectsSettingsPanel
                  settings={soundEffectsSettings}
                  onSettingsChange={handleSoundEffectsSettingsChange}
                  onReset={handleSoundEffectsReset}
                />
              )}
            </TabsContent>
            
            <TabsContent value="history" className="flex-1 overflow-y-auto scrollbar-hide m-0 px-4">
              <HistoryPanel
                history={history}
                onPlay={handlePlay}
                onDownload={handleDownload}
                onShowDetails={handleShowDetails}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-6">
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">


            {/* Text Input */}
            <div className="flex-1 flex flex-col mt-8">
              <label className="block font-medium text-foreground mb-3">
                {currentMode === 'speech' ? 'Enter your text' : 'Describe the sound effect you want'}
              </label>
              
              <div className="flex-1 flex flex-col">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    currentMode === 'speech' 
                      ? "Start typing here or paste any text you want to turn into lifelike speech..."
                      : "Describe the sound effect you want to create, e.g., 'Thunderstorm with heavy rain', 'Birds chirping in a forest', 'Ocean waves crashing'..."
                  }
                  className="flex-1 min-h-[200px] bg-[var(--form-input-bg)] border-0 rounded-lg p-4 resize-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] focus:shadow-[0_4px_8px_rgba(0,0,0,0.2)] transition-all duration-200"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {characterCount} / {characterLimit} characters
                    </span>
                    {characterCount > 0 && (
                      <span>
                        ~{Math.ceil(characterCount / 150)} credits
                      </span>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleGenerate}
                    disabled={!inputText.trim() || isGenerating || characterCount > characterLimit}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {currentMode === 'speech' ? 'Generate Speech' : 'Generate Sound Effect'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Audio Player */}
      <AnimatePresence>
        {currentAudio && (
          <BottomAudioPlayer
            currentAudio={currentAudio}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onDownload={handleDownloadCurrent}
          />
        )}
      </AnimatePresence>

      {/* Audio Details Dialog */}
      <AudioDetailsDialog
        audio={selectedAudio}
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedAudio(null);
        }}
      />

      {/* Bottom padding when player is visible */}
      {currentAudio && <div className="h-20" />}
    </div>
  );
};

export default AudioGenerator;