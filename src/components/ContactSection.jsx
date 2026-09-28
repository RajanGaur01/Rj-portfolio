import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  auth, 
  db, 
  loginWithGoogle, 
  logoutUser, 
  isAdminUser 
} from '../lib/firebase';
import { portfolioData } from '../data/portfolioData';
import { 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  AlertCircle,
  ExternalLink,
  Shield,
  ArrowRight
} from 'lucide-react';
import ChatPreviewMock from './chat/ChatPreviewMock';

export default function ContactSection() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  // 1. Listen to Firebase Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
      if (!user) {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Listener for current user's profile
  useEffect(() => {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    const unsubUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    }, (err) => console.error("Firestore user profile listener error:", err));

    return () => unsubUser();
  }, [currentUser]);

  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error("Google sign in failed:", err);
      setAuthError(err.message || 'Google sign in was cancelled or failed.');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const isAdmin = isAdminUser(currentUser, userProfile);

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-8 md:px-12 bg-[#050505] text-white z-20 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono tracking-widest text-zinc-200 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">Direct Collaboration</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight uppercase">
              <span className="text-silver-gradient">LET'S BUILD </span>
              <span className="text-blue-400">TOGETHER.</span>
            </h2>
          </div>

          <div className="space-y-2 max-w-sm">
            <p className="text-zinc-400 text-xs sm:text-sm font-body leading-relaxed">
              Direct communication channel for product architecture and technical inquiries.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-[11px] uppercase tracking-wider text-blue-300">Channel Online</span>
            </div>
          </div>
        </div>

        {/* Auth Error Banner if needed */}
        {authError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono max-w-lg mx-auto text-left space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              <span>AUTHENTICATION NOTICE</span>
            </div>
            <p className="leading-relaxed text-zinc-300">
              {authError}
            </p>
          </div>
        )}

        {/* Loading Spinner */}
        {loadingAuth ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
              INITIALIZING DIRECT MESSAGING...
            </p>
          </div>
        ) : (
          /* ───────────────────────────────────────────────────────────── */
          /* INTERACTIVE ANIMATED CHAT SIMULATION CONTAINER                */
          /* ───────────────────────────────────────────────────────────── */
          <div className="space-y-6">
            <ChatPreviewMock
              user={currentUser}
              profile={userProfile}
              onLogin={handleGoogleLogin}
              onOpenDashboard={() => navigate('/dashboard')}
              onLogout={handleLogout}
            />

            {/* Quick Status Pill Bar when already authenticated */}
            {currentUser && (
              <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-300">
                  <ShieldCheck size={14} className="text-blue-400" />
                  <span>
                    Authenticated as <strong>{currentUser.email}</strong> • Role: <strong className="text-blue-300 uppercase">{isAdmin ? 'EXECUTIVE ADMIN' : 'CLIENT'}</strong>
                  </span>
                </div>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <span>Open Dedicated Dashboard</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Global Social Links Ribbon */}
        <div className="mt-16 p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-zinc-400">
            <span>DIRECT SOCIAL CHANNELS</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {portfolioData.personal.socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white hover:text-black border border-white/15 text-xs font-mono text-zinc-300 transition-all font-semibold"
              >
                <span>{social.name}</span>
                <ArrowUpRight size={11} />
              </a>
            ))}
          </div>
        </div>

        {/* Global Minimal Footer */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">RAJAN GAUR</span>
            <span>•</span>
            <span>{portfolioData.personal.shortRole}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-zinc-500">
            <span>EXCLUSIVE ARCHITECTURE & ENGINEERING</span>
            <span>•</span>
            <span className="text-white font-bold">2026 EDITION</span>
          </div>
        </div>

      </div>

    </section>
  );
}
