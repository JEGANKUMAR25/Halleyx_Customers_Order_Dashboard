/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#0f172a', /* slate-900 */
        cardBg: 'rgba(255, 255, 255, 0.05)',
        primary: '#3b82f6', /* blue-500 */
        accent: '#8b5cf6', /* violet-500 */
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
