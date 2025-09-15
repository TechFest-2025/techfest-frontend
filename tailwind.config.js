module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all source files are covered
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 20s linear infinite',
        'ping-slow': 'ping 6s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slower': 'ping 10s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slowest': 'ping 15s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // Ping is built-in in Tailwind, no need to redefine unless custom behavior is needed.
      },
    },
  },
  plugins: [],
};
