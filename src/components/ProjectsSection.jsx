import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, ExternalLink, Globe, ArrowUpRight, ChevronRight, Github } from 'lucide-react';
import InfiniteGallery from './ui/3d-gallery-photography';
import { portfolioData } from '../data/portfolioData';

// ─────────────────────────────────────────────────────────────
// Exactly 6 Curated Showcase Projects (Flagship + Architectures)
// ─────────────────────────────────────────────────────────────
const showcaseProjects = [
  // 01: Flagship Social Impact
  portfolioData.projects[0] || {
    id: 'resq-meal',
    badge: 'FLAGSHIP SOCIAL PRODUCT',
    title: 'RESQ MEAL',
    subtitle: 'Food Waste Reduction & Logistics Platform',
    tagline: 'Food Waste Reduction & Redistribution Network',
    category: 'Full Stack Platform / Social Impact',
    year: '2025',
    architecture: 'React.js • Tailwind CSS • Firebase Auth & Firestore • Cloudinary CDN',
    description: 'A comprehensive dual-sided platform connecting food businesses, event organizers, and households with NGOs and shelters to redistribute surplus edible food and eliminate community waste.',
    problem: 'Massive amounts of edible food are wasted daily from events and commercial food centers while local shelters face constant resource scarcity due to fragmented logistics.',
    solution: 'Engineered an instantaneous matching and pickup workflow with verification, real-time availability tracking, and automated donation receipts.',
    features: [
      'Hyper-local donor-to-NGO matching based on real-time distance and food expiry windows.',
      'Role-based dual dashboards for Donors (listing & history) and NGOs (claim & dispatch).',
      'Automated impact analytics calculating total kilograms of food saved and meals served.',
      'Firebase Firestore real-time listener updates for instantaneous claim notifications.'
    ],
    tech: ['React.js', 'Firebase', 'Firestore', 'Tailwind CSS', 'Cloudinary', 'Vite'],
    image: '/projects/resq-meal.jpg',
    cardImage: '/project-cards/resq-meal.jpg',
    liveUrl: 'https://resqmeal.pages.dev',
    githubUrl: 'https://github.com/RajanGaur01/Rj-portfolio',
  },
  // 02: Flagship AI Platform
  portfolioData.projects[1] || {
    id: 'ev-educational-platform',
    badge: 'AI-POWERED PLATFORM',
    title: 'EV - EXAM VAULT',
    subtitle: 'AI-Powered Exam Preparation & Question Vault',
    tagline: 'AI-Assisted Exam Preparation & Knowledge Vault',
    category: 'Full Stack Web & AI Workflow',
    year: '2024',
    architecture: 'React.js • Google Gemini API • Firebase Firestore • Cloudinary',
    description: 'An AI-powered academic exam preparation platform and question vault that leverages the Google Gemini API to analyze, review, and evaluate exam practice modules.',
    problem: 'Students and educators struggle with unstructured exam archives, manual question validation, and lack of real-time AI feedback.',
    solution: 'Integrated an automated AI assessment pipeline with Gemini API for dynamic question generation, solution validation, and mock exam grading.',
    features: [
      'Google Gemini API integration for automated question validation and solution hints.',
      'Tiered user workflows: Students, Educators, and Content Reviewers.',
      'Cloudinary CDN integration for high-clarity diagrams, formulas, and mock papers.',
      'Interactive exam timers and performance analytics dashboard.'
    ],
    tech: ['React.js', 'Gemini API', 'Firebase', 'Tailwind CSS', 'Cloudinary', 'JavaScript'],
    image: '/projects/ev-platform.jpg',
    cardImage: '/project-cards/ev-platform.jpg',
    liveUrl: 'https://examvault.me',
    githubUrl: 'https://github.com/RajanGaur01/EV-Exam-Vault',
  },
  // 03: Flagship Mobile App & Platform
  portfolioData.projects[2] || {
    id: 'sarthx',
    badge: 'FLAGSHIP PLATFORM & APP',
    title: 'SARTHX',
    subtitle: 'GPS Geofenced Attendance & Emergency Dispatch Platform',
    tagline: 'Location-Verified Field Operations & Emergency Alerts',
    category: 'Full Stack & Mobile Platform',
    year: '2024',
    architecture: 'Flutter (Dart) • Geolocator API • SQLite / Local State • Custom Algorithms',
    description: 'A comprehensive operations and workforce management platform designed for distributed field teams, featuring real-time geofenced check-ins, automated payroll computation, and emergency dispatch alerts.',
    problem: 'Manual attendance systems and generic punch clocks lead to time-theft, inaccurate overtime logging, and hours of manual payroll calculation errors.',
    solution: 'Developed an integrated Flutter mobile and web system that calculates exact working durations through location-verified checkouts and dynamic salary calculation formulas.',
    features: [
      'Precise geofencing and GPS radius validation to prevent remote false check-ins.',
      'Automated check-out logic and overtime computation with dynamic day/night shift rates.',
      'Transparent payroll engine accounting for unapproved leaves and half-day penalties.',
      'Responsive web dashboard and Material 3 mobile UI with daily attendance heatmaps.'
    ],
    tech: ['Flutter', 'React', 'Firebase', 'Android SDK', 'Geolocator', 'Tailwind CSS'],
    image: '/projects/sarthx.jpg',
    cardImage: '/project-cards/sarthx.jpg',
    liveUrl: 'https://sarthx.vercel.app',
    githubUrl: 'https://github.com/RajanGaur01/SarthX',
  },
  // 04: Cloud Architecture
  {
    id: 'cloud-platform',
    badge: 'INFRASTRUCTURE ARCHITECTURE',
    title: 'AWS CLOUD ARCHITECTURE',
    subtitle: 'Serverless microservices, Lambda functions, and S3 edge distribution.',
    tagline: 'Serverless microservices & edge distribution',
    category: 'Cloud & Infrastructure',
    year: '2026',
    architecture: 'AWS Lambda • S3 • CloudFront • CI/CD',
    description: 'High-availability cloud infrastructure for scalable full-stack applications with automated deployment pipelines.',
    problem: 'High-availability infrastructure for scalable full-stack applications.',
    solution: 'Configured AWS Lambda, S3 storage buckets, CloudFront CDN, and CI/CD pipelines.',
    features: ['Automated CI/CD', 'Serverless Functions', 'Zero-Downtime Deployment', 'Edge Caching'],
    tech: ['AWS Cloud', 'Node.js', 'Docker', 'REST APIs', 'CloudFront'],
    image: '/projects/aws-cloud.jpg',
    cardImage: '/project-cards/aws-cloud.jpg',
  },
  // 05: Multimodal Intelligence
  {
    id: 'ai-vision-lab',
    badge: 'INTELLIGENCE PIPELINE',
    title: 'GEMINI AI VISION LAB',
    subtitle: 'Multimodal AI extraction pipelines and real-time prompt streaming.',
    tagline: 'Multimodal AI extraction & streaming',
    category: 'Artificial Intelligence',
    year: '2026',
    architecture: 'Gemini API • Python • FastAPI • React',
    description: 'Structured JSON extraction pipelines with Google Gemini API for real-time multimodal inference.',
    problem: 'Connecting complex multimodal AI models with real-time UI/UX state.',
    solution: 'Built structured JSON extraction pipelines with Google Gemini API & streaming output.',
    features: ['Streaming Inference', 'Context Caching', 'Visual Recognition', 'Structured Output'],
    tech: ['Gemini AI API', 'Python', 'React', 'FastAPI', 'Vector Embeddings'],
    image: '/projects/gemini-ai.jpg',
    cardImage: '/project-cards/gemini-ai.jpg',
  },
  // 06: High-Performance Mobile UX
  {
    id: 'flutter-ux',
    badge: 'MOBILE ENGINE ARCHITECTURE',
    title: 'FLUTTER MOBILE UX',
    subtitle: '60 FPS cross-platform mobile architectures with offline state cache.',
    tagline: '60 FPS mobile architecture & offline cache',
    category: 'Mobile Engineering',
    year: '2026',
    architecture: 'Flutter • Dart • Bloc • Android SDK',
    description: 'Custom Flutter render objects with Bloc state trees and local Hive cache for 60 FPS performance.',
    problem: 'Delivering 60 FPS mobile transitions across Android devices without stutter.',
    solution: 'Engineered custom Flutter render objects, Bloc state trees, and local Hive cache.',
    features: ['60 FPS Animations', 'Offline Sync', 'Custom Painters', 'Cross-Platform'],
    tech: ['Flutter', 'Dart', 'Bloc Pattern', 'Android SDK', 'Hive DB'],
    image: '/projects/flutter-ux.jpg',
    cardImage: '/project-cards/flutter-ux.jpg',
  },
];

