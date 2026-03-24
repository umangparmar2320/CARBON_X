/**
 * Theme Module
 * Handles light/dark mode switching and persistence.
 */

const Theme = {
  init() {
    const savedTheme = localStorage.getItem('carbonx_theme') || 'dark';
    this.apply(savedTheme);

    // Listen for toggle button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-toggle')) {
        this.toggle();
      }
    });
  },

  toggle() {
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.apply(newTheme);
    localStorage.setItem('carbonx_theme', newTheme);
  },

  apply(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }

    const icon = document.querySelector('#theme-toggle i');
    if (icon) {
      if (theme === 'light') {
        icon.classList.replace('fa-moon', 'fa-sun');
      } else {
        icon.classList.replace('fa-sun', 'fa-moon');
      }
    }
  }
};

window.Theme = Theme;