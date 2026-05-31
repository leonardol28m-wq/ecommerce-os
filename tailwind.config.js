/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './src/popup/index.html'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#08080F',
          secondary: '#0F0F1A',
          tertiary: '#161624',
          elevated: '#1C1C2E',
          glass: 'rgba(255,255,255,0.04)',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          default: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.18)',
        },
        accent: {
          blue: '#3B82F6',
          'blue-dim': '#1D4ED8',
          purple: '#8B5CF6',
          'purple-dim': '#6D28D9',
          emerald: '#10B981',
          'emerald-dim': '#059669',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        text: {
          primary: '#F0F0FF',
          secondary: '#9B9BB4',
          muted: '#5A5A7A',
          disabled: '#3A3A5A',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
        'slide-in':   'slideIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'spin-slow':  'spin 2s linear infinite',
        shimmer:      'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-6px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        glass:         '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        glow:          '0 0 20px rgba(59,130,246,0.3)',
        'glow-purple': '0 0 20px rgba(139,92,246,0.3)',
        'glow-emerald':'0 0 20px rgba(16,185,129,0.3)',
        card:          '0 4px 24px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
