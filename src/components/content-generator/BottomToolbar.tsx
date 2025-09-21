import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Send,
  Settings,
  FileText,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface AttachedFile {
  id: string;
  name: string;
  type: 'brand-guide' | 'brief' | 'document';
  size: string;
}



interface BottomToolbarProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  onFileUpload: (file: File) => void;
  onVoiceInput: () => void;
  onToggleSettings: () => void;
  isSettingsOpen: boolean;
}

export function BottomToolbar({
  prompt,
  onPromptChange,
  onSubmit,
  isGenerating,
  onFileUpload,
  onVoiceInput,
  onToggleSettings,
  isSettingsOpen
}: BottomToolbarProps) {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) {
        onSubmit();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newFile: AttachedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.name.includes('brand') ? 'brand-guide' : 
              file.name.includes('brief') ? 'brief' : 'document',
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      setAttachedFiles(prev => [...prev, newFile]);
      onFileUpload(file);
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };





  return (
    <div className="fixed bottom-0 left-[250px] right-0 bg-[var(--form-bg)] p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.15)] z-10">


      {/* Attached Files */}
      {attachedFiles.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-[var(--form-input-bg)] rounded-lg p-2 shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <div className="text-sm">
                  <span className="font-medium">{file.name}</span>
                  <span className="text-muted-foreground ml-2">{file.size}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="w-6 h-6 p-0 hover:bg-red-500/10 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Main Toolbar */}
      <div className="flex items-end gap-3">
        {/* Prompt Input */}
        <div className="flex-1">
          <Textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want written (e.g. Write an Instagram caption for my new coffee product)"
            className="form-input resize-none min-h-[60px] max-h-[200px]"
            disabled={isGenerating}
            rows={2}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Settings Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSettings}
            className={`w-10 h-10 p-0 form-button transition-all ${
              isSettingsOpen ? 'bg-blue-500/10 text-blue-500' : ''
            }`}
            title="Toggle Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Send Button */}
          <Button
            onClick={onSubmit}
            disabled={!prompt.trim() || isGenerating}
            className="w-12 h-10 p-0 bg-blue-500 hover:bg-blue-600 text-white shadow-[0_2px_6px_rgba(59,130,246,0.3)]"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>


    </div>
  );
}