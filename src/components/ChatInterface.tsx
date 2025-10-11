import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { askAboutSoil } from '../lib/aiAnalysis';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatInterfaceProps {
  analysisId: string;
  soilType: string;
  characteristics: string[];
  recommendations: string[];
  onClose: () => void;
}

export default function ChatInterface({
  analysisId,
  soilType,
  characteristics,
  recommendations,
  onClose
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, [analysisId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('analysis_id', analysisId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            analysis_id: analysisId,
            role,
            content
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const userMsg = await saveMessage('user', userMessage);
    if (userMsg) {
      setMessages(prev => [...prev, userMsg]);
    }

    try {
      const response = await askAboutSoil(
        userMessage,
        soilType,
        characteristics,
        recommendations,
        messages
      );

      const assistantMsg = await saveMessage('assistant', response);
      if (assistantMsg) {
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg = await saveMessage(
        'assistant',
        'Desculpe, ocorreu um erro ao processar sua pergunta. Por favor, tente novamente.'
      );
      if (errorMsg) {
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl">
        <div className="bg-green-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle size={24} />
            <div>
              <h2 className="text-lg font-bold">Chat sobre {soilType}</h2>
              <p className="text-sm text-green-100">Tire suas dúvidas sobre este solo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-600 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-green-700" size={32} />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="text-stone-300 mb-4" size={64} />
              <h3 className="text-xl font-bold text-stone-700 mb-2">
                Comece uma conversa
              </h3>
              <p className="text-stone-500 max-w-md">
                Faça perguntas sobre este solo, peça mais detalhes sobre as características
                ou recomendações, ou tire qualquer dúvida específica.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-green-700 text-white'
                        : 'bg-white text-stone-800 shadow-md border border-stone-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-stone-200">
                    <Loader2 className="animate-spin text-green-700" size={20} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="p-4 bg-white border-t border-stone-200 rounded-b-2xl">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-stone-100"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-green-700 text-white p-3 rounded-xl hover:bg-green-800 transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-stone-500 mt-2 text-center">
            Pressione Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
      </div>
    </div>
  );
}
