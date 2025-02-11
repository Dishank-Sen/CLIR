/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html', // Include all HTML files in the public folder
    './public/**/*.js',   // Include all JavaScript files in the public folder
    './views/**/*.html',  // Include HTML files if you have a separate views folder
  ],
  theme: {
    extend: {
      screens: {
        'custom-lg': '950px', // Define a custom breakpoint
      },
    },
  },
  plugins: [],
}

