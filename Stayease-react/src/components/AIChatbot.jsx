import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { aiAPI } from "../services/api";

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I'm **StayEase AI Concierge**.\n\nNeed help finding a PG near campus, a tourist room, or learning about our verified hosts? Ask me anything!",
      suggestedListings: [],
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customMessage) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setInput("");
    setLoading(true);

    try {
      const data = await aiAPI.chat(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "I'm here to help you find the best stay!",
          suggestedListings: data.suggestedListings || [],
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I couldn't reach the assistant server right now, but you can explore stays directly via the Search page! 🚀",
          suggestedListings: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "🎓 Student PG near BHU under ₹5000",
    "🏖️ Cozy Tourist stay in Jaipur",
    "🚗 Secure parking space in Lucknow",
    "🛡️ What is the cancellation policy?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-white font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Open AI Concierge"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          <Sparkles className="w-5 h-5 text-yellow-200 animate-spin-slow" />
          <span>Ask StayEase AI</span>
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">StayEase AI Assistant</h3>
                <p className="text-xs text-white/80">Always online • 24/7 Concierge</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-gray-50 border-b border-gray-100 p-2.5 overflow-x-auto flex gap-2 no-scrollbar">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="text-xs whitespace-nowrap bg-white hover:bg-[#6C5CE7]/10 hover:text-[#6C5CE7] text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 transition font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((msg, index) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={index}
                  className={`flex gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
                >
                  {isBot && (
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-xs ${
                      isBot
                        ? "bg-white text-gray-800 border border-gray-100"
                        : "bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-white"
                    }`}
                  >
                    <div className="whitespace-pre-line font-normal">{msg.text}</div>

                    {/* Render suggested listings inside chat */}
                    {isBot && msg.suggestedListings && msg.suggestedListings.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Matched Accommodations:
                        </p>
                        {msg.suggestedListings.map((item) => (
                          <Link
                            key={item._id}
                            to={`/listing/${item._id}`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-[#6C5CE7]/10 border border-gray-100 transition group"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-semibold text-xs text-gray-900 truncate">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-[#6C5CE7] font-bold">
                                {item.price}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#6C5CE7] shrink-0 transition" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isBot && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 items-center text-gray-400 text-xs pl-2">
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#6C5CE7] to-[#00CEC9] flex items-center justify-center text-white shrink-0 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>StayEase AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about PGs, tourist stays, prices..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-linear-to-r from-[#6C5CE7] to-[#00CEC9] text-white hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
