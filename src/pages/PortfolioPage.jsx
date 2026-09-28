import React, { useEffect } from 'react';
import Lenis from 'lenis';
import LiquidNavbar from '../components/LiquidNavbar';
import HeroScrollCanvas from '../components/HeroScrollCanvas';
import ProjectsSection from '../components/ProjectsSection';
import Capabilities from '../components/Capabilities';
import ExperienceTimeline from '../components/ExperienceTimeline';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';

export default function PortfolioPage({ soundActive, toggleSound }) {
  useEffect(() => {
    // Initialize Lenis Smooth Scroll on main portfolio page
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Liquid Glass Floating Navigation */}
      <LiquidNavbar 
        soundActive={soundActive} 
        toggleSound={toggleSound} 
      />

      {/* Main Flow: Scroll Synced Hero + Portfolio Sections */}
      <main className="relative z-10">
        
        {/* Pinned Scroll-Synced Video Canvas Hero Section */}
        <HeroScrollCanvas />

        {/* Selected Masterpieces & 3D Cards */}
        <ProjectsSection />

        {/* Technical Architecture & Capabilities */}
        <Capabilities />

        {/* Timeline & Honors */}
        <ExperienceTimeline />

        {/* Endorsements & Continuous Marquee */}
        <Testimonials />

        {/* Contact Section with Interactive Chat Simulation & Direct Dashboard Gateway */}
        <ContactSection />

      </main>
    </>
  );
}
