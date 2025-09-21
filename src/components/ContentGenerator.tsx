import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { ContentSidebar } from './content-generator/ContentSidebar';
import { ContentSettingsPanel } from './content-generator/ContentSettingsPanel';
import { ContentCanvas } from './content-generator/ContentCanvas';
import { BottomToolbar } from './content-generator/BottomToolbar';
import { generateMockContent } from './content-generator/constants';
import { toast } from 'sonner@2.0.3';

interface ContentSettings {
  tone: string;
  language: string;
  wordCount: number;
  creativity: number;
  seoMode: boolean;
  grammarCheck: boolean;
  keywords: string;
  targetAudience: string;
}

interface AdvancedSettings {
  includeOutline: boolean;
  includeReferences: boolean;
  multipleVariations: boolean;
  variationCount: number;
  focusKeyword: string;
  excludeWords: string;
}

interface GeneratedContent {
  id: string;
  content: string;
  prompt: string;
  type: string;
  timestamp: string;
  settings: ContentSettings;
}

export function ContentGenerator() {
  // State management
  const [selectedType, setSelectedType] = useState('blog-post');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationHistory, setGenerationHistory] = useState<GeneratedContent[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Content settings
  const [settings, setSettings] = useState<ContentSettings>({
    tone: 'professional',
    language: 'en',
    wordCount: 500,
    creativity: 70,
    seoMode: false,
    grammarCheck: true,
    keywords: '',
    targetAudience: ''
  });

  // Advanced settings
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    includeOutline: false,
    includeReferences: false,
    multipleVariations: false,
    variationCount: 2,
    focusKeyword: '',
    excludeWords: ''
  });

  // Memoized values
  const selectedTypeLabel = useMemo(() => {
    const typeMap: Record<string, string> = {
      'blog-post': 'Blog Post',
      'social-caption': 'Social Caption',
      'email-copy': 'Email Copy',
      'product-description': 'Product Description',
      'ad-copy': 'Ad Copy',
      'video-script': 'Video Script'
    };
    return typeMap[selectedType] || 'Content';
  }, [selectedType]);

  // Auto-save function
  const autoSave = useCallback((content: string, promptText: string, contentType: string) => {
    if (!content.trim() || !promptText.trim()) return;

    const chatTitle = promptText.length > 50 
      ? `${promptText.substring(0, 47)}...` 
      : promptText;

    const newGeneration: GeneratedContent = {
      id: currentChatId || Date.now().toString(),
      content,
      prompt: promptText,
      type: contentType,
      timestamp: new Date().toISOString(),
      settings: { ...settings }
    };

    setGenerationHistory(prev => {
      // If updating existing chat, replace it; otherwise add new one
      const existingIndex = prev.findIndex(item => item.id === newGeneration.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newGeneration;
        return updated;
      } else {
        return [newGeneration, ...prev];
      }
    });

    setCurrentChatId(newGeneration.id);
  }, [currentChatId, settings]);

  // Auto-save when content changes (debounced)
  useEffect(() => {
    if (!currentContent.trim() || !prompt.trim()) return;

    const timeoutId = setTimeout(() => {
      autoSave(currentContent, prompt, selectedType);
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [currentContent, prompt, selectedType, autoSave]);

  // Event handlers
  const handleTypeSelect = useCallback((type: string) => {
    setSelectedType(type);
    // Adjust default word count based on type
    const wordCountMap: Record<string, number> = {
      'blog-post': 1500,
      'social-caption': 100,
      'email-copy': 300,
      'product-description': 200,
      'ad-copy': 150,
      'video-script': 500
    };
    setSettings(prev => ({
      ...prev,
      wordCount: wordCountMap[type] || 500
    }));
  }, []);

  const handleNewChat = useCallback(() => {
    setCurrentContent('');
    setPrompt('');
    setCurrentChatId(null);
    toast.success('New chat started');
  }, []);

  const handleChatSelect = useCallback((chatId: string) => {
    const savedChat = generationHistory.find(item => item.id === chatId);
    if (savedChat) {
      setCurrentContent(savedChat.content);
      setPrompt(savedChat.prompt);
      setSelectedType(savedChat.type);
      setSettings(savedChat.settings);
      setCurrentChatId(chatId);
    }
  }, [generationHistory]);

  const handleDeleteChat = useCallback((chatId: string) => {
    if (generationHistory.length <= 1) {
      toast.error('Cannot delete the last chat');
      return;
    }

    setGenerationHistory(prev => prev.filter(chat => chat.id !== chatId));
    
    if (currentChatId === chatId) {
      const remainingChats = generationHistory.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        handleChatSelect(remainingChats[0].id);
      } else {
        setCurrentContent('');
        setPrompt('');
        setCurrentChatId(null);
      }
    }

    toast.success('Chat deleted successfully');
  }, [generationHistory, currentChatId, handleChatSelect]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedContent = generateMockContent(selectedType, prompt, settings);
      setCurrentContent(generatedContent);
      
      // Auto-save immediately after generation
      autoSave(generatedContent, prompt, selectedType);
      
      toast.success('Content generated and saved automatically!');
    } catch (error) {
      toast.error('Failed to generate content');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedType, settings, autoSave]);

  const handleRegenerate = useCallback(() => {
    if (currentContent) {
      handleGenerate();
    }
  }, [currentContent, handleGenerate]);

  const handleRegenerateSection = useCallback(() => {
    toast.info('Section regeneration feature coming soon!');
  }, []);

  const handleExplainOutput = useCallback(() => {
    toast.info('Output explanation feature coming soon!');
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    toast.success(`File "${file.name}" uploaded successfully!`);
  }, []);

  const handleVoiceInput = useCallback(() => {
    toast.info('Voice input feature coming soon!');
  }, []);

  // Handle saving content to library
  const handleSaveToLibrary = useCallback((content: string, filename: string) => {
    // Create a text file and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  // Handle content changes with auto-save indicator
  const handleContentChange = useCallback((newContent: string) => {
    setCurrentContent(newContent);
  }, []);

  return (
    <div className="h-full flex bg-background overflow-hidden">
      {/* Left Sidebar */}
      <ContentSidebar
        selectedType={selectedType}
        onTypeSelect={handleTypeSelect}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        onDeleteChat={handleDeleteChat}
        onSaveToLibrary={handleSaveToLibrary}
        savedChats={generationHistory}
        currentChatId={currentChatId}
        currentContent={currentContent}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 pb-32">
            {/* Settings Panel */}
            <ContentSettingsPanel
              isOpen={isSettingsOpen}
              onToggle={() => setIsSettingsOpen(!isSettingsOpen)}
              settings={settings}
              onSettingsChange={setSettings}
              advancedSettings={advancedSettings}
              onAdvancedSettingsChange={setAdvancedSettings}
            />

            {/* Content Canvas */}
            <ContentCanvas
              content={currentContent}
              onChange={handleContentChange}
              isGenerating={isGenerating}
              onRegenerate={handleRegenerate}
              onRegenerateSection={handleRegenerateSection}
              onExplainOutput={handleExplainOutput}
            />


          </div>

          {/* Bottom Toolbar */}
          <BottomToolbar
            prompt={prompt}
            onPromptChange={setPrompt}
            onSubmit={handleGenerate}
            isGenerating={isGenerating}
            onFileUpload={handleFileUpload}
            onVoiceInput={handleVoiceInput}
            onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
            isSettingsOpen={isSettingsOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default ContentGenerator;