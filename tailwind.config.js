module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,md,mdx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FBF3E6',
          deep: '#F3E7D2',
        },
        espresso: {
          DEFAULT: '#3A2E28',
          light: '#5C4A3F',
        },
        terracotta: {
          light: '#D97F5A',
          DEFAULT: '#C1603E',
          dark: '#A34E31',
        },
        sage: {
          light: '#9CB393',
          DEFAULT: '#7C9473',
          dark: '#64785D',
        },
        mustard: {
          light: '#EDBE64',
          DEFAULT: '#E3A73B',
          dark: '#C68B27',
        },
        clay: {
          line: '#DDCBAE',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 4px 14px -4px rgba(58, 46, 40, 0.18)',
        'warm-lg': '0 12px 32px -8px rgba(58, 46, 40, 0.25)',
      },
    },
  },
  plugins: [],
}
