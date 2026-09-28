import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Sparkles, Layers, Cpu, Compass, ArrowDown, User, Zap, Terminal } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

const TOTAL_FRAMES = 180;
const FRAME_PATH = '/frames/frame_';

export default function HeroScrollCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const imagesRef = useRef([]);
  
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [useVideoFallback, setUseVideoFallback] = useState(false);

  // Helper to render a specific frame onto canvas
  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (img && img.complete && img.naturalWidth > 0) {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover scaling math to ensure full bleed without distortion
      const hRatio = cw / iw;
      const vRatio = ch / ih;
      const ratio = Math.max(hRatio, vRatio);

      const centerShiftX = (cw - iw * ratio) / 2;
      const centerShiftY = (ch - ih * ratio) / 2;

      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(
        img,
        0,
        0,
        iw,
        ih,
        centerShiftX,
        centerShiftY,
        iw * ratio,
        ih * ratio
      );
    }
  };

  // Preload frames with immediate first-frame paint
  useEffect(() => {
    let isMounted = true;
    const loadedImages = new Array(TOTAL_FRAMES);
    imagesRef.current = loadedImages;
    let loadedCount = 0;

    // Load Frame 0 first for instant paint
    const img0 = new Image();
    img0.src = `${FRAME_PATH}0000.webp`;
    img0.onload = () => {
      if (!isMounted) return;
      loadedImages[0] = img0;
      loadedCount++;
      renderFrame(0);
      setIsLoaded(true);
    };
    img0.onerror = () => {
      setUseVideoFallback(true);
      setIsLoaded(true);
    };

    // Load the rest of the frames in background
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i === 0) continue;
      const img = new Image();
      const frameNum = String(i).padStart(4, '0');
      img.src = `${FRAME_PATH}${frameNum}.webp`;

      img.onload = () => {
        if (!isMounted) return;
        loadedImages[i] = img;
        loadedCount++;
        const progress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        setLoadProgress(progress);
      };

      img.onerror = () => {
        if (!isMounted) return;
        loadedCount++;
        if (loadedCount > 20 && loadedImages.filter(Boolean).length < 5) {
          setUseVideoFallback(true);
        }
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Resize handler for sharp retina display rendering
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }

      renderFrame(currentFrameIndex);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [currentFrameIndex]);

  // Frame Scroll Synchronization with Lerp
  useEffect(() => {
    let animationFrameId;
    let targetFrame = 0;
    let renderedFrame = 0;

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
      targetFrame = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));

      if (useVideoFallback && videoRef.current && videoRef.current.duration) {
        videoRef.current.currentTime = progress * videoRef.current.duration;
      }
    };

    const renderLoop = () => {
      if (renderedFrame !== targetFrame) {
        const diff = targetFrame - renderedFrame;
        const step = diff > 0 ? Math.ceil(diff * 0.35) : Math.floor(diff * 0.35);
        renderedFrame += step;

        setCurrentFrameIndex(renderedFrame);
        renderFrame(renderedFrame);
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    renderLoop();
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [useVideoFallback]);

  // Helper smoothstep opacity & translation calculation
  const getPhaseStyle = (start, peakStart, peakEnd, end, dir = 'left') => {
    if (scrollProgress < start || scrollProgress > end) {
      return { 
        opacity: 0, 
        transform: `translateX(${dir === 'left' ? '-100px' : '100px'})`, 
        pointerEvents: 'none',
        display: 'none'
      };
    }

    let opacity = 0;
    let translateX = 0;

    if (scrollProgress < peakStart) {
      const factor = (scrollProgress - start) / (peakStart - start);
      opacity = factor;
      translateX = (1 - factor) * (dir === 'left' ? -50 : 50);
    } else if (scrollProgress <= peakEnd) {
      opacity = 1;
      translateX = 0;
    } else {
      const factor = (end - scrollProgress) / (end - peakEnd);
      opacity = factor;
      translateX = (1 - factor) * (dir === 'left' ? -70 : 70);
    }

    return {
      opacity: Math.max(0, Math.min(1, opacity)),
      transform: `translateX(${translateX}px)`,
      display: 'block',
      transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
    };
  };

  // Phase 0 Initial Hero
  const initialLeftStyle = {
    opacity: Math.max(0, 1 - scrollProgress * 7),
    transform: `translateX(${-scrollProgress * 250}px)`,
    display: scrollProgress > 0.16 ? 'none' : 'block',
    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
    pointerEvents: scrollProgress > 0.12 ? 'none' : 'auto',
  };

  const initialRightStyle = {
    opacity: Math.max(0, 1 - scrollProgress * 7),
    transform: `translateX(${scrollProgress * 250}px)`,
    display: scrollProgress > 0.16 ? 'none' : 'block',
    transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
    pointerEvents: scrollProgress > 0.12 ? 'none' : 'auto',
  };

  // Chapter 1: Who Am I [0.18 - 0.40]
  const ch1LeftStyle = getPhaseStyle(0.18, 0.23, 0.35, 0.41, 'left');
  const ch1RightStyle = getPhaseStyle(0.18, 0.23, 0.35, 0.41, 'right');

  // Chapter 2: What Can I Do [0.43 - 0.65]
  const ch2LeftStyle = getPhaseStyle(0.43, 0.48, 0.59, 0.65, 'left');
  const ch2RightStyle = getPhaseStyle(0.43, 0.48, 0.59, 0.65, 'right');

  // Chapter 3: What I've Been Working On [0.67 - 0.86]
  const ch3LeftStyle = getPhaseStyle(0.67, 0.72, 0.82, 0.87, 'left');
  const ch3RightStyle = getPhaseStyle(0.67, 0.72, 0.82, 0.87, 'right');

  // Helper for mobile vertical fade & morph phases
  const getMobilePhaseStyle = (start, peakStart, peakEnd, end) => {
    if (scrollProgress < start || scrollProgress > end) {
      return { 
        opacity: 0, 
        transform: 'translate3d(0, 30px, 0) scale(0.95)', 
        pointerEvents: 'none',
        display: 'none'
      };
    }

    let opacity = 0;
    let translateY = 0;
    let scale = 1;

    if (scrollProgress < peakStart) {
      const factor = (scrollProgress - start) / (peakStart - start);
      opacity = factor;
      translateY = (1 - factor) * 25;
      scale = 0.95 + factor * 0.05;
    } else if (scrollProgress <= peakEnd) {
      opacity = 1;
      translateY = 0;
      scale = 1.0;
    } else {
      const factor = (end - scrollProgress) / (end - peakEnd);
      opacity = factor;
      translateY = (1 - factor) * -25;
      scale = 1.0 + (1 - factor) * 0.04;
    }

    return {
      opacity: Math.max(0, Math.min(1, opacity)),
      transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
      display: 'flex',
      transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
    };
  };

  // Mobile Sequential Phases
  const mobPhase0Style = getMobilePhaseStyle(0.00, 0.00, 0.16, 0.23);
  const mobPhase1Style = getMobilePhaseStyle(0.23, 0.29, 0.39, 0.45);
  const mobPhase2Style = getMobilePhaseStyle(0.45, 0.51, 0.61, 0.67);
  const mobPhase3Style = getMobilePhaseStyle(0.67, 0.73, 0.81, 0.86);

  // Phase 4: Final White Background Meshed Typography [0.87 - 1.00]
  const isFinale = scrollProgress >= 0.87;
  const finaleOpacity = isFinale ? Math.min(1, (scrollProgress - 0.87) / 0.08) : 0;
  const finaleScale = 0.95 + finaleOpacity * 0.05;

  return (
    <section 
      id="hero" 
      ref={containerRef} 
      className="relative w-full h-[550vh] bg-[#050505]"
    >
      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#050505]">
        
        {/* Ambient Dark Radial Glow */}
        <div 
          className="absolute inset-0 bg-radial-glow pointer-events-none z-0 transition-opacity duration-700" 
          style={{ opacity: 1 - finaleOpacity }}
        />

        {/* The Frame-by-Frame HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-10 filter contrast-[1.05] brightness-[0.97]"
        />

        {/* Fallback Video Player */}
        {useVideoFallback && (
          <video
            ref={videoRef}
            src="/animation.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        )}

        {/* Cinematic Dark Vignette */}
        <div 
          className="absolute inset-0 hero-vignette z-20 pointer-events-none transition-opacity duration-500"
          style={{ opacity: 1 - finaleOpacity * 0.9 }}
        />
        <div 
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent z-20 pointer-events-none transition-opacity duration-500"
          style={{ opacity: 1 - finaleOpacity }}
        />
        <div 
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#050505] via-[#050505]/50 to-transparent z-20 pointer-events-none transition-opacity duration-500"
          style={{ opacity: 1 - finaleOpacity }}
        />

        {/* ========================================================================= */}
        {/* HERO EDITORIAL MONOCHROME TYPOGRAPHY (SILVER & WHITE CONTRAST)            */}
        {/* ========================================================================= */}
        <div className="relative z-30 w-full h-full max-w-7xl mx-auto px-4 sm:px-8 md:px-14 flex flex-col justify-between py-12 sm:py-16 md:py-24 pointer-events-none">
          
          {/* ========================================================================= */}
          {/* MOBILE-ONLY VIEW: DYNAMIC SCROLL PHASES (LOCKED IN CENTER)                */}
          {/* ========================================================================= */}
          <div className="flex md:hidden relative w-full flex-1 items-center justify-center select-none min-h-[340px]">
            {!isFinale && (
              <>
                {/* MOBILE PHASE 0: RAJAN + Gaur */}
                <div 
                  style={mobPhase0Style}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
                >
                  {/* Overlapping Lockup (Reference: Untangling Spaghetti) */}
                  <div className="relative inline-flex flex-col items-center select-none my-1">
                    <div className="relative z-10">
                      <span className="hero-bold-title text-6xl sm:text-7xl">
                        RAJAN
                      </span>
                    </div>
                    <div className="relative z-0 -mt-5 sm:-mt-7 ml-10 sm:ml-16 pointer-events-none transform -rotate-4">
                      <span className="hero-tubular-script text-5xl sm:text-6xl text-blue-400">
                        Gaur
                      </span>
                    </div>
                  </div>

                  <p className="hero-obsidian-sub text-xs sm:text-sm font-mono uppercase mt-4 max-w-xs leading-relaxed">
                    Full Stack Architect & Digital Product Builder
                  </p>
                </div>

                {/* MOBILE PHASE 1: REALITY + Over Theory */}
                <div 
                  style={mobPhase1Style}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
                >
                  <div className="relative inline-flex flex-col items-center select-none my-1">
                    <div className="relative z-10">
                      <span className="hero-bold-title text-5xl sm:text-6xl">
                        REALITY
                      </span>
                    </div>
                    <div className="relative z-0 -mt-4 sm:-mt-6 ml-8 sm:ml-14 pointer-events-none transform -rotate-4">
                      <span className="hero-tubular-script text-4xl sm:text-5xl text-blue-400">
                        Over Theory
                      </span>
                    </div>
                  </div>

                  <p className="hero-obsidian-sub text-xs sm:text-sm font-mono uppercase mt-4 max-w-xs leading-relaxed">
                    Engineering high-performance software with relentless clarity & purpose.
                  </p>
                </div>

                {/* MOBILE PHASE 2: FLUTTER + & Cloud */}
                <div 
                  style={mobPhase2Style}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
                >
                  <div className="relative inline-flex flex-col items-center select-none my-1">
                    <div className="relative z-10">
                      <span className="hero-bold-title text-5xl sm:text-6xl">
                        FLUTTER
                      </span>
                    </div>
                    <div className="relative z-0 -mt-4 sm:-mt-6 ml-8 sm:ml-14 pointer-events-none transform -rotate-4">
                      <span className="hero-tubular-script text-4xl sm:text-5xl text-blue-400">
                        & Cloud
                      </span>
                    </div>
                  </div>

                  <p className="hero-obsidian-sub text-xs sm:text-sm font-mono uppercase mt-4 max-w-xs leading-relaxed">
                    60 FPS mobile architectures, cloud microservices & generative AI pipelines.
                  </p>
                </div>

                {/* MOBILE PHASE 3: SYSTEMS + Engineered */}
                <div 
                  style={mobPhase3Style}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
                >
                  <div className="relative inline-flex flex-col items-center select-none my-1">
                    <div className="relative z-10">
                      <span className="hero-bold-title text-5xl sm:text-6xl">
                        SYSTEMS
                      </span>
                    </div>
                    <div className="relative z-0 -mt-4 sm:-mt-6 ml-8 sm:ml-14 pointer-events-none transform -rotate-4">
                      <span className="hero-tubular-script text-4xl sm:text-5xl text-blue-400">
                        Engineered
                      </span>
                    </div>
                  </div>

                  <p className="hero-obsidian-sub text-xs sm:text-sm font-mono uppercase mt-4 max-w-xs leading-relaxed">
                    ResQ Meal, EV - Exam Vault, SarthX & AWS Infrastructure.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* ========================================================================= */}
          {/* DESKTOP-ONLY VIEW: 12-COLUMN EDITORIAL CHAPTER GRID                       */}
          {/* ========================================================================= */}
          <div className="hidden md:grid md:grid-cols-12 gap-6 items-center flex-1 my-auto relative">
            
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: SILVER + WHITE MONOCHROME HEADINGS               */}
            {/* ------------------------------------------------------------- */}
            <div className="md:col-span-4 flex flex-col justify-center text-left relative">
              
              {/* PHASE 0: INITIAL HERO LEFT */}
              {scrollProgress <= 0.16 && (
                <div style={initialLeftStyle} className="space-y-4 max-w-md drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-blue">
                    <span className="w-2 h-2 rounded-full glow-dot-blue animate-pulse" />
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase font-bold text-blue-200">
                      {portfolioData.hero.initial.left.tag}
                    </span>
                  </div>

                  <div className="relative inline-flex flex-col items-start select-none my-1">
                    <div className="relative z-10">
                      <h1 className="hero-bold-title text-5xl lg:text-6xl">
                        PRODUCTS
                      </h1>
                    </div>
                    <div className="relative z-0 -mt-4 lg:-mt-5 ml-8 lg:ml-12 pointer-events-none transform -rotate-4">
                      <span className="hero-tubular-script text-4xl lg:text-5xl text-blue-400">
                        From Scratch
                      </span>
                    </div>
                  </div>

                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-body font-normal max-w-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pt-2">
                    {portfolioData.hero.initial.left.description}
                  </p>

                  <div className="pt-2 flex items-center gap-3 text-xs font-mono text-zinc-300 font-medium">
                    <span className="text-blue-400 font-semibold">FULL STACK</span>
                    <span>•</span>
                    <span>FLUTTER</span>
                    <span>•</span>
                    <span>AWS CLOUD</span>
                  </div>
                </div>
              )}

              {/* CHAPTER 1: WHO I AM */}
              <div style={ch1LeftStyle} className="space-y-4 max-w-md drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-blue">
                  <span className="w-2 h-2 rounded-full glow-dot-blue animate-ping" />
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase font-bold text-blue-200">
                    {portfolioData.hero.chapters[0].step}
                  </span>
                </div>

                <div className="relative inline-flex flex-col items-start select-none my-1">
                  <div className="relative z-10">
                    <h2 className="hero-bold-title text-5xl lg:text-6xl">
                      REALITY
                    </h2>
                  </div>
                  <div className="relative z-0 -mt-4 lg:-mt-5 ml-8 lg:ml-12 pointer-events-none transform -rotate-4">
                    <span className="hero-tubular-script text-4xl lg:text-5xl text-blue-400">
                      Over Theory
                    </span>
                  </div>
                </div>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-body font-normal max-w-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pt-2">
                  {portfolioData.hero.chapters[0].left.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-mono text-blue-300 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full glow-dot-blue animate-ping" />
                  <span>ACTION OVER THEORY</span>
                </div>
              </div>

              {/* CHAPTER 2: WHAT CAN I DO */}
              <div style={ch2LeftStyle} className="space-y-4 max-w-md drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-blue">
                  <Zap size={12} className="text-blue-400" />
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase font-bold text-blue-200">
                    {portfolioData.hero.chapters[1].step}
                  </span>
                </div>

                <div className="relative inline-flex flex-col items-start select-none my-1">
                  <div className="relative z-10">
                    <h2 className="hero-bold-title text-5xl lg:text-6xl">
                      FLUTTER
                    </h2>
                  </div>
                  <div className="relative z-0 -mt-4 lg:-mt-5 ml-8 lg:ml-12 pointer-events-none transform -rotate-4">
                    <span className="hero-tubular-script text-4xl lg:text-5xl text-blue-400">
                      & Cloud
                    </span>
                  </div>
                </div>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-body font-normal max-w-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pt-2">
                  {portfolioData.hero.chapters[1].left.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["React.js", "TypeScript", "Flutter", "Tailwind"].map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-blue-950/40 border border-blue-500/30 text-[10px] font-mono text-blue-200 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CHAPTER 3: WHAT I'VE BEEN WORKING ON */}
              <div style={ch3LeftStyle} className="space-y-4 max-w-md drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-blue">
                  <Terminal size={12} className="text-blue-400" />
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase font-bold text-blue-200">
                    {portfolioData.hero.chapters[2].step}
                  </span>
                </div>

                <div className="relative inline-flex flex-col items-start select-none my-1">
                  <div className="relative z-10">
                    <h2 className="hero-bold-title text-5xl lg:text-6xl">
                      SYSTEMS
                    </h2>
                  </div>
                  <div className="relative z-0 -mt-4 lg:-mt-5 ml-8 lg:ml-12 pointer-events-none transform -rotate-4">
                    <span className="hero-tubular-script text-4xl lg:text-5xl text-blue-400">
                      Engineered
                    </span>
                  </div>
                </div>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-body font-normal max-w-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] pt-2">
                  {portfolioData.hero.chapters[2].left.description}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-blue-300 font-semibold">
                  <span>FLAGSHIP • FULL STACK • PRODUCTION</span>
                </div>
              </div>

            </div>

            {/* ------------------------------------------------------------- */}
            {/* CENTER COLUMN: STRICTLY EMPTY (GIVES FULL STAGE TO THE MAN)   */}
            {/* ------------------------------------------------------------- */}
            <div className="hidden md:block md:col-span-4 h-full pointer-events-none">
              {/* Intentionally completely clear for central character presence */}
            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: SILVER + WHITE MONOCHROME HEADINGS              */}
            {/* ------------------------------------------------------------- */}
            <div className="md:col-span-4 flex flex-col justify-center text-left md:text-right md:items-end relative">
              
              {/* PHASE 0: INITIAL HERO RIGHT */}
              {scrollProgress <= 0.16 && (
                <div style={initialRightStyle} className="space-y-4 md:items-end max-w-md drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-mono">
                    <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase font-bold text-zinc-200">
                      {portfolioData.hero.initial.right.tag}
                    </span>
                    <Layers size={12} className="text-white" />
                  </div>

                  <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-[44px] leading-[1.08] tracking-tight uppercase">
                    <span className="text-silver-gradient">SYSTEMS OF </span>
                    <span className="text-white-gradient">COMPLETE VALUE</span>
                  </h2>

                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-body font-normal max-w-sm md:ml-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {portfolioData.hero.initial.right.description}
                  </p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-mono text-zinc-300 md:justify-end">
                    <span>AUTHENTICATION</span>
                    <span>•</span>
                    <span>DATABASES</span>
                    <span>•</span>
                    <span>AI</span>
                  </div>
                </div>
              )}

              {/* CHAPTER 1 RIGHT: ETHOS */}
              <div style={ch1RightStyle} className="space-y-4 md:items-end max-w-md drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-mono">
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase font-bold text-zinc-200">
                    {portfolioData.hero.chapters[0].right.tag}
                  </span>
                  <Compass size={12} className="text-white" />
                </div>

                <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-[44px] leading-[1.08] tracking-tight uppercase">
                  <span className="text-silver-gradient">SOLVING REAL </span>
                  <span className="text-white-gradient">PRACTICAL PROBLEMS</span>
                </h3>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-body font-normal max-w-sm md:ml-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {portfolioData.hero.chapters[0].right.description}
                </p>

                <div className="pt-1 text-xs font-mono text-zinc-300 font-semibold">
                  [ LOGIC & ACCURACY OVER PRAISE ]
                </div>
              </div>

              {/* CHAPTER 2 RIGHT: CLOUD & AI INTEGRATION */}
              <div style={ch2RightStyle} className="space-y-4 md:items-end max-w-md drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-mono">
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase font-bold text-zinc-200">
                    {portfolioData.hero.chapters[1].right.tag}
                  </span>
                  <Cpu size={12} className="text-white" />
                </div>

                <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-[44px] leading-[1.08] tracking-tight uppercase">
                  <span className="text-silver-gradient">FIREBASE, AWS & </span>
                  <span className="text-white-gradient">GEMINI AI</span>
                </h3>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-body font-normal max-w-sm md:ml-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {portfolioData.hero.chapters[1].right.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 md:justify-end">
                  {["AWS Academy", "Firebase Auth", "Firestore", "Gemini API"].map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono text-zinc-200 font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CHAPTER 3 RIGHT: TRACK RECORD */}
              <div style={ch3RightStyle} className="space-y-4 md:items-end max-w-md drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-mono">
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase font-bold text-zinc-200">
                    {portfolioData.hero.chapters[2].right.tag}
                  </span>
                  <Sparkles size={12} className="text-white" />
                </div>

                <h3 className="font-display font-black text-3xl sm:text-4xl lg:text-[44px] leading-[1.08] tracking-tight uppercase">
                  <span className="text-silver-gradient">SCALING TOWARD </span>
                  <span className="text-white-gradient">SYSTEM DESIGN & AWS</span>
                </h3>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-body font-normal max-w-sm md:ml-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {portfolioData.hero.chapters[2].right.description}
                </p>

                <div className="pt-1 text-xs font-mono text-zinc-300 font-semibold">
                  ● SYSTEM DESIGN & SCALABILITY
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* GRAND WHITE VIDEO FINALE (HIGH-CONTRAST MONOCHROME TYPOGRAPHY)            */}
          {/* ========================================================================= */}
          {isFinale && (
            <div 
              className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
              style={{
                opacity: finaleOpacity,
                transform: `scale(${finaleScale})`,
                transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
              }}
            >
              <div className="space-y-5 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#08080c]/90 border border-blue-500/40 text-xs font-mono tracking-widest uppercase font-bold text-blue-200 shadow-2xl backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full glow-dot-blue animate-pulse" />
                  <span>PRODUCT BUILDER ARCHIVE</span>
                </div>

                {/* Finale Lockup: RAJAN GAUR + Let's Build */}
                <div className="relative inline-flex flex-col items-center select-none my-2">
                  <div className="relative z-10">
                    <h2 className="hero-bold-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.95)]">
                      RAJAN GAUR
                    </h2>
                  </div>
                  <div className="relative z-0 -mt-6 sm:-mt-8 md:-mt-10 ml-12 sm:ml-24 pointer-events-none transform -rotate-4">
                    <span className="hero-tubular-script text-4xl sm:text-6xl md:text-7xl text-blue-400 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                      Let's Build
                    </span>
                  </div>
                </div>

                {/* High-Contrast Obsidian Glass Badge Pills for Professional Credentials */}
                <div className="pt-2 pb-1 flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08080c]/90 border border-white/20 shadow-xl backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-white tracking-wider uppercase">
                      BCA Student
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08080c]/90 border border-white/20 shadow-xl backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-white tracking-wider uppercase">
                      Full Stack Developer
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08080c]/90 border border-white/20 shadow-xl backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-white tracking-wider uppercase">
                      Flutter Developer
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08080c]/90 border border-white/20 shadow-xl backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                    <span className="font-mono text-[11px] sm:text-xs font-bold text-white tracking-wider uppercase">
                      Cloud & AI Product Builder
                    </span>
                  </div>
                </div>

                <div className="pt-6 flex flex-col items-center gap-2">
                  <a
                    href="#projects"
                    className="pointer-events-auto inline-flex items-center gap-2 px-8 py-3.5 rounded-full btn-blue-primary text-white font-mono text-xs font-bold tracking-widest uppercase transition-all active:scale-95 shadow-xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:-translate-y-0.5"
                  >
                    <span>CONTINUE TO PORTFOLIO</span>
                    <ArrowDown size={15} className="text-white animate-bounce" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* BOTTOM SCROLL INVITATION                                      */}
          {/* ------------------------------------------------------------- */}
          <div 
            className="flex items-center justify-center pt-2 transition-opacity duration-300 pointer-events-none"
            style={{ opacity: isFinale ? 0 : 1 }}
          >
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-zinc-300 font-semibold tracking-widest uppercase animate-bounce">
              <span>{portfolioData.hero.scrollHint}</span>
              <ChevronDown size={13} className="text-white" />
            </div>
          </div>

        </div>

        {/* Initial Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center gap-4">
            <div className="font-display font-black text-2xl tracking-tighter text-white animate-pulse">
              RAJAN GAUR
            </div>
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-200"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <span className="font-mono text-xs text-zinc-400 tracking-widest uppercase">
              INITIALIZING ENGINE [{loadProgress}%]
            </span>
          </div>
        )}

      </div>
    </section>
  );
}
