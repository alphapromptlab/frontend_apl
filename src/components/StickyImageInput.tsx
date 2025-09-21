import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, Sliders, Zap } from "lucide-react";

interface StickyImageInputProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function StickyImageInput({
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating
}: StickyImageInputProps) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      {/* Chat-style floating container */}
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          damping: 25,
          stiffness: 300
        }}
        className="pointer-events-auto relative"
      >
        {/* Chat box shadow */}
        <div className="absolute inset-0 bg-black/40 blur-2xl rounded-2xl scale-105"></div>
        
        {/* Main chat input box */}
        <div className="relative bg-black/95 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl min-w-[600px] max-w-4xl">
          {/* Subtle top highlight */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          {/* Content container */}
          <div className="relative z-10 p-4">
            <div className="flex items-center gap-3">
              {/* Input field */}
              <div className="flex-1 relative">
                <Input
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  placeholder="What will you imagine?"
                  className="h-10 bg-gray-900/90 border-gray-700/50 hover:border-gray-600/70 focus:border-purple-500/60 text-white placeholder-gray-400 pr-20 transition-all duration-200 rounded-lg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && prompt.trim()) {
                      e.preventDefault();
                      onGenerate();
                    }
                  }}
                />
                
                {/* Character indicator */}
                {prompt.length > 0 && (
                  <div className="absolute right-16 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                    {prompt.length}
                  </div>
                )}
              </div>
              
              {/* Settings button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 bg-gray-800/80 hover:bg-gray-700/90 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-200 rounded-lg"
              >
                <Sliders className="w-4 h-4 text-gray-300" />
              </Button>
              
              {/* Send button */}
              <Button
                onClick={onGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="h-10 w-10 p-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 text-white border-0 transition-all duration-200 disabled:opacity-50 rounded-lg"
              >
                {isGenerating ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}