import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  LogOut,
  Zap
} from 'lucide-react';

const DIALOGUE_STEPS = [
  {
    id: 1,
    sender: 'user',
    text: "Hey Rajan, looking to build a high-scale SaaS product. Are you available for a new build?",
    time: "11:02 AM",
    triggerAt: 400,
  },
  {
    id: 2,
    sender: 'rajan',
    text: "Hey! Yes, I specialize in full-stack cloud systems, AI workflows, and cross-platform apps. What is your estimated launch target?",
    time: "11:02 AM",
    triggerAt: 1900,
  },
  {
    id: 3,
    sender: 'user',
    text: "Targeting Q4 launch. Can we discuss architecture specs, tech stack, and scope?",
    time: "11:03 AM",
    triggerAt: 3400,
  },
  {
    id: 4,
    sender: 'rajan',
    text: "Sounds great! Feel free to initiate your inquiry below — I'll review your requirements and follow up directly.",
    time: "11:03 AM",
    triggerAt: 4900,
  }
];

export default function ChatPreviewMock({ 
  user, 
  profile, 
  onLogin, 
  onOpenDashboard, 
  onLogout 
}) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });

  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(null); // 'rajan' | 'user' | null
  const [sequenceFinished, setSequenceFinished] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Start sequence ONLY when the container enters user's viewport
  useEffect(() => {
    if (!isInView) return;

    const timers = [];

    // Step 1: User Message 1
    timers.push(setTimeout(() => {
      setVisibleMessages([DIALOGUE_STEPS[0]]);
      setIsTyping('rajan');
    }, DIALOGUE_STEPS[0].triggerAt));

    // Step 2: Rajan Message 2
    timers.push(setTimeout(() => {
      setIsTyping(null);
      setVisibleMessages(prev => [...prev, DIALOGUE_STEPS[1]]);
      setIsTyping('user');
    }, DIALOGUE_STEPS[1].triggerAt));

    // Step 3: User Message 3
    timers.push(setTimeout(() => {
      setIsTyping(null);
      setVisibleMessages(prev => [...prev, DIALOGUE_STEPS[2]]);
      setIsTyping('rajan');
    }, DIALOGUE_STEPS[2].triggerAt));

    // Step 4: Rajan Message 4
    timers.push(setTimeout(() => {
      setIsTyping(null);
      setVisibleMessages(prev => [...prev, DIALOGUE_STEPS[3]]);
      // Finish sequence after message 4 displays
      timers.push(setTimeout(() => {
        setSequenceFinished(true);
      }, 700));
    }, DIALOGUE_STEPS[3].triggerAt));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isInView]);

  const handleAction = async () => {
    if (user) {
      onOpenDashboard?.();
    } else {
      setIsAuthenticating(true);
      try {
        await onLogin?.();
      } finally {
        setIsAuthenticating(false);
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto my-8">
      {/* Outer Luxury Container mimicking screenshot */}
      <div className="relative rounded-[2rem] bg-gradient-to-b from-[#0a0d18] via-[#060810] to-[#04050a] border border-blue-500/25 shadow-[0_0_60px_rgba(20,50,120,0.25)] p-5 sm:p-8 backdrop-blur-2xl overflow-hidden">
        
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 1. TOP HEADER BAR (Exact layout from user screenshot)          */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          
          {/* Left: Avatar + Title + Badges */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-950 border border-blue-400/50 flex items-center justify-center text-white font-display font-black text-lg tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                RG
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-[#060810]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-black text-base sm:text-lg text-white tracking-wide uppercase">
                  RAJAN GAUR
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-[10px] font-mono font-bold text-blue-300 uppercase tracking-widest">
                  <ShieldCheck size={11} className="text-blue-400" />
                  ARCHITECT
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-0.5">
                Direct Message Queue • Real-Time Line
              </p>
            </div>
          </div>

          {/* Right: User Status or Live Indicator */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-2xl">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-6 h-6 rounded-full border border-blue-400/50" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center text-[10px] text-blue-300 font-bold">
                    {user.displayName?.[0] || 'U'}
                  </div>
                )}
                <div className="text-left text-xs font-mono">
                  <div className="text-white font-semibold truncate max-w-[120px]">{user.displayName}</div>
                  <div className="text-zinc-500 text-[10px] truncate max-w-[120px]">{user.email}</div>
                </div>
                {onLogout && (
                  <button 
                    onClick={onLogout}
                    title="Sign Out"
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                  </button>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/20 text-xs font-mono text-blue-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-[11px] tracking-wider">LIVE DIRECT LINE</span>
              </div>
            )}
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 2. SEQUENTIAL ANIMATED CHAT SIMULATION                         */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative z-10 py-6 min-h-[300px] flex flex-col justify-end space-y-4">
          <AnimatePresence>
            {visibleMessages.map((msg) => {
              const isRajan = msg.sender === 'rajan';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex items-start gap-3 w-full ${isRajan ? 'justify-start' : 'justify-end'}`}
                >
                  {/* Left Avatar for Rajan */}
                  {isRajan && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-950 border border-blue-400/40 flex items-center justify-center text-white font-display font-black text-xs shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.4)]">
                      RG
                    </div>
                  )}

                  {/* Bubble Content */}
                  <div
                    className={`max-w-md sm:max-w-lg p-4 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed shadow-lg ${
                      isRajan
                        ? 'bg-[#101422] border border-blue-500/30 text-zinc-200'
                        : 'bg-blue-600 text-white border border-blue-400/40 shadow-blue-600/20'
                    }`}
                  >
                    {isRajan && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
                        <span>RAJAN GAUR</span>
                        <ShieldCheck size={11} className="text-blue-400" />
                      </div>
                    )}
                    <p>{msg.text}</p>
                    <div
                      className={`text-[10px] font-mono mt-1.5 text-right ${
                        isRajan ? 'text-zinc-500' : 'text-blue-200'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`flex items-center gap-2 ${isTyping === 'rajan' ? 'justify-start' : 'justify-end'}`}
              >
                {isTyping === 'rajan' && (
                  <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-white font-display font-bold text-[10px]">
                    RG
                  </div>
                )}
                <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                  <span>{isTyping === 'rajan' ? 'Rajan is typing' : 'Visitor is typing'}</span>
                  <span className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 3. BOTTOM GATEWAY ACTION (Animated In After Chat Finishes)     */}
        {/* ───────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {sequenceFinished && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 mt-5 p-6 rounded-2xl bg-gradient-to-b from-[#0f1426] to-[#080b15] border border-blue-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left"
            >
              {/* Left Information Content */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 text-blue-400 font-mono text-xs font-bold tracking-wider uppercase">
                  <Sparkles size={13} className="text-blue-400" />
                  <span>PROJECT CONSULTATION & TECHNICAL INQUIRY</span>
                </div>
                <h4 className="text-white font-display font-bold text-base sm:text-lg tracking-tight">
                  Initiate Project Collaboration
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans max-w-xl">
                  Connect directly to discuss full-stack cloud systems, AI integrations, mobile architecture, or enterprise engineering solutions.
                </p>
              </div>

              {/* Right Action Button - Compact, Luxury, Elegant */}
              <div className="shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleAction}
                  disabled={isAuthenticating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-display font-black text-xs sm:text-sm tracking-wide uppercase transition-all shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.35)] active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {!user && (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  )}

                  <span>
                    {isAuthenticating
                      ? 'Connecting...'
                      : user
                      ? 'Open Client Dashboard'
                      : 'Start Project Inquiry'}
                  </span>

                  <ArrowRight size={15} />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
