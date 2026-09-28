import React, { useState } from 'react';
import { Send, Sparkles, LogOut, ShieldCheck, AlertCircle, CheckCircle2, MessageSquare, Terminal } from 'lucide-react';
import { logoutUser } from '../../lib/firebase';
import { createInquiryThread } from '../../lib/chatService';

const TOPIC_CHIPS = [
  "Startup Product Architecture",
  "Full-Stack Web Engineering",
  "Flutter Mobile App Development",
  "Cloud & Gemini AI Pipelines",
  "General Technical Exploration"
];

export default function InitialMessageComposer({ user, onMessageDispatched }) {
  const [text, setText] = useState('');
  const [topic, setTopic] = useState(TOPIC_CHIPS[0]);
  const [transmitting, setTransmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || transmitting) return;

    setTransmitting(true);
    setError('');

    try {
      await createInquiryThread(user, topic, trimmed);

      if (onMessageDispatched) {
        onMessageDispatched();
      }
    } catch (err) {
      console.error("Error transmitting initial note:", err);
      setError('Failed to dispatch note. Please check your connection and retry.');
    } finally {
      setTransmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 rounded-3xl bg-gradient-to-b from-[#0e0e18] to-[#080810] border border-blue-500/30 p-7 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      
      {/* Specular Ambient Glows */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-7">
        
        {/* User Identity Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-11 h-11 rounded-2xl object-cover border border-blue-400/40 shadow-md shadow-blue-500/20"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-blue-900 border border-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {(user?.displayName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">
                  {user?.displayName || 'Visitor'}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-mono text-emerald-300 font-bold border border-emerald-500/30">
                  <ShieldCheck size={11} className="text-emerald-400" />
                  <span>GOOGLE VERIFIED</span>
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logoutUser}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-[10px] font-mono text-blue-300 uppercase font-bold">
            <Sparkles size={11} />
            <span>1-TIME INTRODUCTORY DISPATCH</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
            Drop Your Note To Rajan
          </h3>
          <p className="text-zinc-400 text-xs font-body leading-relaxed max-w-lg">
            Every Google user can submit <strong>one initial inquiry</strong> for review. Once Rajan authorizes your note, <strong>real-time 2-way live messaging</strong> will unlock on this page.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Interactive Topic Pills */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-semibold flex items-center justify-between">
            <span>Select Discussion Domain</span>
            <span className="text-[10px] text-zinc-500 font-normal">Choose best match</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {TOPIC_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setTopic(chip)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  topic === chip
                    ? 'bg-blue-600 text-white font-bold border border-blue-400 shadow-md shadow-blue-600/40 scale-102'
                    : 'bg-white/[0.03] hover:bg-white/10 text-zinc-400 hover:text-zinc-200 border border-white/10'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Note Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-semibold">
            Inquiry Message
          </label>
          <textarea
            required
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your product requirements, engineering challenge, or what you'd like to collaborate on..."
            maxLength={1200}
            className="w-full p-4 rounded-2xl bg-black/50 border border-white/15 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-white text-sm font-body resize-none placeholder:text-zinc-600 transition-colors leading-relaxed"
          />
          <div className="flex justify-between text-[11px] font-mono text-zinc-500">
            <span>Be as descriptive and clear as possible</span>
            <span>{text.length} / 1200 chars</span>
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={!text.trim() || transmitting}
          className="w-full py-4 rounded-2xl btn-blue-primary text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/40 hover:shadow-blue-500/60"
        >
          {transmitting ? (
            <span>Transmitting to Rajan's Queue...</span>
          ) : (
            <>
              <span>Transmit Note For Review</span>
              <Send size={14} />
            </>
          )}
        </button>

      </form>
    </div>
  );
}
