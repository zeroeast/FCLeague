/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // 사이트 다크 테마 팔레트
        bg: {
          base: '#0d1117',
          surface: '#161b22',
          elevated: '#21262d',
        },
        border: '#30363d',
        accent: '#58a6ff',
        green: '#238636',
        'green-hover': '#2ea043',
        muted: '#8b949e',
        text: '#e6edf3',
      },
    },
  },
  plugins: [],
};
