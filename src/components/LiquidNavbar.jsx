import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowUpRight, 
  Menu, 
  X, 
  LayoutDashboard,
  Compass,
  Layers,
  Cpu,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function LiquidNavbar({ soundActive, toggleSound }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Vanish navbar on scroll down
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMobileNav = (href) => {
    setMobileMenuOpen(false);
    if (href === '__dashboard__') {
      navigate('/dashboard');
    } else {
      scrollToSection(href);
    }
  };

  const NAV_ITEMS = [
    { label: 'Vision', icon: Compass, href: 'hero' },
    { label: 'Projects', icon: Layers, href: 'projects' },
    { label: 'Stack & Skills', icon: Cpu, href: 'capabilities' },
    { label: 'Philosophy', icon: Sparkles, href: 'timeline' },
  ];

  const menuContainerVariants = {
    closed: {
      opacity: 0,
      y: -18,
      scale: 0.94,
      transition: {
        duration: 0.2,
        ease: [0.32, 0.72, 0, 1]
      }
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 340,
        staggerChildren: 0.05,
        delayChildren: 0.04
      }
    }
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: -10, scale: 0.96 },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 24,
        stiffness: 320
      }
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled 
          ? '-translate-y-36 opacity-0 pointer-events-none' 
          : 'translate-y-0 opacity-100'
      }`}
    >
      {/* Liquid Glass Floating Center Pill Bar (Desktop & Tablet) */}
      <nav 
        className="pointer-events-auto flex items-center justify-between gap-4 md:gap-8 px-5 md:px-7 py-3 rounded-full transition-all duration-500 max-w-6xl w-full liquid-glass-pill bg-[#0c0c10]/90 border-white/20 shadow-2xl backdrop-blur-2xl"
      >
        {/* Left: Brand Identity / Welcome */}
        <div className="flex items-center gap-3">
          <a 
            href="#hero" 
            onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
            className="group flex items-center gap-2 text-white transition-colors"
          >
            <span className="font-serif italic text-lg sm:text-xl text-white font-light tracking-wide select-none group-hover:opacity-80 transition-opacity">
              Welcome
            </span>
          </a>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
          {[
            { label: 'Vision', href: 'hero' },
            { label: 'Projects', href: 'projects' },
            { label: 'Stack & Skills', href: 'capabilities' },
            { label: 'Philosophy', href: 'timeline' },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.href)}
              className="px-3.5 py-1 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/15 rounded-full transition-all duration-200 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: Availability & Action Controls */}
        <div className="flex items-center gap-3">
          {/* Live Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 font-semibold shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="font-mono text-[10px] tracking-tight text-blue-300 font-bold">OPEN TO COLLAB</span>
          </div>

          {/* Sound Ambience Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle ambient sound"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 hover:border-blue-400/60 hover:bg-blue-500/10 transition-all duration-200 text-white shadow-liquid-sm cursor-pointer"
            title={soundActive ? "Mute Ambient Sound" : "Activate Ambient Sound"}
          >
            {soundActive ? <Volume2 size={15} className="text-blue-400" /> : <VolumeX size={15} />}
          </button>

          {/* CTA Button: Royal Blue - Dynamically switches to Dashboard if logged in */}
          {currentUser ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 cursor-pointer"
            >
              <LayoutDashboard size={13} />
              <span>Dashboard</span>
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </button>
          ) : (
            <button
              onClick={() => scrollToSection('contact')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 cursor-pointer"
            >
              <span>Let's Talk</span>
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 border border-white/20 text-white transition-all cursor-pointer shadow-lg"
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={18} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu-icon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={18} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TACTILE MOBILE DROPDOWN MENU WITH REAL BUTTONS                */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Full-Screen Frosted Glass Backdrop with Heavy Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="pointer-events-auto fixed inset-0 z-40 md:hidden bg-black/65 backdrop-blur-2xl"
            />

            {/* Floating Smoked Obsidian Liquid Glass Menu Card */}
            <motion.div
              variants={menuContainerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="pointer-events-auto fixed top-20 inset-x-4 max-w-sm ml-auto z-50 md:hidden liquid-glass-menu rounded-3xl p-3.5 space-y-2.5"
            >
              {/* Header Bar with Title and Dedicated Close (Cross) Button */}
              <div className="flex items-center justify-between px-1.5 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="font-mono text-[11px] font-bold tracking-widest text-zinc-300 uppercase">
                    Navigation
                  </span>
                </div>

                {/* Dedicated Cross Close Button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 border border-white/15 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm hover:border-blue-400/50 hover:bg-blue-600/20"
                  aria-label="Close mobile menu"
                  title="Close Menu"
                >
                  <X size={16} strokeWidth={2.4} />
                </button>
              </div>

              {/* Clean Navigation Options with Unified Liquid Theme & High Contrast */}
              <div className="space-y-1.5">
                {NAV_ITEMS.map((item) => (
                  <motion.button
                    key={item.label}
                    variants={menuItemVariants}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleMobileNav(item.href)}
                    className="liquid-glass-menu-item w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-white cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600/35 group-hover:border-blue-400/60 group-hover:text-blue-300 group-hover:scale-105 shadow-[0_0_12px_rgba(37,99,235,0.2)] group-hover:shadow-[0_0_18px_rgba(37,99,235,0.4)] transition-all duration-200">
                        <item.icon size={19} strokeWidth={2} />
                      </div>
                      <span className="font-display font-bold text-[15px] text-white tracking-wide group-hover:text-blue-200 group-hover:translate-x-0.5 transition-all duration-200">
                        {item.label}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-blue-400/50 group-hover:bg-blue-600/25 group-hover:scale-105 transition-all duration-200 shrink-0">
                      <ArrowUpRight size={15} strokeWidth={2.2} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Primary Royal Blue Liquid Action Button */}
              <motion.div variants={menuItemVariants} className="pt-0.5">
                {currentUser ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleMobileNav('__dashboard__')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-display font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 border border-blue-300/40 shadow-[0_12px_28px_rgba(37,99,235,0.45),inset_0_1px_2px_rgba(255,255,255,0.35)] transition-all cursor-pointer group"
                  >
                    <LayoutDashboard size={17} strokeWidth={2.2} />
                    <span>Dashboard</span>
                    <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleMobileNav('contact')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-display font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 border border-blue-300/40 shadow-[0_12px_28px_rgba(37,99,235,0.45),inset_0_1px_2px_rgba(255,255,255,0.35)] transition-all cursor-pointer group"
                  >
                    <MessageSquare size={17} strokeWidth={2.2} />
                    <span>Let's Talk</span>
                    <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
