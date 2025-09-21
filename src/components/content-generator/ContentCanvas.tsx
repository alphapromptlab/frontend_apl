import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered, 
  Type, 
  Highlighter,
  RotateCcw,
  RefreshCw,
  Copy,
  Lightbulb
} from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { copyToClipboard } from '../../utils/clipboard';

interface ContentCanvasProps {
  content: string;
  onChange: (content: string) => void;
  isGenerating: boolean;
  onRegenerate: () => void;
  onRegenerateSection: () => void;
  onExplainOutput: () => void;
}

export function ContentCanvas({
  content,
  onChange,
  isGenerating,
  onRegenerate,
  onRegenerateSection,
  onExplainOutput
}: ContentCanvasProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  // Handle text selection for formatting
  const handleTextSelect = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end);
      setSelectedText(selected);
      setSelection({ start, end });
    }
  };

  // Format text functions
  const formatText = (format: string) => {
    if (!selectedText) return;
    
    let formattedText = selectedText;
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'bullet':
        formattedText = selectedText.split('\n').map(line => `• ${line}`).join('\n');
        break;
      case 'numbered':
        formattedText = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        break;
      case 'highlight':
        formattedText = `===${selectedText}===`;
        break;
    }

    const newContent = content.substring(0, selection.start) + formattedText + content.substring(selection.end);
    onChange(newContent);
  };

  // Handle copy to clipboard using the robust utility
  const handleCopyToClipboard = async () => {
    await copyToClipboard(content, {
      successMessage: 'Content copied to clipboard!',
      errorMessage: 'Failed to copy content. Please try selecting and copying manually.'
    });
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  return (
    <div className="space-y-4">
      {/* Content Canvas */}
      <Card className="form-container">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--form-text)]/10">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('bold')}
              disabled={!selectedText}
              className="w-8 h-8 p-0"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('italic')}
              disabled={!selectedText}
              className="w-8 h-8 p-0"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="mx-1 h-6" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('h1')}
              disabled={!selectedText}
              className="w-8 h-8 p-0"
              title="Heading 1"
            >
              <Type className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('h2')}
              disabled={!selectedText}
              className="w-8 h-8 p-0 text-xs"
              title="Heading 2"
            >
              H2
            </Button>
            
            <Separator orientation="vertical" className="mx-1 h-6" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('bullet')}
              disabled={!selectedText}
              className="w-8 h-8 p-0"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('numbered')}
              disabled={!selectedText}
              className="w-8 h-8 p-0"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="mx-1 h-6" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('highlight')}
              disabled={!selectedText}
              className="w-8 h-8 p-0"
              title="Highlight"
            >
              <Highlighter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => formatText('link')}
              disabled={!selectedText}
              className="w-8 h-8 p-0"
              title="Link"
            >
              <Link className="w-4 h-4" />
            </Button>
          </div>

          {content && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {content.split(' ').filter(word => word.length > 0).length} words
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {content.length} characters
              </Badge>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="p-4">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            onSelect={handleTextSelect}
            placeholder="Start generating content or edit here..."
            className="form-input min-h-[400px] resize-none text-base leading-relaxed"
            disabled={isGenerating}
          />
          
          {isGenerating && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Generating content...</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {content && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-t border-[var(--form-text)]/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRegenerate}
                  className="gap-2 form-button"
                >
                  <RotateCcw className="w-4 h-4" />
                  Generate Again
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRegenerateSection}
                  className="gap-2 form-button"
                  disabled={!selectedText}
                >
                  <RefreshCw className="w-4 h-4" />
                  Regenerate Section
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExplainOutput}
                  className="gap-2 form-button"
                >
                  <Lightbulb className="w-4 h-4" />
                  Explain This Output
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyToClipboard}
                  className="gap-2 form-button"
                  disabled={!content}
                >
                  <Copy className="w-4 h-4" />
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}