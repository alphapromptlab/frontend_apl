import { useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import { motion } from 'motion/react';
import { NoiseOverlay } from './NoiseOverlay';
import { toast } from 'sonner@2.0.3';

// Import research-specific components
import { ResearchSidebar } from './research/ResearchSidebar';
import { ResearchCanvas } from './research/ResearchCanvas';
import { ResearchBottomToolbar } from './research/ResearchBottomToolbar';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  model?: string;
  tokens?: number;
  rating?: 'up' | 'down';
}

interface ChatSession {
  id: string;
  title: string;
  type: string;
  messages: Message[];
  lastActivity: Date;
}

export interface ResearchRef {
  createNewSession: () => void;
}

const Research = forwardRef<ResearchRef>((props, ref) => {
  // State management
  const [selectedType, setSelectedType] = useState('market-research');
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Market Research Q4 2024',
      type: 'market-research',
      messages: [
        {
          id: '1',
          type: 'user',
          content: 'What are the latest trends in AI marketing for Q4 2024?',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          id: '2',
          type: 'ai',
          content: 'Based on recent industry analysis, here are the key AI marketing trends for Q4 2024:\n\n1. **Hyper-Personalization at Scale**: AI is enabling brands to create individualized experiences for millions of customers simultaneously.\n\n2. **Conversational AI Integration**: Advanced chatbots and voice assistants are becoming primary customer touchpoints.\n\n3. **Predictive Content Creation**: AI tools are helping marketers generate content that predicts and meets future customer needs.\n\n4. **Real-time Sentiment Analysis**: Brands are using AI to monitor and respond to customer sentiment across all channels instantly.\n\n5. **AI-Powered Attribution Modeling**: More sophisticated tracking of customer journeys across multiple touchpoints.',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          model: 'GPT-4',
          tokens: 342,
          rating: 'up'
        }
      ],
      lastActivity: new Date(Date.now() - 1000 * 60 * 25)
    },
    {
      id: '2',
      title: 'Consumer Behavior Analysis',
      type: 'consumer-research',
      messages: [
        {
          id: '3',
          type: 'user',
          content: 'How has consumer behavior changed post-pandemic?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        {
          id: '4',
          type: 'ai',
          content: 'Post-pandemic consumer behavior has undergone significant shifts:\n\n**Digital-First Mindset**: Consumers now expect seamless digital experiences as the primary interaction method.\n\n**Value-Conscious Spending**: Increased focus on value, quality, and purpose-driven purchases.\n\n**Health & Wellness Priority**: Heightened awareness of health, safety, and wellness in purchasing decisions.\n\n**Local & Sustainable Focus**: Growing preference for local businesses and sustainable products.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          model: 'Claude-3',
          tokens: 198,
        }
      ],
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2)
    }
  ]);

  // Memoized values
  const selectedTypeLabel = useMemo(() => {
    const typeMap: Record<string, string> = {
      'market-research': 'Market Research',
      'consumer-research': 'Consumer Research',
      'competitor-analysis': 'Competitor Analysis',
      'trend-analysis': 'Trend Analysis'
    };
    return typeMap[selectedType] || 'Research';
  }, [selectedType]);

  // Auto-save function
  const autoSave = useCallback((messages: Message[], promptText: string, researchType: string) => {
    if (messages.length === 0 || !promptText.trim()) return;

    const chatTitle = promptText.length > 50 
      ? `${promptText.substring(0, 47)}...` 
      : promptText;

    const updatedSession: ChatSession = {
      id: currentChat?.id || Date.now().toString(),
      title: chatTitle,
      type: researchType,
      messages,
      lastActivity: new Date()
    };

    setSessions(prev => {
      const existingIndex = prev.findIndex(s => s.id === updatedSession.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = updatedSession;
        return updated;
      } else {
        return [updatedSession, ...prev];
      }
    });

    setCurrentChat(updatedSession);
  }, [currentChat]);

  // Event handlers
  const handleTypeSelect = useCallback((type: string) => {
    setSelectedType(type);
  }, []);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Research Chat',
      type: selectedType,
      messages: [],
      lastActivity: new Date()
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentChat(newSession);
    setPrompt('');
    
    toast.success('New research chat created', {
      description: 'Ready to assist with your research needs'
    });
  }, [selectedType]);

  useImperativeHandle(ref, () => ({
    createNewSession
  }));

  const handleChatSelect = useCallback((chatId: string) => {
    const savedChat = sessions.find(s => s.id === chatId);
    if (savedChat) {
      setCurrentChat(savedChat);
      setSelectedType(savedChat.type);
      setPrompt('');
    }
  }, [sessions]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a research question');
      return;
    }

    if (!currentChat) {
      createNewSession();
    }

    setIsGenerating(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...(currentChat?.messages || []), userMessage];
    setCurrentChat(prev => prev ? { ...prev, messages: updatedMessages } : null);
    setPrompt('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you're researching: "${userMessage.content}"\n\nLet me provide you with comprehensive research insights on this topic. Based on current data and industry analysis, here are the key findings:\n\n• **Primary Research Insight**: This area shows significant growth potential with emerging trends indicating strong market adoption.\n\n• **Data Analysis**: Recent studies suggest a 25-40% increase in related activities over the past quarter.\n\n• **Competitive Landscape**: Key players are investing heavily in this space, indicating market validation.\n\n• **Recommendations**: Consider exploring this opportunity further with targeted market testing and customer validation.\n\n**Sources**: Industry reports, market analysis, peer-reviewed studies\n\nWould you like me to dive deeper into any specific aspect of this research?`,
        timestamp: new Date(),
        model: 'GPT-4 Research',
        tokens: Math.floor(Math.random() * 300) + 150,
      };

      const finalMessages = [...updatedMessages, aiMessage];
      
      if (currentChat) {
        const finalSession = { ...currentChat, messages: finalMessages, lastActivity: new Date() };
        setCurrentChat(finalSession);
        autoSave(finalMessages, userMessage.content, selectedType);
      }
      
      toast.success('Research completed successfully!');
    } catch (error) {
      toast.error('Failed to complete research');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, currentChat, selectedType, autoSave, createNewSession]);

  const handleRateMessage = useCallback((messageId: string, rating: 'up' | 'down') => {
    if (!currentChat) return;

    const updatedMessages = currentChat.messages.map(msg =>
      msg.id === messageId ? { ...msg, rating } : msg
    );

    const updatedSession = { ...currentChat, messages: updatedMessages };
    setCurrentChat(updatedSession);
    setSessions(prev => prev.map(s => s.id === currentChat.id ? updatedSession : s));
    
    toast.success(`Feedback recorded: ${rating === 'up' ? 'Helpful' : 'Not helpful'}`);
  }, [currentChat]);

  const handleDeleteSession = useCallback((sessionId: string) => {
    if (sessions.length <= 1) {
      toast.error('Cannot delete the last session');
      return;
    }

    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (currentChat?.id === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      setCurrentChat(remainingSessions[0] || null);
    }

    toast.success('Research chat deleted');
  }, [sessions, currentChat]);

  const handleFileUpload = useCallback((file: File) => {
    toast.success(`File "${file.name}" uploaded successfully!`);
  }, []);

  const handleVoiceInput = useCallback(() => {
    toast.info('Voice input feature coming soon!');
  }, []);

  // Handle saving research to library
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

  // Get current content for saving
  const getCurrentContent = useCallback(() => {
    if (!currentChat || currentChat.messages.length === 0) {
      return '';
    }

    const chatContent = currentChat.messages
      .map(msg => {
        const timestamp = msg.timestamp.toLocaleString();
        const role = msg.type === 'user' ? 'Question' : 'Research Findings';
        return `[${timestamp}] ${role}:\n${msg.content}\n`;
      })
      .join('\n');

    return `Research Session: ${currentChat.title}\nType: ${selectedTypeLabel}\nDate: ${currentChat.lastActivity.toLocaleDateString()}\n\n${chatContent}`;
  }, [currentChat, selectedTypeLabel]);

  return (
    <div className="h-full flex bg-background overflow-hidden">
      <NoiseOverlay intensity="light" />
      
      <div className="relative z-10 h-full flex w-full">
        {/* Left Sidebar */}
        <ResearchSidebar
          selectedType={selectedType}
          onTypeSelect={handleTypeSelect}
          onNewChat={createNewSession}
          onChatSelect={handleChatSelect}
          onDeleteSession={handleDeleteSession}
          onSaveToLibrary={handleSaveToLibrary}
          savedChats={sessions}
          currentChatId={currentChat?.id || null}
          currentContent={getCurrentContent()}
        />

        {/* Main Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 pb-32">
              {/* Research Canvas */}
              <ResearchCanvas
                currentChat={currentChat}
                isGenerating={isGenerating}
                onRateMessage={handleRateMessage}
              />
            </div>

            {/* Bottom Toolbar */}
            <ResearchBottomToolbar
              prompt={prompt}
              onPromptChange={setPrompt}
              onSubmit={handleGenerate}
              isGenerating={isGenerating}
              onFileUpload={handleFileUpload}
              onVoiceInput={handleVoiceInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

Research.displayName = 'Research';

export default Research;