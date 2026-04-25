import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#07090c',
          panel: 'rgba(10, 14, 20, 0.78)',
          panelSolid: '#0b1018',
          border: 'rgba(120, 160, 200, 0.14)',
        },
        accent: {
          DEFAULT: '#7be3ff',
          warm: '#ffb86b',
          danger: '#ff5577',
          olive: '#a0b070',
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(123, 227, 255, 0.18)',
        panel: '0 8px 40px rgba(0, 0, 0, 0.55)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
