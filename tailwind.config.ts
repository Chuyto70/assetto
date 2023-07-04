import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        primary: [
          'var(--font-noto-sans-display)',
          'var(--font-inter)',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      colors: {
        primary: {
          // Customize it on globals.css :root
          50: 'rgb(var(--tw-color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--tw-color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--tw-color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--tw-color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--tw-color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--tw-color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--tw-color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--tw-color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--tw-color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--tw-color-primary-900) / <alpha-value>)',
          950: 'rgb(var(--tw-color-primary-950) / <alpha-value>)',
        },
        secondary: {
          // Customize it on globals.css :root
          50: 'rgb(var(--tw-color-secondary-50) / <alpha-value>)',
          100: 'rgb(var(--tw-color-secondary-100) / <alpha-value>)',
          200: 'rgb(var(--tw-color-secondary-200) / <alpha-value>)',
          300: 'rgb(var(--tw-color-secondary-300) / <alpha-value>)',
          400: 'rgb(var(--tw-color-secondary-400) / <alpha-value>)',
          500: 'rgb(var(--tw-color-secondary-500) / <alpha-value>)',
          600: 'rgb(var(--tw-color-secondary-600) / <alpha-value>)',
          700: 'rgb(var(--tw-color-secondary-700) / <alpha-value>)',
          800: 'rgb(var(--tw-color-secondary-800) / <alpha-value>)',
          900: 'rgb(var(--tw-color-secondary-900) / <alpha-value>)',
          950: 'rgb(var(--tw-color-secondary-950) / <alpha-value>)',
        },
        carbon: {
          DEFAULT: '#1E1E1E',
          50: '#CBCBCB',
          100: '#C1C1C1',
          200: '#ADADAD',
          300: '#989898',
          400: '#848484',
          500: '#707070',
          600: '#5B5B5B',
          700: '#474747',
          800: '#323232',
          900: '#1E1E1E',
          950: '#101010',
        },
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
      maxWidth: {
        'screen-3xl': '1920px',
      },
      transitionProperty: {
        height: 'height',
        spacing: 'margin, padding',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config;
