import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Mic, Plus, Clock, Users, Search, X } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
  quickActions?: QuickAction[];
}

interface QuickAction {
  type: 'play' | 'add' | 'remind' | 'party';
  label: string;
  movieTitle?: string;
}

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hi! I'm your AI movie assistant. I can help you find the perfect movie or show. What are you in the mood for today?",
    sender: 'ai',
    timestamp: new Date(),
    suggestions: [
      "Something funny to watch with family",
      "Sci-fi movies like Inception",
      "What's trending this week?",
      "Find a specific scene for me"
    ]
  }
];

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setInputValue("Show me sci-fi movies");
        setIsListening(false);
      }, 2000);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    let message = '';
    switch (action.type) {
      case 'play':
        message = `🎬 Started playing "${action.movieTitle}"`;
        break;
      case 'add':
        message = `✅ Added "${action.movieTitle}" to your list`;
        break;
      case 'remind':
        message = `⏰ Reminder set for "${action.movieTitle}"`;
        break;
      case 'party':
        message = `🎉 Watch party mode activated for "${action.movieTitle}"`;
        break;
    }
    
    const systemMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 2,
        text: "Unable to reach AI server.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full md:w-[420px] h-[600px] bg-zinc-900 border-l border-zinc-800 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 p-4 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">AI Movie Assistant</h3>
          <p className="text-xs text-white/80">Always here to help you discover</p>
        </div>
        <button
    onClick={onClose}
    className="p-2 rounded-full hover:bg-white/20 transition"
    aria-label="Close AI chat"
  >
    <X className="w-5 h-5" />
  </button>
</div>

      {/* Quick Access Features */}
      <div className="bg-zinc-800/50 p-3 border-b border-zinc-800">
        <div className="flex gap-2 text-xs">
          <button className="flex items-center gap-1 bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 rounded-full transition">
            <Search className="w-3 h-3" />
            Scene Search
          </button>
          <button className="flex items-center gap-1 bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 rounded-full transition">
            <Clock className="w-3 h-3" />
            Reminders
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-gray-100'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
            
            {/* Quick Actions */}
            {message.quickActions && message.sender === 'ai' && (
              <div className="mt-2 flex flex-wrap gap-2 ml-2">
                {message.quickActions.map((action, idx) => {
                  const Icon = action.type === 'play' ? Play : 
                               action.type === 'add' ? Plus :
                               action.type === 'remind' ? Clock : Users;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action)}
                      className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg px-3 py-2 transition font-medium"
                    >
                      <Icon className="w-3 h-3" />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* Suggestions */}
            {message.suggestions && message.sender === 'ai' && (
              <div className="mt-2 space-y-2 ml-2">
                {message.suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="block w-full text-left text-xs bg-zinc-800 hover:bg-zinc-700 text-gray-300 rounded-lg px-3 py-2 transition"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900">
        {isListening && (
          <div className="mb-2 text-center">
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Listening...
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleVoiceInput}
            className={`${isListening ? 'bg-red-600' : 'bg-zinc-700 hover:bg-zinc-600'} rounded-full p-3 transition`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
            placeholder="Ask me anything about movies..."
            className="flex-1 bg-zinc-800 text-white rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button
            onClick={() => handleSend(inputValue)}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Try: "Find the scene where..." or "Recommend movies for date night"
        </p>
      </div>
    </div>
  );
}
