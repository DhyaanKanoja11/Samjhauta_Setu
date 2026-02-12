/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // User-defined premium agricultural palette
        brand: {
          green: '#2C5F2D',    // Forest Green
          cream: '#F5F1E7',    // Soft Parchment
          brown: '#8B4513',    // Earth Brown
          blue: '#05668D',     // Sea Blue
          tan: '#D4A373',      // Sand/Harvest
        },
        primary: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#2C5F2D', // Updated to brand green
          600: '#265126',
          700: '#1e421e',
          800: '#173417',
          900: '#102510',
        },
        secondary: {
          50: '#e0f2f7',
          100: '#b3e0ed',
          200: '#81cbe1',
          300: '#4fb5d5',
          400: '#29a5cc',
          500: '#05668D',
          600: '#045d81',
          700: '#035272',
          800: '#024763',
          900: '#01354b',
        },
        accent: {
          50: '#f1e9e3',
          100: '#dbc7ba',
          200: '#c3a28d',
          300: '#ab7d5f',
          400: '#99613e',
          500: '#8B4513',
          600: '#7f3f11',
          700: '#70370e',
          800: '#61300c',
          900: '#4a2409',
        },
        background: {
          light: '#F5F1E7',
          dark: '#121212',
        },
        success: '#2C5F2D',
        warning: '#D4A373',
        error: '#f44336',
        info: '#05668D',
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 15px 30px -5px rgba(0, 0, 0, 0.08)',
        'strong': '0 10px 40px -5px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(76, 175, 80, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 152, 0, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
        'gradient-accent': 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
