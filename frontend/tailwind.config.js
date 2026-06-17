/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#f1f4f8',
          surface:  '#ffffff',
          elevated: '#eef4ff',
        },
        border:       '#d1dbe8',
        accent:       '#16f06a',
        'accent-dim': '#0f8f6b',
        muted:        '#5c6e89',
        text:         '#132844',
        purple:       '#7c3aed',
        'purple-dim': '#5b21b6',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #080c16 0%, #0a1628 40%, #0d1f3c 70%, #091a14 100%)',
        'green-glow':
          'radial-gradient(ellipse at center, rgba(0,217,126,0.15) 0%, transparent 70%)',
        'card-gradient':
          'linear-gradient(135deg, #0d1526 0%, #111e38 100%)',
      },
      boxShadow: {
        'green-sm': '0 0 12px rgba(0,217,126,0.25)',
        'green-md': '0 0 24px rgba(0,217,126,0.35)',
        'purple-sm': '0 0 12px rgba(124,58,237,0.3)',
      },
    },
  },
  plugins: [],
};
