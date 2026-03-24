/**
 * Authentication Module
 * Handles login, registration, and session management.
 */

const Auth = {
  /**
   * Login user by validating against users in state/localStorage
   * @param {string} username 
   * @param {string} password 
   */
  async login(username, password) {
    const users = JSON.parse(localStorage.getItem('carbonx_users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      this.setSession(user);
      return { success: true, user };
    }
    return { success: false, message: 'Invalid username or password' };
  },

  /**
   * Register a new user
   * @param {Object} userData 
   */
  async register(userData) {
    const users = JSON.parse(localStorage.getItem('carbonx_users')) || [];

    if (users.find(u => u.username === userData.username)) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser = {
      id: 'u' + Date.now(),
      balance: 50000,
      portfolio: [],
      watchlist: [],
      notifications: [],
      ...userData
    };

    users.push(newUser);
    localStorage.setItem('carbonx_users', JSON.stringify(users));
    this.setSession(newUser);

    return { success: true, user: newUser };
  },

  /**
   * Logout user and clear session
   */
  logout() {
    localStorage.removeItem('carbonx_session');
    window.location.href = 'login.html';
  },

  /**
   * Set active session
   * @param {Object} user 
   */
  setSession(user) {
    localStorage.setItem('carbonx_session', JSON.stringify(user));
  },

  /**
   * Get current user from session
   */
  getCurrentUser() {
    const session = localStorage.getItem('carbonx_session');
    return session ? JSON.parse(session) : null;
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  },

  /**
   * Password show/hide toggle logic
   * @param {string} inputId 
   * @param {string} toggleId 
   */
  togglePassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);

    if (input.type === 'password') {
      input.type = 'text';
      toggle.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = 'password';
      toggle.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }
};

window.Auth = Auth;
