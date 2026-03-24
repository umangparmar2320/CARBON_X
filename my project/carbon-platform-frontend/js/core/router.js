/**
 * Router Module
 * Handles client-side routing and page protection.
 */

const Router = {
  protectedRoutes: [
    '/dashboard.html',
    '/marketplace.html',
    '/profile.html',
    '/project.html',
    '/reports.html',
    '/analytics.html'
  ],

  authRoutes: [
    '/login.html',
    '/register.html'
  ],

  init() {
    this.checkAuth();
    this.highlightActiveLink();

    window.addEventListener('popstate', () => {
      this.checkAuth();
    });
  },

  /**
   * Check if current page is protected and user is authenticated
   */
  checkAuth() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/')) || '/index.html';
    const isAuthenticated = Auth.isAuthenticated();

    if (this.protectedRoutes.includes(page) && !isAuthenticated) {
      window.location.href = 'login.html';
    } else if (this.authRoutes.includes(page) && isAuthenticated) {
      window.location.href = 'dashboard.html';
    }
  },

  /**
   * Navigate to a new page
   * @param {string} path 
   */
  navigate(path) {
    window.location.href = path;
  },

  /**
   * Highlight active navigation link
   */
  highlightActiveLink() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/')) || '/index.html';

    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === page || (page === '/' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};

window.Router = Router;
