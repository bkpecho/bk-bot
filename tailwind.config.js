/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "synthwave"],
  },
};

// synthwave: {
//   "color-scheme": "dark",
//   "primary": "#e779c1",
//   "secondary": "#58c7f3",
//   "accent": "oklch(88.04% 0.206 93.72)",
//   "neutral": "#221551",
//   "neutral-content": "#f9f7fd",
//   "base-100": "#1a103d",
//   "base-content": "#f9f7fd",
//   "info": "#53c0f3",
//   "info-content": "#201047",
//   "success": "#71ead2",
//   "success-content": "#201047",
//   "warning": "#eace6c",
//   "warning-content": "#201047",
//   "error": "#ec8c78",
//   "error-content": "#201047",
// },
