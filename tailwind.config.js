/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    orange: '#FC8019', // Primary CTA
                    dark: '#1C1C1C',   // Headings / Secondary
                    green: '#2ECC71',  // Freshness / Success
                    teal: '#0EA5A5',   // Seafood / Accents
                    light: '#F7F7F7',  // Backgrounds
                    gray: '#93959F',   // Muted text
                }
            },
            fontFamily: {
                sans: ['"Outfit"', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
                'float': '0 10px 20px rgba(0,0,0,0.08)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
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
            }
        },
    },
    plugins: [],
}
