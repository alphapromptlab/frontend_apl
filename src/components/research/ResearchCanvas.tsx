import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Brain,
  User,
  MessageSquare
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

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
  settings: any;
}

interface ResearchCanvasProps {
  currentChat: ChatSession | null;
  isGenerating: boolean;
  onRateMessage: (messageId: string, rating: 'up' | 'down') => void;
}

export function ResearchCanvas({
  currentChat,
  isGenerating,
  onRateMessage
}: ResearchCanvasProps) {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!currentChat && !isGenerating) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-0 p-6">
        <div className="text-center max-w-md w-full">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-medium mb-2 text-[var(--form-text)]">Start Your Research</h2>
          <p className="text-muted-foreground leading-relaxed">
            Ask AI to help with research, analysis, and insights. Select a research type and start asking questions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Chat Header */}
      {currentChat && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pb-6 border-b border-white/10"
        >
          <h1 className="text-2xl font-semibold mb-2">{currentChat.title}</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{currentChat.messages.length} messages</span>
            <span>•</span>
            <span>{formatTimestamp(currentChat.lastActivity)}</span>
            <span>•</span>
            <span className="capitalize">{currentChat.type.replace('-', ' ')}</span>
          </div>
        </motion.div>
      )}

      {/* Messages */}
      <AnimatePresence initial={false}>
        {currentChat?.messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.type === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-[70%] ${msg.type === 'user' ? 'order-first' : ''}`}>
              <Card className={`p-4 glass-card ${
                msg.type === 'user' 
                  ? 'bg-blue-500/20 glass-strong' 
                  : ''
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {msg.content}
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatTimestamp(msg.timestamp)}</span>
                    {msg.model && (
                      <>
                        <span>•</span>
                        <span>{msg.model}</span>
                      </>
                    )}
                    {msg.tokens && (
                      <>
                        <span>•</span>
                        <span>{msg.tokens} tokens</span>
                      </>
                    )}
                  </div>
                  
                  {msg.type === 'ai' && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(msg.content)}
                        className="sidebar-button w-6 h-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRateMessage(msg.id, 'up')}
                        className={`sidebar-button w-6 h-6 p-0 ${
                          msg.rating === 'up' ? 'text-green-400' : ''
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRateMessage(msg.id, 'down')}
                        className={`sidebar-button w-6 h-6 p-0 ${
                          msg.rating === 'down' ? 'text-red-400' : ''
                        }`}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
            
            {msg.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loading State */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <Card className="glass-card p-4 max-w-[70%]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <span className="text-sm text-muted-foreground ml-2">Researching...</span>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}