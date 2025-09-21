import { RefreshCw, Wand2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

interface PromptInputProps {
  prompt: string;
  setPrompt: (value: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function PromptInput({
  prompt,
  setPrompt,
  isGenerating,
  onGenerate
}: PromptInputProps) {
  return (
    <Card className="glass-card border-0 p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
      {/* Floating orb effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-all duration-1000 transform group-hover:scale-125 group-hover:translate-x-2 group-hover:-translate-y-2" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-blue-500/15 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition-all duration-900 transform group-hover:scale-110 group-hover:-translate-x-1 group-hover:translate-y-1" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <h2 className="text-lg font-semibold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent relative z-10">Your Prompt</h2>
      <Textarea
        placeholder="Describe what you want to create... Be specific about your topic, target audience, and key points to include."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[140px] glass-card border-0 bg-black/40 border border-white/20 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-white placeholder:text-white/50 resize-none relative z-10"
      />
      <div className="flex justify-between items-center mt-6 relative z-10">
        <span className="text-sm text-muted-foreground">
          {prompt.length}/1000 characters
        </span>
        <Button
          onClick={onGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="glass-card border-0 bg-gradient-to-r from-blue-500/30 to-purple-600/20 border border-blue-400/60 hover:from-blue-500/40 hover:to-purple-600/30 text-white transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}