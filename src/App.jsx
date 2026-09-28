import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PortfolioPage from './pages/PortfolioPage';
import DashboardPage from './pages/DashboardPage';
import CustomCursor from './components/CustomCursor';
import AmbientAudio from './components/AmbientAudio';

export default function App() {
  const [soundActive, setSoundActive] = useState(false);

  const toggleSound = () => {
    setSoundActive((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#050505] text-[#f8fafc] selection:bg-white selection:text-black font-body">
        
        {/* Noise Texture Overlay for Rich Film Grain Feel */}
        <div className="fixed inset-0 bg-noise-pattern pointer-events-none z-40 opacity-40" />

        {/* Stormy Sky 3D Trailing Custom Cursor */}
        <CustomCursor />

        {/* Ambient Audio Synth Engine */}
        <AmbientAudio isActive={soundActive} />

        {/* Application Routes */}
        <Routes>
          <Route 
            path="/" 
            element={
              <PortfolioPage 
                soundActive={soundActive} 
                toggleSound={toggleSound} 
              />
            } 
          />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/chat" element={<DashboardPage />} />
          <Route path="/admin" element={<DashboardPage />} />
          <Route 
            path="*" 
            element={
              <PortfolioPage 
                soundActive={soundActive} 
                toggleSound={toggleSound} 
              />
            } 
          />
        </Routes>

      </div>
    </BrowserRouter>
  );
}
