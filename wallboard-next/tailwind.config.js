module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        "background-1": "url('/images/bg-1.jpg')",
        "background-2": "url('/images/bg-2.jpg')",
        "background-3": "url('/images/bg-3.jpg')",
      }),
      backgroundColour: (theme) => ({
        "bg-mta-primary-a": "#143CB4",
        "bg-mta-primary-b": "#5069D7",
        "bg-mta-primary-c": "#A1DFF6",
        "bg-mta-secondary-a": "#3C0A6E",
        "bg-mta-secondary-b": "#91284B",
        "bg-mta-secondary-c": "#C86491",
        "bg-mta-tertiary-a": "#835D27",
        "bg-mta-tertiary-b": "#D7964B",
        "bg-mta-tertiary-c": "#FAC864",
      }),
      colors: {
        "mta-primary-a": "#143CB4",
        "mta-primary-b": "#5069D7",
        "mta-primary-c": "#A1DFF6",
        "mta-secondary-a": "#3C0A6E",
        "mta-secondary-b": "#91284B",
        "mta-secondary-c": "#C86491",
        "mta-tertiary-a": "#835D27",
        "mta-tertiary-b": "#D7964B",
        "mta-tertiary-c": "#FAC864",
        "mta-smart-blue": "#0E1F49",
        "mta-deep-blue-a": "#070f21",
        "mta-deep-blue-b": "#0a1429",
        "theme-primary-a": "#653259",
        "theme-primary-b": "#5B2C51",
        "theme-primary-c": "#1A1028",
      },
      borderRadius: {
        large: "35px",
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [],
};
