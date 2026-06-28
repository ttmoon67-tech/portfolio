/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        card: 'var(--card)',
        ring: 'var(--ring)',
        input: 'var(--input)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        popover: 'var(--popover)',
        primary: 'var(--primary)',
        sidebar: 'var(--sidebar)',
        secondary: 'var(--secondary)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        destructive: 'var(--destructive)',
      },
      fontFamily: {
        sans: ["'Alibaba PuHuiTi'", "'PingFang SC'", "'Microsoft YaHei'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}
