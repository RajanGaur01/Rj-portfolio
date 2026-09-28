import React from 'react';
import { ShieldAlert, LogOut, Clock, AlertTriangle } from 'lucide-react';
import { logoutUser } from '../../lib/firebase';

export default function BlockedNotice({ user, profile }) {
  const blockReason = profile?.blockReason || "Communication privileges restricted by administrator due to policy violation or unsolicited promotional content.";
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    try {
      if (timestamp.toDate) return timestamp.toDate().toLocaleString();
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 p-8 sm:p-10 rounded-3xl bg-[#0d0708] border border-red-500/30 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Red ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        {/* Warning Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shadow-xl shadow-red-900/30">
          <ShieldAlert size={32} className="animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/30 text-[10px] font-mono tracking-widest text-red-300 uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>COMMUNICATION ACCESS RESTRICTED</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
            Account Restricted
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm font-body max-w-md mx-auto">
            You are signed in as <span className="text-zinc-200 font-semibold">{user?.email}</span>. Your messaging privileges have been deactivated.
          </p>
        </div>

        {/* Reason Box */}
        <div className="w-full p-5 rounded-2xl bg-black/60 border border-red-500/20 text-left space-y-2 shadow-inner">
          <div className="flex items-center gap-2 text-[11px] font-mono text-red-400 uppercase font-bold tracking-wider">
            <AlertTriangle size={13} />
            <span>Official Reason For Restriction:</span>
          </div>
          <p className="text-sm font-mono text-zinc-200 leading-relaxed pl-5 border-l-2 border-red-500/50">
            "{blockReason}"
          </p>
          {profile?.blockedAt && (
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 pt-1">
              <Clock size={11} />
              <span>Restricted on {formatDate(profile.blockedAt)}</span>
            </div>
          )}
        </div>

        {/* Note */}
        <p className="text-xs text-zinc-500 font-body max-w-sm">
          While this account is restricted, sending new messages or starting chat sessions is disabled.
        </p>

        {/* Sign Out Button */}
        <button
          onClick={logoutUser}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/15 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
        >
          <LogOut size={14} />
          <span>Sign Out Account</span>
        </button>
      </div>
    </div>
  );
}
