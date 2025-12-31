import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Scans your new App Router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Scans legacy pages (safety net)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Scans shared components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;