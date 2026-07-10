/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0F0B1A',
        'bg-panel': '#171224',
        'bg-panel-2': '#1D1730',
        'bg-editor': '#0C0914',
        border: '#2C2440',
        coral: '#FF3D71',
        mint: '#6EFFC4',
        amber: '#FFB020',
        text: '#F5F1FF',
        'text-muted': '#9A8FBF',
        'text-dim': '#5D5480',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        code: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,61,113,0.2), 0 20px 60px rgba(15, 11, 26, 0.55)',
      },
    },
  },
  plugins: [],
};
