import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['Raleway', ...defaultTheme.fontFamily.sans],
        lobster: ['Lobster', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xxs: '320px',
        xs: '375px',
        sm: '425px',
        md: '768px',
        lg: '1024px',
        xl: '1440px',
        '2xl': '2560px',
      },
      spacing: {
        0: '0rem',
        ...Array(100 * 4)
          .fill(0)
          .map((_, i) => i + 1)
          .reduce<Record<string, string>>((acc, i) => {
            acc[i / 4] = i / 16 + 'rem'
            return acc
          }, {}),
      },
      borderRadius: {
        0: '0rem',
        ...Array(100 * 4)
          .fill(0)
          .map((_, i) => i + 1)
          .reduce<Record<string, string>>((acc, i) => {
            acc[i / 4] = i / 16 + 'rem'
            return acc
          }, {}),
      },
      fontSize: {
        10: ['0.625rem', { lineHeight: '0.7rem' }],
        11: ['0.6875rem', { lineHeight: '0.75rem' }],
        12: ['0.75rem', { lineHeight: '1rem' }],
        14: ['0.875rem', { lineHeight: '1.0625rem' }],
        16: ['1rem', { lineHeight: '1.5rem' }],
        18: ['1.125rem', { lineHeight: '1.75rem' }],
        20: ['1.25rem', { lineHeight: '1.75rem' }],
        23: ['1.4375rem', { lineHeight: '1.6875rem' }],
        24: ['1.5rem', { lineHeight: '2rem' }],
        28: ['1.75rem', { lineHeight: '2.0625rem' }],
        32: ['2rem', { lineHeight: '1.75rem' }],
        35: ['2.1875rem', { lineHeight: '2.5625rem' }],
        40: ['2.5rem', { lineHeight: '2.5625rem' }],
        44: ['2.75rem', { lineHeight: '3.25rem' }],
        55: ['3.4375rem', { lineHeight: '4.0625rem' }],
        69: ['4.3125rem', { lineHeight: '5.0625rem' }],
        92: ['5.75rem', { lineHeight: '6.75rem' }],
      },
      colors: {
        primary: {
          50: 'hsla(34, 100%, 96%, 1)',
          100: 'hsla(32, 90%, 85%, 1)',
          300: 'hsla(31, 75%, 70%, 1)',
          400: 'hsla(30, 65%, 63%, 1)',
          500: 'hsla(30, 59%, 57%, 1)',
          600: 'hsla(28, 66%, 40%, 1)',
        },
        secondary: {
          50: 'hsla(22, 100%, 96%, 1)',
          100: 'hsla(22, 95%, 87%, 1)',
          300: 'hsla(21, 95%, 70%, 1)',
          400: 'hsla(20, 96%, 60%, 1)',
          500: 'hsla(20, 98%, 48%, 1)',
          600: 'hsla(18, 100%, 35%, 1)',
        },
        beige: {
          50: 'hsla(30, 60%, 98%, 1)',
          100: 'hsla(30, 63%, 95%, 1)',
          300: 'hsla(30, 63%, 91%, 1)',
          400: 'hsla(30, 60%, 83%, 1)',
          500: 'hsla(30, 58%, 72%, 1)',
          600: 'hsla(30, 55%, 60%, 1)',
        },
        dark: {
          50: 'hsla(345, 15%, 95%, 1)',
          100: 'hsla(345, 10%, 85%, 1)',
          300: 'hsla(345, 9%, 45%, 1)',
          400: 'hsla(345, 8%, 30%, 1)',
          500: 'hsla(345, 7%, 20%, 1)',
          600: 'hsla(345, 7%, 10%, 1)',
        },
        shade: {
          50: 'hsla(0, 0%, 98%, 1)',
          100: 'hsla(0, 0%, 90%, 1)',
          300: 'hsla(0, 0%, 70%, 1)',
          400: 'hsla(0, 0%, 60%, 1)',
          500: 'hsla(0, 0%, 51%, 1)',
          600: 'hsla(0, 0%, 40%, 1)',
          700: 'hsla(0, 0%, 30%, 1)',
        },
        red: {
          50: 'hsla(19, 100%, 97%, 1)',
          100: 'hsla(15, 100%, 87%, 1)',
          300: 'hsla(15, 100%, 82%, 1)',
          400: 'hsla(15, 100%, 70%, 1)',
          500: 'hsla(15, 100%, 52%, 1)',
          600: 'hsla(15, 95%, 45%, 1)',
        },
        'red-dark': {
          100: 'hsla(15, 100%, 52%, 1)',
          200: 'hsla(15, 100%, 45%, 1)',
          300: 'hsla(15, 100%, 33%, 1)',
          400: 'hsla(15, 100%, 23%, 1)',
          500: 'hsla(15, 100%, 18%, 1)',
          600: 'hsla(15, 100%, 8%, 1)',
        },
        'sky-blue': {
          50: 'hsla(210, 75%, 97%, 1)',
          100: 'hsla(207, 73%, 93%, 1)',
          200: 'hsla(206, 75%, 87%, 1)',
          300: 'hsla(204, 76%, 78%, 1)',
          400: 'hsla(206, 74%, 73%, 1)',
          500: 'hsla(206, 76%, 65%, 1)',
        },
        blue: {
          100: 'hsla(218, 89%, 96%, 1)',
          200: 'hsla(220, 92%, 86%, 1)',
          300: 'hsla(218, 90%, 80%, 1)',
          400: 'hsla(219, 90%, 71%, 1)',
          500: 'hsla(219, 91%, 66%, 1)',
          600: 'hsla(219, 47%, 46%, 1)',
          700: 'hsla(219, 47%, 40%, 1)',
        },
        green: {
          100: 'hsla(86, 58%, 95%, 1)',
          200: 'hsla(85, 59%, 81%, 1)',
          300: 'hsla(86, 59%, 73%, 1)',
          400: 'hsla(86, 59%, 62%, 1)',
          500: 'hsla(86, 59%, 54%, 1)',
          600: 'hsla(86, 50%, 38%, 1)',
          700: 'hsla(85, 51%, 33%, 1)',
        },
        orange: {
          100: 'hsla(34, 73%, 96%, 1)',
          200: 'hsla(31, 71%, 83%, 1)',
          300: 'hsla(32, 71%, 75%, 1)',
          400: 'hsla(32, 71%, 65%, 1)',
          500: 'hsla(32, 71%, 57%, 1)',
          600: 'hsla(32, 53%, 40%, 1)',
          700: 'hsla(32, 53%, 35%, 1)',
        },
        pink: {
          100: 'hsla(335, 67%, 96%, 1)',
          200: 'hsla(336, 71%, 85%, 1)',
          300: 'hsla(336, 71%, 79%, 1)',
          400: 'hsla(336, 71%, 70%, 1)',
          500: 'hsla(336, 71%, 65%, 1)',
          600: 'hsla(336, 39%, 45%, 1)',
          700: 'hsla(336, 39%, 39%, 1)',
        },
        yellow: {
          50: 'hsla(45, 100%, 95%, 1)',
          75: 'hsla(46, 100%, 81%, 1)',
          100: 'hsla(46, 100%, 73%, 1)',
          200: 'hsla(46, 100%, 61%, 1)',
          300: 'hsla(46, 100%, 53%, 1)',
          400: 'hsla(46, 88%, 37%, 1)',
          500: 'hsla(46, 89%, 32%, 1)',
        },
        paper: 'hsla(20,16%,96%,1)',
      },
    },
  },
}
export default config
