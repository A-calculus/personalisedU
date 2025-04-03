// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
const config = {
    // Adjust these paths based on your project structure (app router vs pages, src directory vs root)
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Include if using pages router
      "./components/**/*.{js,ts,jsx,tsx,mdx}", // Include your components folder
      "./src/**/*.{js,ts,jsx,tsx,mdx}", // Include if using a src directory
    ],
    theme: {
      extend: {
        // Add your theme customizations here
      },
    },
    plugins: [
      // Add any Tailwind plugins here (e.g., require('@tailwindcss/forms'))
    ],
  };
  
  export default config;