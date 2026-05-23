import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mic, Send, Languages } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const LANGUAGES = [
  { code: 'en-IN', name: 'English', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', flag: '🇮🇳' },
];

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentLang, setCurrentLang] = useState(LANGUAGES[1]); // Default Hindi
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5), // Send last few messages for context
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Connection error. Please check your internet." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onResult: (text) => handleSend(text),
    lang: currentLang.code,
  });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 flex h-[500px] w-[400px] flex-col overflow-hidden rounded-2xl border border-border bg-[#F5F0E8] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <img src="/Logo.png" alt="LexAI" className="h-8 w-8" />
                <span className="font-serif text-lg font-bold text-[#1A1A1A]">LexAI</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center mt-10">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-border inline-block max-w-[80%]">
                    <p className="text-sm text-gray-600">
                      नमस्ते! I am LexAI, your legal assistant. How can I help you today?
                    </p>
                  </div>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#D4AF37] text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border border-border rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Language Selector */}
            <div className="px-4 py-1 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest">
              <div className="flex items-center gap-1">
                <Languages size={10} />
                <span>Detected:</span>
                <span className="font-bold text-[#D4AF37]">{currentLang.flag} {currentLang.name}</span>
              </div>
              <div className="flex gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setCurrentLang(lang)}
                    className={`px-1 rounded ${currentLang.code === lang.code ? 'bg-[#D4AF37] text-white' : 'hover:bg-gray-200'}`}
                  >
                    {lang.code.split('-')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Wrapper */}
            <div className="p-4 bg-white border-t border-border">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={isListening ? (transcript || "Listening...") : inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend(inputText)}
                  placeholder="Ask about Indian Law..."
                  className="w-full rounded-full border border-border bg-gray-50 py-2 pl-4 pr-10 text-sm focus:border-[#D4AF37] focus:outline-none"
                  disabled={isListening}
                />
                
                <button
                  onMouseDown={startListening}
                  onMouseUp={stopListening}
                  onTouchStart={startListening}
                  onTouchEnd={stopListening}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-lg scale-110' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  title="Hold to speak"
                >
                  <Mic size={18} />
                </button>

                <button
                  onClick={() => handleSend(inputText)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-white hover:opacity-90 transition-opacity"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-colors ${
          isOpen ? 'bg-[#1A1A1A] text-white' : 'bg-[#D4AF37] text-white'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </div>
  );
};
