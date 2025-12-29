import React, { useState, useRef, useEffect } from 'react';
import { ProjectBlueprint, ChatMessage } from '../types';
import { getArchitectChatResponse } from '../services/geminiService';
import { Bot, X, Send, User, Sparkles, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface ArchitectChatProps {
  blueprint: ProjectBlueprint;
  currentStrategyName: string;
}

const ArchitectChat: React.FC<ArchitectChatProps> = ({ blueprint, currentStrategyName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await getArchitectChatResponse(history, blueprint, currentStrategyName, input);
      setHistory(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error answering that." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 md:right-10 z-40 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 pointer-events-auto flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <div className="bg-teal-500 p-1.5 rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Architect Assistant</h3>
                  <p className="text-[10px] text-slate-300">Context: {currentStrategyName}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
              {history.length === 0 && (
                <div className="text-center mt-10 space-y-3 opacity-60">
                   <Sparkles className="w-8 h-8 text-teal-500 mx-auto" />
                   <p className="text-sm text-slate-500">Ask me anything about your tech stack,<br/>folder structure, or implementation steps!</p>
                </div>
              )}
              {history.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-slate-800 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                  }`}>
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      <ReactMarkdown className="markdown-body text-xs leading-relaxed">
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your blueprint..."
                className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="bg-teal-600 text-white p-2 rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-slate-900 text-white p-3.5 rounded-full shadow-xl hover:bg-slate-800 transition-all hover:scale-105 flex items-center justify-center relative group"
      >
        <div className="absolute inset-0 bg-teal-500 rounded-full opacity-20 group-hover:animate-ping"></div>
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ArchitectChat;