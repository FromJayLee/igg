import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Indie Game Galaxy 색상 팔레트
        universe: {
          primary: '#ff2d9d',      // 네온 마젠타
          secondary: '#05d9e8',    // 네온 시안
          background: '#000000',   // 딥 스페이스 블랙
          'background-secondary': '#0a093d', // 미드나이트 네이비
          surface: '#4b1d79',      // 코스믹 퍼플
          'text-primary': '#ffffff', // 화이트
          'text-secondary': '#b8b8b8', // 라이트 그레이
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'neon-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(255, 45, 157, 0.6)',
            textShadow: '0 0 20px rgba(255, 45, 157, 0.6)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(255, 45, 157, 0.8)',
            textShadow: '0 0 30px rgba(255, 45, 157, 0.8)'
          },
        },
        'cyber-pulse': {
          '0%': { 
            boxShadow: '0 0 5px rgba(5, 217, 232, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(5, 217, 232, 0.8), 0 0 30px rgba(5, 217, 232, 0.6)',
          },
          '100%': { 
            boxShadow: '0 0 5px rgba(5, 217, 232, 0.5)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'neon-glow': 'neon-glow 2s ease-in-out infinite',
        'cyber-pulse': 'cyber-pulse 3s ease-in-out infinite',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'pixel': ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;

export default config;
