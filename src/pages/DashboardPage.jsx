import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, isAdminUser } from '../lib/firebase';
import UserChatDashboard from '../components/chat/UserChatDashboard';
import AdminDashboard from '../components/chat/AdminDashboard';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Shield, 
  LogOut, 
  User as UserIcon, 
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  // 1. Firebase Auth Listener
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

  // 2. Real-time Firestore Listener for Profile
  useEffect(() => {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.uid);
    const unsub = onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        setUserProfile(snap.data());
      }
    }, (err) => {
      console.error("Firestore user profile listener error:", err);
    });

    return () => unsub();
  }, [currentUser]);

  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google sign in error:", err);
      setAuthError(err.message || 'Google sign in failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const isAdmin = isAdminUser(currentUser, userProfile);

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs text-zinc-400 uppercase tracking-widest">
          CONNECTING SECURE MESSAGING GATEWAY...
        </p>
      </div>
    );
  }

  // If user is not authenticated on /dashboard, show clean full-page login gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/[0.05] rounded-full blur-[140px] pointer-events-none" />

        {/* Top Header */}
        <header className="relative z-10 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all"
          >
            <ArrowLeft size={14} />
            <span>Back to Portfolio</span>
          </Link>
          <div className="text-xs font-mono text-zinc-500">
            RAJAN GAUR • DIRECT MESSAGING
          </div>
        </header>

        {/* Central Sign-In Container */}
        <div className="relative z-10 max-w-md w-full mx-auto my-auto text-center space-y-6 p-8 sm:p-10 rounded-3xl bg-[#0a0d18] border border-blue-500/30 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto shadow-xl shadow-blue-900/30">
            <MessageSquare size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
              Launch Direct Chat
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Sign in with your Google account to access your live message thread with Rajan.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono text-left">
              {authError}
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-display font-extrabold text-sm uppercase tracking-wide transition-all shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-95 cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Footer */}
        <footer className="relative z-10 text-center text-xs font-mono text-zinc-600">
          ENGINEERED BY RAJAN GAUR • 2026 EDITION
        </footer>
      </div>
    );
  }

  // IF ADMIN: Render Full-Screen Admin Dashboard
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <AdminDashboard
          user={currentUser}
          onClose={() => navigate('/')}
          onTogglePreview={() => navigate('/')}
        />
      </div>
    );
  }

  // IF REGULAR USER: Render Dedicated Full-Page User Dashboard
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#07070c]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Back to Portfolio */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400 pl-2 border-l border-white/10">
            <span className="font-bold text-white">RAJAN GAUR</span>
            <span>•</span>
            <span className="text-blue-400">DIRECT MESSAGING</span>
          </div>
        </div>

        {/* Right: User Identity & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName}
                className="w-6 h-6 rounded-full border border-blue-400/50"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center text-[10px] text-blue-300 font-bold">
                {currentUser.displayName?.[0] || 'U'}
              </div>
            )}
            <div className="text-left text-xs font-mono">
              <span className="text-white font-medium block truncate max-w-[130px]">
                {currentUser.displayName || 'Visitor'}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-[10px] font-mono text-blue-300">
              CLIENT
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-950/40 hover:text-red-300 hover:border-red-500/30 border border-white/10 text-xs font-mono text-zinc-400 transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content: UserChatDashboard */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        <UserChatDashboard user={currentUser} profile={userProfile} />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 py-4 px-6 text-center text-[11px] font-mono text-zinc-600">
        EXECUTIVE DISPATCH CHANNEL • RAJAN GAUR • 2026 EDITION
      </footer>

    </div>
  );
}
