/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        card: "var(--card)",
        cardHover: "var(--card-hover)",
        border: "var(--border)",
        blue: "var(--blue)",
        orange: "var(--orange)",
        gold: "var(--gold)",
        green: "var(--green)",
        red: "var(--red)",
        purple: "var(--purple)",
        pink: "var(--pink)",
        text: "var(--text)",
        text2: "var(--text2)",
        text3: "var(--text3)",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 20px 60px rgba(0, 191, 255, 0.18)",
      },
      borderRadius: {
        xl: "var(--radius)",
      },
    },
  },
  plugins: [],
};

