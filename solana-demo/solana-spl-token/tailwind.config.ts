/*
 * @description: 描述信息
 * @author: Jack Chen @懒人码农
 * @Date: 2025-02-09 22:54:41
 * @LastEditors: Jack Chen
 * @LastEditTime: 2025-02-10 00:01:26
 */
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
        "dark-primary": "#0f172a",
        "dark-secondary": "#1e293b",
        accent: "#6366f1",
      },
    },
  },
  plugins: [],
} satisfies Config;