export default function ProjectsSection() {
  const containerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Gallery items for the 3D WebGL Scene
  const galleryImages = showcaseProjects.map((p) => ({
    src: p.cardImage || `/project-cards/${p.id}.jpg`,
    alt: p.title,
    project: p,
  }));

  // Synchronize Section Scroll Progress directly to Page Scroll
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

      // Map progress across 6 distinct projects (0 to 5)
      const total = showcaseProjects.length;
      const idx = Math.min(total - 1, Math.floor(progress * total));
      setActiveProjectIndex(idx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle active plane change from Three.js scene
  const handleActiveIndexChange = useCallback((index) => {
    setActiveProjectIndex(index);
  }, []);

  // Handle card click to open deep-dive modal
  const handleSelectImage = useCallback((index) => {
    const p = showcaseProjects[index % showcaseProjects.length];
    if (p) {
      setSelectedProject(p);
    }
  }, []);

  // Jump to specific project by scrolling directly to its segment
  const handleDotClick = (index) => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollable = container.offsetHeight - window.innerHeight;
    const targetScroll = container.offsetTop + (index / (showcaseProjects.length - 1)) * totalScrollable;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedProject(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [selectedProject]);

  const activeProject = showcaseProjects[activeProjectIndex] || showcaseProjects[0];

  return (
    <section 
      id="projects" 
      ref={containerRef}
      className="relative h-[550vh] w-full bg-[#050505] text-white z-20"
    >
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* STICKY FULLSCREEN 3D WEBGL STAGE                            */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between bg-[#050505] select-none">
        
        {/* ─── 3D WEBGL GALLERY CANVAS (DRIVEN DIRECTLY BY SCROLL) ─── */}
        <div className="absolute inset-0 w-full h-full z-10">
          <InfiniteGallery
            images={galleryImages}
            scrollProgress={scrollProgress}
            activeIndex={activeProjectIndex}
            onSelectImage={handleSelectImage}
            onActiveIndexChange={handleActiveIndexChange}
            className="w-full h-full"
          />
        </div>

        {/* ─── TOP HEADER HUD ─── */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-8 flex items-center justify-between pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono tracking-widest pointer-events-auto backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-zinc-200 font-semibold tracking-wider uppercase text-[11px]">Selected Works</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-zinc-400 pointer-events-auto">
            <div className="px-3 py-1 rounded-full bg-black/60 border border-white/12 text-zinc-200 font-medium backdrop-blur-md text-[11px]">
              <span className="text-blue-400 font-bold">{String(activeProjectIndex + 1).padStart(2, '0')}</span>
              <span className="text-zinc-500 mx-1">/</span>
              <span className="text-zinc-400">06</span>
            </div>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="hidden sm:inline text-zinc-300 font-normal">{activeProject.category}</span>
          </div>
        </div>

        {/* ─── CENTER DYNAMIC EXCLUSION TYPOGRAPHY (EXACT VIDEO MATCH) ─── */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center px-4 mix-blend-exclusion text-white z-20">
          <h1 
            key={activeProject.id}
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] tracking-tight select-none animate-in fade-in zoom-in-95 duration-500 font-light italic leading-none"
            style={{
              fontStyle: 'italic',
              fontWeight: 300,
              letterSpacing: '-0.02em',
            }}
          >
            {activeProject.title}
          </h1>

          <p className="mt-3 sm:mt-5 text-xs sm:text-sm font-mono tracking-widest uppercase opacity-80 max-w-md px-4">
            {activeProject.tagline}
          </p>
        </div>

        {/* ─── MINIMAL BOTTOM NAVIGATION & DIRECT LIVE SITE ACTION ─── */}
        <div className="relative z-30 flex flex-col items-center pb-7 left-0 right-0 pointer-events-none space-y-2.5 px-4">
          {/* Project Stepper Dots */}
          <div className="flex items-center gap-2 pointer-events-auto bg-black/60 px-3.5 py-1.5 rounded-full border border-white/12 backdrop-blur-md shadow-xl">
            {showcaseProjects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => handleDotClick(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  i === activeProjectIndex 
                    ? 'w-6 h-1.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' 
                    : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/60'
                }`}
                aria-label={`Jump to project ${i + 1}: ${p.title}`}
                title={`${i + 1}. ${p.title}`}
              />
            ))}
          </div>

          {/* Quick Action Pill: Watch Live Site or Open Case Study */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {activeProject.liveUrl && (
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold backdrop-blur-md shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title={`Open live website: ${activeProject.liveUrl}`}
              >
                <Globe size={13} />
                <span>Live Site</span>
                <ArrowUpRight size={13} />
              </a>
            )}
            <button
              onClick={() => setSelectedProject(activeProject)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white text-xs font-medium backdrop-blur-md border border-white/15 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Case Study</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* INTERACTIVE DEEP-DIVE MODAL PREVIEW                         */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 pointer-events-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="relative w-full max-w-3xl liquid-glass rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col bg-[#0b0c10]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Pinned Header with Badge, Live Link & Close Button */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 bg-[#0b0c10]/95 backdrop-blur-xl border-b border-white/10 shrink-0 z-10 gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-mono text-xs font-mono">
                  <span className="text-white font-bold">{selectedProject.badge}</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-300">{selectedProject.year}</span>
                </div>

                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
                    title={`Open live website: ${selectedProject.liveUrl}`}
                  >
                    <Globe size={12} />
                    <span className="hidden sm:inline">{selectedProject.liveUrl.replace(/^https?:\/\//, '')}</span>
                    <span className="sm:hidden">Live Site</span>
                    <ArrowUpRight size={12} />
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Smooth Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6 overscroll-contain custom-modal-scroll">
              <div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight break-words leading-tight">
                  {selectedProject.title}
                </h3>
                <div className="text-xs sm:text-sm font-mono text-zinc-400 mt-1 break-words">
                  {selectedProject.subtitle}
                </div>

                {/* Live Website & GitHub Buttons */}
                {(selectedProject.liveUrl || selectedProject.githubUrl) && (
                  <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
                    {selectedProject.liveUrl && (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Globe size={14} />
                        <span>Launch Live Website ({selectedProject.liveUrl.replace(/^https?:\/\//, '')})</span>
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                    {selectedProject.githubUrl && (
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Github size={14} />
                        <span>GitHub Code</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <div className="w-full h-48 sm:h-72 rounded-2xl overflow-hidden border border-white/15 bg-black/40">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Problem & Solution Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-bold uppercase tracking-wider">
                    <AlertCircle size={14} className="text-blue-400 shrink-0" />
                    <span>Problem Being Solved</span>
                  </div>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-body">
                    {selectedProject.problem}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase tracking-wider">
                    <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                    <span>Architectural Solution</span>
                  </div>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-body">
                    {selectedProject.solution}
                  </p>
                </div>
              </div>

              {/* Key Platform Features Checklist */}
              {selectedProject.features && (
                <div>
                  <div className="text-xs font-mono text-zinc-300 uppercase tracking-wider mb-3 font-bold">
                    KEY FEATURES & WORKFLOWS:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedProject.features.map((feat) => (
                      <div
                        key={feat}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10"
                      >
                        <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                        <span className="text-xs font-mono text-zinc-200 font-medium break-words">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {selectedProject.tech && (
                <div>
                  <div className="text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2 font-bold">
                    TECHNICAL STACK:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-blue-200 font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pinned Footer Actions */}
            <div className="p-4 sm:px-8 border-t border-white/10 bg-[#0b0c10]/95 backdrop-blur-xl flex items-center justify-end gap-2.5 sm:gap-3 shrink-0 flex-wrap">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                Close Preview
              </button>

              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-bold text-white transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 cursor-pointer"
                >
                  <ExternalLink size={13} />
                  <span>Launch Live Site</span>
                  <ArrowUpRight size={13} />
                </a>
              )}

              <a
                href="#contact"
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs active:scale-95 transition-all cursor-pointer"
              >
                Discuss Project
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
