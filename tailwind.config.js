/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
          dark: '#4B5563',
        },
        background: '#FAFAF9',
        text: {
          DEFAULT: '#374151',
          light: '#6B7280',
        },
        accent: {
          DEFAULT: '#D1D5DB',
          dark: '#9CA3AF',
        }
      },
      backgroundImage: {
        'artistic-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239CA3AF\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'spin': 'spin 60s infinite linear',
        'spin-revert': 'spinRevert 60s infinite linear',
      }
    },
  },
  plugins: [],
}
