import React, { useEffect, useRef } from 'react';

export default function AmbientAudio({ isActive }) {
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorsRef = useRef([]);

  useEffect(() => {
    if (isActive) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        if (!audioCtxRef.current) {
          const ctx = new AudioContext();
          audioCtxRef.current = ctx;

          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0, ctx.currentTime);
          masterGain.connect(ctx.destination);
          gainNodeRef.current = masterGain;

          // Low ambient drone chords (C minor 9th ethereal pad: C2, G2, Eb3, Bb3, D4)
          const frequencies = [65.41, 98.00, 155.56, 233.08, 293.66];
          const oscs = [];

          frequencies.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            // Subtle LFO frequency detune for warm analog drift
            osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);

            // Lowpass warmth filter
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450 + idx * 80, ctx.currentTime);

            oscGain.gain.setValueAtTime(0.04 / frequencies.length, ctx.currentTime);

            osc.connect(filter);
            filter.connect(oscGain);
            oscGain.connect(masterGain);

            osc.start();
            oscs.push(osc);
          });

          oscillatorsRef.current = oscs;
        }

        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }

        // Fade in smoothly
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.linearRampToValueAtTime(0.12, audioCtxRef.current.currentTime + 1.5);
        }
      } catch (err) {
        console.warn('Web Audio Ambient Init:', err);
      }
    } else {
      // Fade out smoothly
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 1.0);
      }
    }

    return () => {
      // Clean up on unmount
    };
  }, [isActive]);

  return null;
}
