import React from 'react';
import { Clock, CheckCircle2, ShieldAlert, LogOut, MessageSquare, Sparkles, Radio } from 'lucide-react';
import { logoutUser } from '../../lib/firebase';

export default function PendingReviewNotice({ user, thread }) {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    try {
      if (timestamp.toDate) return timestamp.toDate().toLocaleString();
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 rounded-3xl bg-gradient-to-b from-[#0c0c16] to-[#07070e] border border-blue-500/30 p-8 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl text-center space-y-7">
      
      {/* Ambient Pulsing Radar Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Radar Pulse Centerpiece */}
      <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-2 rounded-full bg-blue-500/15 animate-pulse" />
        <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-xl shadow-blue-900/40 relative z-10">
          <Radio size={28} className="animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/50 border border-blue-500/30 text-[10px] font-mono tracking-widest text-blue-300 uppercase font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>INQUIRY QUEUED // AWAITING AUTHORIZATION</span>
        </div>
        <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
          Inquiry Under Review
        </h3>
        <p className="text-zinc-400 text-xs sm:text-sm font-body max-w-md mx-auto leading-relaxed">
          Your note has been placed into Rajan's personal review queue. You will be able to converse in real-time as soon as it's authorized.
        </p>
      </div>

      {/* Submitted Message Card */}
      {thread?.lastMessage && (
        <div className="w-full p-5 rounded-2xl bg-black/60 border border-white/10 text-left space-y-2 relative z-10 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pb-1 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-blue-300 font-semibold">
              <MessageSquare size={12} />
              <span>Your Transmitted Note:</span>
            </span>
            <span className="text-[10px] text-zinc-500">{formatDate(thread.lastMessageAt)}</span>
          </div>
          <p className="text-sm font-body text-zinc-200 leading-relaxed italic bg-white/[0.02] p-3.5 rounded-xl border border-white/5 whitespace-pre-wrap">
            {thread.lastMessage}
          </p>
        </div>
      )}

      {/* Protocol Explanation */}
      <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 text-xs text-zinc-300 font-body text-left space-y-1.5 relative z-10">
        <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase text-[11px] font-mono">
          <Sparkles size={12} />
          <span>Quality & Spam Prevention Protocol</span>
        </div>
        <p className="text-zinc-400 leading-relaxed text-[11px]">
          To keep discussions meaningful, all accounts have a 1-message threshold. Once Rajan approves your inquiry, <strong>live 2-way messaging</strong> unlocks immediately on this page without needing to re-login.
        </p>
      </div>

      {/* Account Info & Logout */}
      <div className="pt-2 flex items-center justify-between w-full border-t border-white/10 text-xs text-zinc-400 font-mono relative z-10">
        <span className="truncate max-w-[250px]">Signed in as {user?.email}</span>
        <button
          onClick={logoutUser}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-all cursor-pointer font-semibold"
        >
          <LogOut size={12} />
          <span>Sign Out</span>
        </button>
      </div>

    </div>
  );
}
