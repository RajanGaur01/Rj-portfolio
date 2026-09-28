import React from 'react';
import { Target, Compass, Sparkles, CheckCircle2, Flag, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function ExperienceTimeline() {
  return (
    <section id="timeline" className="relative py-32 px-5 sm:px-8 md:px-12 bg-[#050505] text-white z-20">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/15 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono tracking-widest text-zinc-200 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">Philosophy & Approach</span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase">
              <span className="text-silver-gradient">ACTION OVER </span>
              <span className="text-blue-400">THEORY.</span>
            </h2>
          </div>

          <p className="text-zinc-400 text-sm md:text-base max-w-md font-body font-medium leading-relaxed">
            "I prefer building actual applications, experimenting with ideas, and turning concepts into usable products rather than collecting certificates."
          </p>
        </div>

        {/* Two-Column Grid: Philosophy on Left, Active Goals & Vision on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: What Makes Me Different & Core Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-mono text-zinc-400 tracking-widest uppercase mb-4 flex items-center gap-2 font-bold">
              <span>Core Principles</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolioData.philosophy.map((item, index) => (
                <div
                  key={item.title}
                  className="liquid-glass-card rounded-2xl p-6 flex flex-col justify-between gap-4 border border-white/15 bg-[#0d0d12]/90 hover:border-blue-500/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-blue-300 font-bold px-2.5 py-0.5 rounded-full bg-blue-950/40 border border-blue-500/25">
                        0{index + 1}
                      </span>
                    </div>

                    <h4 className="font-display font-bold text-lg text-white">
                      {item.title}
                    </h4>

                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-body font-medium">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Difference Callout Card */}
            <div className="p-6 sm:p-8 rounded-2xl liquid-glass border border-white/20 bg-black/60 shadow-xl space-y-3">
              <div className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider">
                What Sets This Work Apart
              </div>
              <h4 className="font-display font-bold text-xl sm:text-2xl text-white">
                Building Complete Systems, Not Small Demos
              </h4>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-body font-medium">
                When I start a project, I engineer for real users: authentication systems, databases, cloud storage, business logic, admin moderation panels, and responsive UI/UX from day one.
              </p>
            </div>
          </div>

          {/* Right: Current Focus & Long-Term Vision */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs font-mono text-zinc-400 tracking-widest uppercase mb-4 flex items-center gap-2 font-bold">
              <span>Roadmap & Vision</span>
            </h3>

            <div className="space-y-3">
              {portfolioData.goals.map((goal, idx) => (
                <div
                  key={goal.area}
                  className="p-5 rounded-2xl bg-white/[0.04] border border-white/15 hover:border-white/30 transition-all flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-display font-black text-sm text-white shrink-0">
                    0{idx + 1}
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-base text-white">
                      {goal.area}
                    </h5>
                    <p className="text-xs text-zinc-300 mt-1 font-body font-medium leading-relaxed">
                      {goal.objective}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Long-Term Vision Pill */}
            <div className="p-6 rounded-2xl liquid-glass border border-white/20 bg-[#0d0d12] shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 font-bold uppercase">
                <Flag size={15} className="text-white" />
                <span>Long-Term Vision</span>
              </div>
              <div className="font-display font-bold text-base sm:text-lg text-white">
                "To be known for the exceptional quality and impact of the software products I build."
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
