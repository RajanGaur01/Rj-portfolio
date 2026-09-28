import React, { useState, useEffect, useRef } from 'react';
import { logoutUser } from '../../lib/firebase';
import { subscribeToThreadMessages, transmitMessage } from '../../lib/chatService';
import { Send, CheckCheck, Sparkles, User, LogOut, ShieldCheck, ArrowDown } from 'lucide-react';

export default function ChatThread({ user, profile, threadId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Real-time listener for messages in this thread
  useEffect(() => {
    if (!threadId) return;

    const unsubscribe = subscribeToThreadMessages(threadId, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [threadId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      await transmitMessage(threadId, {
        senderId: user.uid,
        senderName: user.displayName || 'Visitor',
        senderEmail: user.email,
        senderPhoto: user.photoURL || null,
        senderRole: 'user',
        text: trimmed,
      });

      setInputText('');
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-3xl bg-gradient-to-b from-[#0e0e18] to-[#07070e] border border-blue-500/35 shadow-2xl overflow-hidden flex flex-col h-[650px] relative backdrop-blur-2xl">
      
      {/* Top Channel Header */}
      <div className="px-6 py-4 bg-[#0a0a12] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-600/30">
              <div className="w-full h-full rounded-2xl bg-[#0a0a0f] flex items-center justify-center font-display font-black text-sm text-white">
                RG
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0a0a0f] shadow-[0_0_8px_#10b981]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm sm:text-base text-white">RAJAN GAUR</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-mono font-bold text-blue-300 border border-blue-500/30">
                <ShieldCheck size={11} className="text-blue-400" />
                <span>ARCHITECT</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-400">
              Live Verified Channel • Real-time Active
            </p>
          </div>
        </div>

        {/* User Account & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-zinc-200 truncate max-w-[160px]">
              {user?.displayName || 'User'}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[160px]">
              {user?.email}
            </span>
          </div>

          <button
            onClick={logoutUser}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      {/* Message History Feed */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
        {/* Welcome Authorization Banner */}
        <div className="py-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-300 uppercase font-bold mb-2 shadow-lg shadow-emerald-900/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>COMMUNICATION CHANNEL AUTHORIZED</span>
          </div>
          <p className="text-xs font-mono text-zinc-400 max-w-sm mx-auto">
            Your introductory message was approved by Rajan. You can now chat in real-time.
          </p>
        </div>

        {messages.map((msg) => {
          const isUser = msg.senderRole === 'user' || msg.senderId === user.uid;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2.5 max-w-[85%] sm:max-w-[75%]">
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1 shadow-lg shadow-blue-600/30">
                    RG
                  </div>
                )}

                <div
                  className={`p-4 rounded-2xl text-sm font-body leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-none border border-blue-400/30 shadow-blue-900/20'
                      : 'bg-[#14141e] text-zinc-100 rounded-bl-none border border-white/15'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-blue-300 pb-1 mb-1 border-b border-white/10">
                      <span>RAJAN GAUR</span>
                      <ShieldCheck size={12} className="text-blue-400" />
                    </div>
                  )}

                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                  <div className={`pt-1 text-[10px] font-mono text-right ${isUser ? 'text-blue-200' : 'text-zinc-500'}`}>
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSendMessage} className="p-4 bg-[#0a0a12] border-t border-white/10 shrink-0">
        <div className="relative flex items-center gap-2.5">
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message to Rajan... (Press Enter to send)"
            maxLength={1000}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/15 focus:border-blue-500 focus:outline-none text-white text-sm placeholder:text-zinc-500 resize-none font-body transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0 shadow-lg shadow-blue-600/30"
          >
            <span>Send</span>
            <Send size={13} />
          </button>
        </div>
      </form>
    </div>
  );
}
