import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import { Button } from './ui/button';

interface AudioPlayerProps {
  src: string;
  className?: string;
}

export function AudioPlayer({ src, className = '' }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioName, setAudioName] = useState('Audio File');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Extract filename from URL
    try {
      const url = new URL(src);
      const fileName = url.pathname.split('/').pop() || 'Audio File';
      const nameWithoutExtension = fileName.split('.').slice(0, -1).join('.') || fileName;
      setAudioName(nameWithoutExtension);
    } catch {
      setAudioName('Audio File');
    }

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative aspect-square bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center justify-center border border-gray-700/50 ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Music Icon Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Music className="w-16 h-16 text-white" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        {/* Audio Name */}
        <h3 className="text-white text-sm font-medium mb-3 line-clamp-2 max-w-full">
          {audioName}
        </h3>
        
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlayPause}
          variant="ghost"
          size="sm"
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 mb-3 p-0"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white ml-0.5" />
          )}
        </Button>
        
        {/* Time Display */}
        <div className="text-white/70 text-xs">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-1 mt-2">
          <div 
            className="bg-white rounded-full h-1 transition-all duration-100"
            style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
      </div>
    </div>
  );
}