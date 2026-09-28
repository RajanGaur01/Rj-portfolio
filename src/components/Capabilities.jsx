import React, { useState, useEffect, useRef } from 'react';
import { Layers, Cpu, Smartphone, Cloud, Bot, Sparkles, Check, ChevronRight, X, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Capabilities() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);

  // 5 Stack Disciplines Matching Reference Image & Full-Spectrum Stack
  const stackCards = [
    {
      id: 'frontend',
      category: 'Frontend Architecture',
      emblem: 'FRONTEND',
      title: 'FRONTEND ARCHITECTURE',
      subtitle: 'React 19 • TypeScript • Tailwind CSS • WebGL & UX',
      bgGradient: 'from-[#0d1b2a] via-[#1b263b] to-[#0a0a0f]',
      accentColor: 'from-blue-600/30 to-cyan-500/20',
      bannerImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
      description: 'Building responsive, ultra-fast web architectures with React 19, TypeScript, Tailwind CSS, and 60 FPS Three.js/WebGL interactive experiences.',
      skills: ['React.js 19', 'TypeScript', 'Tailwind CSS', 'Three.js / WebGL', 'Next.js & Vite', 'Lenis Smooth Scroll', 'Framer Motion', 'State Trees'],
      highlight: 'UI/UX & WebGL Systems',
      icon: <Layers size={18} className="text-white" />,
      year: '2026',
    },
    {
      id: 'backend',
      category: 'Backend Systems',
      emblem: 'BACKEND',
      title: 'BACKEND & DATA SYSTEMS',
      subtitle: 'Node.js • Express • PostgreSQL • NoSQL & REST APIs',
      bgGradient: 'from-[#2b092b] via-[#40123e] to-[#0a0a0f]',
      accentColor: 'from-fuchsia-600/30 to-pink-500/20',
      bannerImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
      description: 'Architecting scalable server logic, relational PostgreSQL databases, NoSQL Firestore documents, and secure JWT/OAuth authentication systems.',
      skills: ['Node.js', 'Express.js', 'Firebase Firestore', 'PostgreSQL', 'RESTful APIs', 'JWT & OAuth', 'CRUD Workflows', 'Database Indexing'],
      highlight: 'Server Logic & Databases',
      icon: <Cpu size={18} className="text-white" />,
      year: '2026',
    },
    {
      id: 'mobile',
      category: 'Mobile Engineering',
      emblem: 'MOBILE',
      title: 'FLUTTER MOBILE APPS',
      subtitle: 'Flutter & Dart • Bloc Pattern • Native Android • GPS',
      bgGradient: 'from-[#062c30] via-[#053f43] to-[#0a0a0f]',
      accentColor: 'from-teal-600/30 to-emerald-500/20',
      bannerImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
      description: 'Engineering native-quality Flutter mobile applications with Bloc state management, background Android GPS services, and offline Hive local databases.',
      skills: ['Flutter SDK', 'Dart Language', 'Bloc State Architecture', 'Android Services', 'Geofencing & GPS', 'Hive Local Cache', 'Firebase Mobile', 'Material UI 3'],
      highlight: 'Cross-Platform Mobile',
      icon: <Smartphone size={18} className="text-white" />,
      year: '2026',
    },
    {
      id: 'cloud',
      category: 'Cloud Infrastructure',
      emblem: 'CLOUD',
      title: 'AWS CLOUD PLATFORM',
      subtitle: 'AWS Cloud • Lambda • S3 • CloudFront • Docker',
      bgGradient: 'from-[#332200] via-[#4d3300] to-[#0a0a0f]',
      accentColor: 'from-amber-600/30 to-yellow-500/20',
      bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
      description: 'Deploying reliable cloud infrastructure, serverless functions, Amazon S3 storage buckets, CloudFront CDN edge caching, and automated Docker workflows.',
      skills: ['AWS Cloud', 'AWS Lambda', 'Amazon S3', 'CloudFront CDN', 'Docker Containers', 'CI/CD Pipelines', 'API Gateway', 'Cloud Security'],
      highlight: 'Cloud & Infrastructure',
      icon: <Cloud size={18} className="text-white" />,
      year: '2026',
    },
    {
      id: 'ai',
      category: 'Applied AI & ML',
      emblem: 'INTELLIGENCE',
      title: 'AI PIPELINES & LLMS',
      subtitle: 'Google Gemini API • Multimodal AI • Python • Vector Search',
      bgGradient: 'from-[#1a0a2a] via-[#2a0f3d] to-[#0a0a0f]',
      accentColor: 'from-purple-600/30 to-indigo-500/20',
      bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
      description: 'Integrating multimodal Google Gemini API pipelines, prompt engineering, structured JSON extraction, and intelligent content moderation engines.',
      skills: ['Google Gemini API', 'Multimodal Vision', 'Python & FastAPI', 'Prompt Engineering', 'Structured JSON', 'Vector Search', 'AI Verification', 'Context Caching'],
      highlight: 'Artificial Intelligence',
      icon: <Bot size={18} className="text-white" />,
      year: '2026',
    },
  ];

  const totalCards = stackCards.length;

  // Track pinned scroll progression to peel cards sequentially
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      const currentScroll = -rect.top;

      let progress = 0;
      if (totalScrollable > 0) {
        progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      }
      setScrollProgress(progress);

      const rawIndex = progress * (totalCards - 0.1);
      const activeIdx = Math.min(totalCards - 1, Math.floor(rawIndex));
      setActiveCardIdx(activeIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalCards]);

  const scrollToCard = (index) => {
    const container = containerRef.current;
    if (!container) return;
    const targetScroll = container.offsetTop + (index / (totalCards - 0.5)) * (container.offsetHeight - window.innerHeight);
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (selectedCard) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedCard(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedCard]);


  // Compute 3D deck stacking style matching the exact reference image
  const getCardDeckStyle = (index) => {
    const cardStep = 1 / totalCards;
    const cardStart = index * cardStep;

    if (index < activeCardIdx) {
      // PEELED AWAY UPWARDS
      return {
        transform: 'translate3d(0, -120%, 0) scale(0.94) rotateX(8deg)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 10 + index,
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease-out',
      };
    }

    if (index === activeCardIdx) {
      // ACTIVE FRONT DOMINANT CARD
      const progressInSlice = Math.max(0, (scrollProgress - cardStart) / cardStep);
      const isPeeling = progressInSlice > 0.72 && index < totalCards - 1;
      const peelFactor = isPeeling ? (progressInSlice - 0.72) / 0.28 : 0;

      const translateY = -peelFactor * 130;
      const scale = 1.0 - peelFactor * 0.04;
      const opacity = 1.0 - peelFactor * 0.75;
      const rotateX = peelFactor * 6;

      return {
        transform: `translate3d(0, ${translateY}px, 0) scale(${scale}) rotateX(${rotateX}deg)`,
        opacity: opacity,
        zIndex: 30,
        pointerEvents: 'auto',
        transition: isPeeling ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out',
      };
    }

    // PEEKING IN THE STACK BEHIND (MATCHING USER REFERENCE IMAGE)
    const offset = index - activeCardIdx;
    const translateY = -offset * 18;
    const scale = Math.max(0.86, 1 - offset * 0.035);
    const opacity = Math.max(0.4, 1 - offset * 0.15);
    const zIndex = 25 - offset;

    return {
      transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      pointerEvents: 'auto',
      transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease-out',
    };
  };

  return (
    <section 
      id="capabilities" 
      ref={containerRef}
      className="relative w-full h-[340vh] bg-[#050505] text-white z-20"
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 md:p-14 bg-[#050505]">
        
        {/* Ambient Dark Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-white/[0.012] rounded-full blur-[180px] pointer-events-none z-0" />

        {/* ========================================================================= */}
        {/* TOP HEADER HUD                                                            */}
        {/* ========================================================================= */}
        <div className="relative z-30 w-full max-w-4xl mx-auto flex items-center justify-between border-b border-white/10 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono tracking-widest text-zinc-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Core Capabilities</span>
          </div>

          {/* Interactive Deck Step Dots */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {stackCards.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => scrollToCard(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeCardIdx === idx 
                      ? 'w-6 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' 
                      : 'w-1.5 bg-white/20 hover:bg-white/50'
                  }`}
                  title={c.title}
                />
              ))}
            </div>

            <span className="text-xs font-mono text-zinc-400 font-medium hidden sm:inline">
              0{activeCardIdx + 1} / 0{totalCards}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STACKED CARD DECK (EXACT MATCH TO USER REFERENCE IMAGE)                   */}
        {/* ========================================================================= */}
        <div className="relative z-20 flex-1 flex items-center justify-center w-full max-w-2xl lg:max-w-3xl mx-auto my-auto perspective-1200 px-2 sm:px-4">
          <div className="relative w-full h-[360px] sm:h-[410px] md:h-[450px] flex items-center justify-center">
            
            {stackCards.map((card, index) => {
              const deckStyle = getCardDeckStyle(index);
              const isDominant = index === activeCardIdx;

              return (
                <div
                  key={card.id}
                  style={deckStyle}
                  onClick={() => {
                    if (!isDominant) {
                      scrollToCard(index);
                    }
                  }}
                  className="absolute inset-x-0 w-full cursor-pointer select-none"
                >
                  {/* Outer Card Body (Exact Reference: Dark Smoked Background with Rounded Corners) */}
                  <div className="w-full rounded-[20px] sm:rounded-[26px] md:rounded-[30px] p-2.5 sm:p-3 md:p-3.5 bg-[#121216] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.95)] transition-all duration-300 hover:border-white/35">
                    
                    {/* Widescreen Banner Image Area */}
                    <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden bg-black flex items-center justify-center">
                      
                      {/* Rich Banner Artwork & Gradient Overlay */}
                      <img
                        src={card.bannerImage}
                        alt={card.title}
                        className="w-full h-full object-cover filter contrast-125 brightness-75 opacity-70"
                      />
                      
                      {/* Subtle Noise Texture & Dark Vignette */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${card.bgGradient} opacity-85 mix-blend-multiply`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      {/* Center Decorative Divider & Refined Responsive Monogram Text */}
                      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 md:px-12">
                        <div className="w-full flex items-center justify-center gap-2.5 sm:gap-4 md:gap-6">
                          {/* Left Hairline Divider */}
                          <div className="flex-1 h-[1px] bg-white/35" />

                          {/* Center Monogram Typography — Scaled smoothly to fit screen sizes without overflowing */}
                          <span className="font-display font-extrabold text-base sm:text-2xl md:text-3xl lg:text-4xl text-white tracking-[0.14em] sm:tracking-[0.20em] uppercase text-center px-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] whitespace-nowrap">
                            {card.emblem}
                          </span>

                          {/* Right Hairline Divider */}
                          <div className="flex-1 h-[1px] bg-white/35" />
                        </div>
                      </div>

                    </div>

                    {/* Bottom Info Bar (Left Title/Subtitle, Right 'Read >' Pill) */}
                    <div className="pt-2.5 sm:pt-3.5 pb-1 px-2 sm:px-3 flex items-center justify-between gap-3 sm:gap-4">
                      
                      {/* Left: Project / Stack Title & Category */}
                      <div className="space-y-0.5 max-w-[68%] sm:max-w-[74%] min-w-0">
                        <h4 className="font-display font-bold text-xs sm:text-sm md:text-base text-white uppercase tracking-tight truncate">
                          {card.title}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] md:text-xs font-mono text-zinc-400 font-medium uppercase tracking-wider truncate">
                          {card.subtitle}
                        </p>
                      </div>

                      {/* Right: Pill Button (Exact Match: 'Read >') */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCard(card);
                        }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white text-black font-display font-bold text-[11px] sm:text-xs tracking-wide flex items-center gap-1 hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-[0_0_12px_rgba(255,255,255,0.3)] shrink-0 cursor-pointer"
                      >
                        <span>Read</span>
                        <ChevronRight size={13} className="text-black stroke-[3]" />
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM HUD                                                                */}
        {/* ========================================================================= */}
        <div className="relative z-30 w-full max-w-4xl mx-auto flex items-center justify-between border-t border-white/10 pt-3.5 text-xs font-mono text-zinc-400">
          <span className="text-[11px] text-zinc-500 uppercase tracking-wider">
            Scroll or tap to inspect
          </span>

          <div className="flex items-center gap-2 text-zinc-300 font-medium text-[11px] uppercase tracking-wider">
            <span>{stackCards[activeCardIdx].emblem}</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE FULL DETAILS MODAL WHEN CLICKING "Read >"                     */}
      {/* ========================================================================= */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 pointer-events-auto"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="relative w-full max-w-2xl liquid-glass rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col bg-[#0b0c10]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Pinned Header with Emblem & Close Button */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 bg-[#0b0c10]/95 backdrop-blur-xl border-b border-white/10 shrink-0 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-mono text-xs font-mono">
                <span className="text-white font-bold">{selectedCard.emblem}</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-300">{selectedCard.year}</span>
              </div>

              <button
                onClick={() => setSelectedCard(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Smooth Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6 overscroll-contain custom-modal-scroll">
              <div>
                <h3 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-white tracking-tight break-words leading-tight">
                  {selectedCard.title}
                </h3>
                <div className="text-xs sm:text-sm font-mono text-zinc-400 mt-1 break-words">
                  {selectedCard.subtitle}
                </div>
              </div>

              {/* Cover Banner */}
              <div className="w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-white/15 bg-black/40">
                <img
                  src={selectedCard.bannerImage}
                  alt={selectedCard.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                <div className="text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                  DISCIPLINE OVERVIEW:
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-body">
                  {selectedCard.description}
                </p>
              </div>

              {/* Core Technologies Checklist */}
              <div>
                <div className="text-xs font-mono text-zinc-300 uppercase tracking-wider mb-3 font-bold">
                  CORE TECHNOLOGIES & TOOLSETS:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCard.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <Check size={14} className="text-blue-400 shrink-0" />
                      <span className="text-xs font-mono text-zinc-200 font-medium break-words">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pinned Footer Actions */}
            <div className="p-4 sm:px-8 border-t border-white/10 bg-[#0b0c10]/95 backdrop-blur-xl flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedCard(null)}
                className="px-4 py-2 sm:px-5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Close
              </button>
              <a
                href="#contact"
                onClick={() => setSelectedCard(null)}
                className="px-5 py-2 sm:px-6 sm:py-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 cursor-pointer"
              >
                Discuss Tech Stack
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
