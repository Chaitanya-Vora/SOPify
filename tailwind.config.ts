/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#080808',
                surface: '#111111',
                border: '#1F1F1F',
                primary: '#6366F1',
                'primary-hover': '#818CF8',
                'text-primary': '#F9F9F9',
                'text-secondary': '#8A8A8A',
                'text-muted': '#4A4A4A',
                'success-green': '#22C55E',
                destructive: '#EF4444',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            letterSpacing: {
                tight: '-0.03em',
            },
            animation: {
                'marquee': 'marquee 30s linear infinite',
                'float': 'float 4s ease-in-out infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-8px)' },
                },
            },
        },
    },
    plugins: [],
}
