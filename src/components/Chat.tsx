import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Paperclip, Mic, Square, MessageSquare, Sparkles, Brain, Search, Settings, History, Download, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  model?: string;
  tokens?: number;
  rating?: 'up' | 'down' | null;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastActivity: Date;
  model: string;
}

const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    title: 'AI Content Strategy Discussion',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'Help me create a content strategy for my AI company',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: '2',
        type: 'ai',
        content: 'I\'d be happy to help you create a comprehensive content strategy for your AI company. Let\'s break this down into key areas:\n\n**1. Target Audience Identification**\n- Tech professionals and developers\n- Business decision-makers\n- AI enthusiasts and early adopters\n\n**2. Content Pillars**\n- Educational content about AI technologies\n- Case studies and success stories\n- Industry insights and trends\n- Product demonstrations and tutorials\n\n**3. Content Types**\n- Blog posts and articles\n- Video content and webinars\n- Whitepapers and research reports\n- Social media content\n- Podcasts and interviews\n\nWould you like me to dive deeper into any of these areas?',
        timestamp: new Date(Date.now() - 1000 * 60 * 29),
        model: 'Claude 3.5 Sonnet',
        tokens: 156,
      }
    ],
    lastActivity: new Date(Date.now() - 1000 * 60 * 29),
    model: 'Claude 3.5 Sonnet'
  },
  {
    id: '2',
    title: 'Marketing Campaign Ideas',
    messages: [
      {
        id: '3',
        type: 'user',
        content: 'What are some innovative marketing campaign ideas for a B2B SaaS product?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      }
    ],
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    model: 'GPT-4'
  },
  {
    id: '3',
    title: 'Research on AI Trends',
    messages: [
      {
        id: '4',
        type: 'user',
        content: 'Can you research the latest trends in generative AI for 2024?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      }
    ],
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24),
    model: 'Claude 3.5 Sonnet'
  }
];

const aiModels = [
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', description: 'Most intelligent model' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', description: 'Fast and capable' },
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'Reliable and powerful' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', description: 'Fast and efficient' }
];

export function Chat() {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(mockChatSessions[0]);
  const [sessions, setSessions] = useState<ChatSession[]>(mockChatSessions);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedModel, setSelectedModel] = useState('claude-3.5-sonnet');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      lastActivity: new Date(),
      model: selectedModel
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentSession) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    // Update current session with user message
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      lastActivity: new Date(),
      title: currentSession.messages.length === 0 ? message.slice(0, 50) + '...' : currentSession.title
    };

    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
    setMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand your request. Let me provide you with a comprehensive response that addresses your needs. This is a simulated AI response that would typically be generated by the selected AI model.',
        timestamp: new Date(),
        model: aiModels.find(m => m.id === selectedModel)?.name,
        tokens: Math.floor(Math.random() * 200) + 50
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
        lastActivity: new Date()
      };

      setCurrentSession(finalSession);
      setSessions(prev => prev.map(s => s.id === currentSession.id ? finalSession : s));
      setIsLoading(false);
    }, 2000);
  };

  const rateMessage = (messageId: string, rating: 'up' | 'down') => {
    if (!currentSession) return;

    const updatedMessages = currentSession.messages.map(msg =>
      msg.id === messageId ? { ...msg, rating } : msg
    );

    const updatedSession = { ...currentSession, messages: updatedMessages };
    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="h-full flex relative">
      {/* Chat History Sidebar */}
      <div className="w-80 glass-sidebar border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Chat History</h2>
            <Button
              onClick={createNewSession}
              size="sm"
              className="glass-card border-0 hover:bg-white/10"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Model Selector */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">AI Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {aiModels.map(model => (
                <option key={model.id} value={model.id} className="bg-gray-900">
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Sessions List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sessions.map(session => (
              <Button
                key={session.id}
                variant="ghost"
                onClick={() => setCurrentSession(session)}
                className={`w-full justify-start h-auto p-3 text-left hover:bg-white/10 ${
                  currentSession?.id === session.id ? 'bg-white/10' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate mb-1">
                    {session.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{session.messages.length} messages</span>
                    <span>•</span>
                    <span>{formatTimestamp(session.lastActivity)}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="text-xs glass-card border-0 bg-white/5">
                      {session.model}
                    </Badge>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <>
            {/* Chat Header */}
            <div className="glass-header p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-medium">{currentSession.title}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="glass-card border-0 bg-white/5 text-xs">
                      <Brain className="w-3 h-3 mr-1" />
                      {aiModels.find(m => m.id === selectedModel)?.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {currentSession.messages.length} messages
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="hover:bg-white/10">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-white/10">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6 max-w-4xl mx-auto">
                <AnimatePresence initial={false}>
                  {currentSession.messages.map((msg, index) => (
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
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-[70%] ${msg.type === 'user' ? 'order-first' : ''}`}>
                        <Card className={`p-4 ${
                          msg.type === 'user' 
                            ? 'bg-blue-500/20 border-blue-500/30' 
                            : 'glass-card border-0'
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
                                  className="w-6 h-6 p-0 hover:bg-white/10"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => rateMessage(msg.id, 'up')}
                                  className={`w-6 h-6 p-0 hover:bg-white/10 ${
                                    msg.rating === 'up' ? 'text-green-400' : ''
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => rateMessage(msg.id, 'down')}
                                  className={`w-6 h-6 p-0 hover:bg-white/10 ${
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
                          <span className="text-white text-sm font-medium">U</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <Card className="glass-card border-0 p-4 max-w-[70%]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
                      </div>
                    </Card>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-white/10">
              <div className="max-w-4xl mx-auto">
                <div className="glass-card rounded-lg p-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message here..."
                        className="min-h-[60px] max-h-[200px] resize-none bg-transparent border-0 focus:ring-0 p-0"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 hover:bg-white/10"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsRecording(!isRecording)}
                        className={`w-8 h-8 p-0 hover:bg-white/10 ${
                          isRecording ? 'text-red-400' : ''
                        }`}
                      >
                        {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                      
                      <Button
                        onClick={sendMessage}
                        disabled={!message.trim() || isLoading}
                        size="sm"
                        className="glass-card border-0 hover:bg-white/10"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Press Enter to send, Shift + Enter for new line</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{message.length}/4000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-medium mb-2">Start a New Conversation</h2>
              <p className="text-muted-foreground mb-6">
                Select a chat from the sidebar or create a new one to begin
              </p>
              <Button
                onClick={createNewSession}
                className="glass-card border-0 hover:bg-white/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}