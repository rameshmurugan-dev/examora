// tailwind.config.cjs

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      animation: {
        float: 'float 12s ease-in-out infinite',
        glow: 'glow 4s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 0px rgba(99,102,241,0.0)' },
          '100%': { boxShadow: '0 0 25px rgba(99,102,241,0.35)' },
        },
      },
    },
  },
};
