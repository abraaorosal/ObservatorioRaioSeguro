/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        institutional: {
          ink: '#08261d',
          graphite: '#123c34',
          steel: '#50615c',
          line: '#d7e6df',
          surface: '#f3f8f5',
          gold: '#f26a21',
          navy: '#007f5f',
          teal: '#39bfc3',
          green: '#009b3a',
          red: '#b42318',
          amber: '#d97706',
          orange: '#f26a21',
          aqua: '#5fc8c4',
          leaf: '#0a8f2a',
        },
      },
      boxShadow: {
        official: '0 18px 45px rgba(8, 38, 29, 0.08)',
      },
    },
  },
  plugins: [],
};
