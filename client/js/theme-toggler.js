// Add a media query to switch between light and dark themes based on system settings
function handleMediaQuery(mq) {
  if (mq.matches) {
    // If the media query matches, switch to dark theme
    document.documentElement.className = "theme-dark";
  } else {
    // If the media query doesn't match, switch to light theme
    document.documentElement.className = "theme-light";
  }
}

// Initialize the theme based on the system settings
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleMediaQuery);

// Switch theme when the page is loaded
handleMediaQuery(window.matchMedia("(prefers-color-scheme: dark)"));