/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
      extend: { 
        colors:{
          burnt: '#2b2b2b',
          semiburnt: '#958686',
          burning: '#343434'
      }
    }
  },
  plugins: []
}
