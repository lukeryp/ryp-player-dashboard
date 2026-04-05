import type { Config } from 'tailwindcss';

/**
 * RYP Shared Tailwind Config
 *
 * Usage in any app's tailwind.config.ts:
 *   import rypPreset from '@ryp/ui/tailwind'
 *   export default { presets: [rypPreset], content: [...] }
 */
const rypTailwindConfig: Config = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        ryp: {
          green:        '#00af51',
          'green-light': '#00d463',
          'green-dark':  '#008a40',
          yellow:       '#f4ee19',
          'yellow-light': '#f9f55a',
          'yellow-dark':  '#c9c310',
          black:        '#000000',
          surface: {
            1: '#0a0a0a',
            2: '#111111',
            3: '#1a1a1a',
            4: '#222222',
          },
          danger:  '#ef4444',
          info:    '#3b82f6',
        },
      },
      fontFamily: {
        heading: ['Raleway', 'system-ui', 'sans-serif'],
        body:    ['Work Sans', 'system-ui', 'sans-serif'],
        sans:    ['Work Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm:  '4px',
        md:  '8px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'ryp-sm':          '0 1px 3px rgba(0, 0, 0, 0.4)',
        'ryp-md':          '0 4px 12px rgba(0, 0, 0, 0.5)',
        'ryp-lg':          '0 8px 32px rgba(0, 0, 0, 0.6)',
        'glow-green':      '0 0 20px rgba(0, 175, 81, 0.25)',
        'glow-yellow':     '0 0 20px rgba(244, 238, 25, 0.20)',
        'glow-green-md':   '0 0 40px rgba(0, 175, 81, 0.35)',
      },
      backgroundImage: {
        'ryp-gradient':        'linear-gradient(135deg, #0d0d0d 0%, #111111 100%)',
        'ryp-gradient-green':  'linear-gradient(135deg, rgba(0,175,81,0.15) 0%, rgba(0,175,81,0.05) 100%)',
        'ryp-gradient-yellow': 'linear-gradient(135deg, rgba(244,238,25,0.12) 0%, rgba(244,238,25,0.04) 100%)',
      },
      backdropBlur: {
        xs:  '4px',
        sm:  '8px',
        md:  '12px',
        lg:  '20px',
        xl:  '40px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'toast-out': {
          from: { opacity: '1', transform: 'translateX(0)' },
          to:   { opacity: '0', transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in':  'fade-in 200ms ease-out',
        'slide-up': 'slide-up 200ms ease-out',
        'slide-down': 'slide-down 200ms ease-out',
        'spin-slow': 'spin-slow 2s linear infinite',
        'toast-in':  'toast-in 300ms cubic-bezier(0.4,0,0.2,1)',
        'toast-out': 'toast-out 200ms cubic-bezier(0.4,0,0.2,1)',
      },
    },
  },
  plugins: [],
};

export default rypTailwindConfig;
