import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ModelType } from '../types';
import { createChatSession, sendMessageToChat } from '../services/geminiService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Send, Bot, User, Loader2, Trash2, ChevronDown, Sparkles } from 'lucide-react';
import { ChatSession } from "@google/generative-ai";

interface ChatInterfaceProps {
  selectedModel: ModelType;
  onModelChange: (model: ModelType) => void;
  selectedRootId?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedModel, onModelChange, selectedRootId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('agent_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE = 'http://localhost:3005/api';

  useEffect(() => {
    // Initialize chat session on mount or model change
    setChatSession(createChatSession(selectedModel));

    // Fetch history from server
    const fetchHistory = async () => {
        try {
            const response = await fetch(`${API_BASE}/history`);
            if (response.ok) {
                const history = await response.json();
                if (history && history.length > 0) {
                    setMessages(history);
                }
            }
        } catch (error) {
            console.error('[AGENT] Failed to fetch history from server:', error);
        }
    };
    fetchHistory();
  }, [selectedModel]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Save to local storage
    localStorage.setItem('agent_chat_history', JSON.stringify(messages));

    // Save to server
    const saveHistory = async () => {
        try {
            await fetch(`${API_BASE}/history`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messages)
            });
        } catch (error) {
            console.error('[AGENT] Failed to save history to server:', error);
        }
    };
    if (messages.length > 0) {
        saveHistory();
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToChat(chatSession, userMsg.text);
      const modelMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
      setMessages([]);
      localStorage.removeItem('agent_chat_history');
      setChatSession(createChatSession(selectedModel));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white transition-colors duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur z-10 sticky top-0">
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-xl font-bold">Developer Assistant</h2>
            <p className="text-xs text-blue-500 font-mono flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3" /> Using {selectedModel}
            </p>
          </div>
          
          <div className="relative group">
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value as ModelType)}
              aria-label="Select Gemini Model"
              className="appearance-none bg-gray-50 dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer hover:border-blue-400"
            >
              <option value={ModelType.FLASH_2_0_FULL}>Gemini 2.0 Flash</option>
              <option value={ModelType.FLASH_2_0}>Gemini 2.0 Flash (Exp)</option>
              <option value={ModelType.FLASH_2_0_LITE}>Gemini 2.0 Flash Lite</option>
              <option value={ModelType.PRO_2_0_EXP}>Gemini 2.0 Pro (Exp)</option>
              <option value={ModelType.THINKING_2_0}>Gemini 2.0 Thinking (Exp)</option>
              <option value={ModelType.PRO}>Gemini 1.5 Pro</option>
              <option value={ModelType.FLASH}>Gemini 1.5 Flash</option>
              <option value={ModelType.FLASH_LITE_1_5}>Gemini 1.5 Flash Lite</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
          </div>
        </div>
        <button 
            onClick={clearChat}
            className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-lg transition-colors"
            title="Reset Chat"
        >
            <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 space-y-4 opacity-50">
            <Bot className="w-16 h-16" />
            <p>Ask me about React, patterns, or architecture...</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-4xl w-full gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
              </div>

              <div className={`flex-1 rounded-2xl p-4 md:p-6 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-600/20 text-blue-900 dark:text-blue-100' 
                  : 'bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 text-gray-900 dark:text-gray-100'
              }`}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                ) : (
                  <MarkdownRenderer content={msg.text} rootId={selectedRootId} />
                )}
              </div>

            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex max-w-3xl gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-4 flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Thinking...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-[#0d1117] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="How do I implement a custom hook for..."
            className="w-full bg-gray-50 dark:bg-[#161b22] border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 pr-12 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none h-[60px] md:h-[80px] transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="Send Message"
            className="absolute right-3 bottom-3 md:bottom-5 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
