/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: {
          DEFAULT: "#0a0a0a",
          secondary: "#121212",
          tertiary: "#1a1a1a",
          border: "rgba(255, 255, 255, 0.08)",
          glass: "rgba(10, 10, 10, 0.65)",
        },
        accent: {
          DEFAULT: "#ffffff",
          muted: "#94a3b8",
          dark: "#334155",
          glow: "rgba(255, 255, 255, 0.15)",
          blue: "#3b82f6",
          blueDark: "#1d4ed8",
          blueGlow: "rgba(59, 130, 246, 0.4)",
        },
        brandBlue: {
          DEFAULT: "#2563eb",
          light: "#3b82f6",
          dark: "#1d4ed8",
          glow: "rgba(59, 130, 246, 0.35)",
        }
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        signature: ['"Yellowtail"', 'cursive'],
        script: ['"Yellowtail"', 'cursive'],
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
        mono: ['"Space Grotesk"', 'monospace'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 65%)',
        'radial-blue': 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
        'noise-pattern': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.03\"/%3E%3C/svg%3E')",
      },
      boxShadow: {
        'liquid': '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.2), inset 0 -1px 1px rgba(0, 0, 0, 0.5)',
        'liquid-sm': '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        'glow-subtle': '0 0 35px rgba(255, 255, 255, 0.08)',
        'glow-pill': '0 0 25px rgba(255, 255, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        'blue-glow': '0 0 30px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        'blue-btn': '0 10px 25px -5px rgba(37, 99, 235, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
