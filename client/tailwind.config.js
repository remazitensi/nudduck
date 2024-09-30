/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        rammetto: ['"Rammetto One"', 'cursive'], // 'Rammetto One' 추가
      },
    },
  },
  plugins: [],
};
