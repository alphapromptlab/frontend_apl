import { Copy, Download, FileText } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface GeneratedOutputProps {
  generatedContent: string;
  isGenerating: boolean;
  onCopyToClipboard: () => void;
}

export function GeneratedOutput({
  generatedContent,
  isGenerating,
  onCopyToClipboard
}: GeneratedOutputProps) {
  return (
    <Card className="glass-card border-0 p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
      {/* Floating orb effects */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-25 transition-all duration-1000 transform group-hover:scale-125 group-hover:translate-x-2 group-hover:-translate-y-2" />
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition-all duration-900 transform group-hover:scale-110 group-hover:-translate-x-1 group-hover:translate-y-1" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Generated Content</h2>
        {generatedContent && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyToClipboard}
              className="glass-card border-0 bg-black/40 border border-white/20 hover:bg-white/10 text-white transition-all duration-300 hover:scale-105"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="glass-card border-0 bg-black/40 border border-white/20 hover:bg-white/10 text-white transition-all duration-300 hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      <div className="glass-card rounded-xl p-6 bg-black/40 border border-white/20 min-h-[450px] relative z-10">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-t-purple-500/50 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">Generating your content...</p>
                <p className="text-muted-foreground text-sm">This may take a few moments</p>
              </div>
            </div>
          </div>
        ) : generatedContent ? (
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-white/90">
              {generatedContent}
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-6">
              <div className="relative">
                <FileText className="w-20 h-20 text-muted-foreground mx-auto opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="space-y-2">
                <p className="text-white font-medium">Ready to generate content</p>
                <p className="text-muted-foreground text-sm">
                  Your AI-generated content will appear here
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}