/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0f0f14',
          raised: '#16161f',
          overlay: '#1e1e2a',
          border: '#2a2a3a'
        },
        accent: {
          DEFAULT: '#7c6af7',
          hover: '#9b8dff',
          muted: '#3d3668'
        },
        text: {
          primary: '#e8e6f0',
          secondary: '#9896a8',
          muted: '#5e5d6e'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      borderRadius: {
        card: '12px'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
