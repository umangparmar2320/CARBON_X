/**
 * CarbonX — Application Constants
 */

const Constants = {
  /** App Info */
  APP_NAME: 'CarbonX',
  APP_VERSION: '1.0.0',
  APP_TAGLINE: 'Carbon Credit Exchange & Intelligence Platform',

  /** LocalStorage Keys */
  STORAGE_KEYS: {
    USERS: 'carbonx_users',
    PROJECTS: 'carbonx_projects',
    PRICES: 'carbonx_prices',
    TRANSACTIONS: 'carbonx_transactions',
    TESTIMONIALS: 'carbonx_testimonials',
    SESSION: 'carbonx_session',
    THEME: 'carbonx_theme',
    WATCHLIST: 'carbonx_watchlist',
    INITIALIZED: 'carbonx_initialized'
  },

  /** Demo User */
  DEMO_USER: {
    username: 'demo',
    password: 'password123'
  },

  /** Navigation Items */
  NAV_ITEMS: [
    { label: 'Dashboard', icon: 'fa-th-large', path: 'dashboard.html' },
    { label: 'Marketplace', icon: 'fa-shopping-cart', path: 'marketplace.html' },
    { label: 'Analytics', icon: 'fa-chart-line', path: 'analytics.html' },
    { label: 'Reports', icon: 'fa-file-alt', path: 'reports.html' },
    { label: 'My Portfolio', icon: 'fa-layer-group', path: 'portfolio.html' },
    { label: 'Settings', icon: 'fa-cog', path: 'profile.html' }
  ],

  /** Price Simulator */
  PRICE_UPDATE_INTERVAL: 5000,
  MAX_VOLATILITY: 0.02,

  /** Protected Pages (require login) */
  PROTECTED_PAGES: ['dashboard.html', 'marketplace.html', 'analytics.html', 'reports.html', 'portfolio.html', 'profile.html'],

  /** Auth Pages (redirect if already logged in) */
  AUTH_PAGES: ['login.html', 'register.html']
};

window.Constants = Constants;
