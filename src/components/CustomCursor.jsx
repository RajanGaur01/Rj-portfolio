import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on non-touch desktop screens
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);

      // Check if hovering interactive element
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, select, .cursor-pointer, [role="button"]');
      setHovered(!!isInteractive);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth trailing ring lerp
    let frameId;
    let currentX = -100;
    let currentY = -100;

    const loop = () => {
      currentX += (pos.x - currentX) * 0.18;
      currentY += (pos.y - currentY) * 0.18;
      setTrail({ x: currentX, y: currentY });
      frameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(frameId);
    };
  }, [pos.x, pos.y, visible]);

  if (!visible) return null;

  return (
    <>
      {/* Subtle Atmospheric Stormy Sky Fluid Aura Light */}
      <div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9990] -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity] duration-300 ease-out"
        style={{
          transform: `translate3d(${trail.x}px, ${trail.y}px, 0)`,
          width: hovered ? '44px' : '26px',
          height: hovered ? '44px' : '26px',
          background: hovered 
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(37, 99, 235, 0.08) 55%, transparent 80%)' 
            : 'radial-gradient(circle, rgba(96, 165, 250, 0.12) 0%, transparent 70%)',
          filter: 'blur(6px)',
        }}
      />
    </>
  );
}
