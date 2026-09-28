import React from 'react';
import { Quote, Sparkles, Code2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Testimonials() {
  const marqueeKeywords = [
    "FULL STACK DEVELOPMENT", "FLUTTER ANDROID", "CLOUD COMPUTING", "AWS ACADEMY",
    "GEMINI AI INTEGRATION", "FIREBASE FIRESTORE", "PRODUCT ARCHITECTURE", "ACTION OVER THEORY"
  ];

  return (
    <section id="testimonials" className="relative py-24 bg-[#050505] text-white z-20 overflow-hidden">
      
      {/* Infinite Marquee Ribbon */}
      <div className="w-full py-4 border-y border-white/15 bg-white/[0.02] mb-20 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 font-mono text-xs text-zinc-400 tracking-widest uppercase font-bold">
          {[...marqueeKeywords, ...marqueeKeywords, ...marqueeKeywords].map((word, idx) => (
            <span key={idx} className="flex items-center gap-4">
              <span className="text-white font-bold">{word}</span>
              <span className="text-zinc-600">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        
        {/* Core Manifesto Card */}
        <div className="liquid-glass-pill rounded-3xl p-8 sm:p-12 border border-white/20 bg-[#0d0d12]/90 shadow-2xl text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full badge-mono text-xs font-mono text-zinc-300 font-semibold uppercase">
            <Sparkles size={13} className="text-white" />
            <span>Core Belief</span>
          </div>

          <blockquote className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
            "I believe that the best way to learn technology is by creating real applications that people can actually use."
          </blockquote>

          <div className="pt-4 flex flex-col items-center gap-1">
            <div className="font-display font-bold text-lg text-white">
              RAJAN GAUR
            </div>
            <div className="text-xs font-mono text-zinc-400">
              BCA Student • Full Stack & Flutter Developer • Cloud Computing Learner
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
