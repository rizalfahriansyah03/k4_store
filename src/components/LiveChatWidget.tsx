import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageSquare, X, Send, Bot, Headset, Sparkles } from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const {
    chatMessages,
    isChatOpen,
    setIsChatOpen,
    sendChatMessage,
    unreadChatCount
  } = useStore();

  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    sendChatMessage(text);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isChatOpen && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in duration-200">
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-800 text-white shadow-xl hover:bg-emerald-900 transition-all hover:scale-105 active:scale-95 group"
            aria-label="Buka Live Chat K4 Care"
          >
            <div className="relative">
              <Headset className="w-5 h-5" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold block leading-tight">Live Chat CS</span>
              <span className="text-[10px] text-emerald-200 block">K4 Care Siap Membantu</span>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window Drawer / Modal */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col h-[520px] animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-emerald-800 text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                  K4
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-800" />
              </div>
              <div>
                <h4 className="text-xs font-bold block">K4 Care Support</h4>
                <p className="text-[10px] text-emerald-200">
                  Responsif & Siap Bantu Belanja Sembako
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Tutup chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick FAQ / Topics Pill Bar */}
          <div className="bg-stone-50 px-3 py-2 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] text-stone-500 font-semibold shrink-0">
              Tanya Cepat:
            </span>
            <button
              onClick={() => handleQuickReply('Kapan pesanan saya sampai?')}
              className="text-[10px] px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-700 hover:border-emerald-600 whitespace-nowrap shrink-0 transition-colors"
            >
              Lacak Pesanan
            </button>
            <button
              onClick={() => handleQuickReply('Apakah beras Cianjur ready stok?')}
              className="text-[10px] px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-700 hover:border-emerald-600 whitespace-nowrap shrink-0 transition-colors"
            >
              Cek Stok Beras
            </button>
            <button
              onClick={() => handleQuickReply('Bagaimana cara pakai K4 Poin?')}
              className="text-[10px] px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-700 hover:border-emerald-600 whitespace-nowrap shrink-0 transition-colors"
            >
              Pakai Poin
            </button>
            <button
              onClick={() => handleQuickReply('Apakah bisa Bayar di Tempat (COD)?')}
              className="text-[10px] px-2.5 py-1 bg-white border border-stone-200 rounded-lg text-stone-700 hover:border-emerald-600 whitespace-nowrap shrink-0 transition-colors"
            >
              Bayar COD
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/40">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-emerald-800 text-white rounded-br-xs'
                        : 'bg-white border border-stone-200/90 text-stone-800 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-stone-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ketik pertanyaan untuk CS K4..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-stone-100 focus:bg-white rounded-xl border border-transparent focus:border-emerald-600 focus:outline-none transition-all text-stone-800"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 disabled:opacity-40 transition-colors shrink-0 shadow-xs"
              aria-label="Kirim pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
