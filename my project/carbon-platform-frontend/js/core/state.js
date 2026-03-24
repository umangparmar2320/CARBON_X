/**
 * CarbonX — State Manager
 * Centralized state management for the application.
 */

const State = {
  /**
   * Get a value from localStorage
   */
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('State.get error:', e);
      return null;
    }
  },

  /**
   * Set a value in localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('State.set error:', e);
    }
  },

  /**
   * Remove a key from localStorage
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Clear all CarbonX data from storage (forces re-initialization)
   */
  clearAll() {
    const keys = [
      'carbonx_users', 'carbonx_projects', 'carbonx_prices',
      'carbonx_transactions', 'carbonx_testimonials',
      'carbonx_session', 'carbonx_initialized', 'carbonx_watchlist'
    ];
    keys.forEach(k => localStorage.removeItem(k));
    console.log('All CarbonX data cleared.');
  },

  /**
   * Force refresh data from JSON files
   */
  async forceRefresh() {
    this.clearAll();
    window.location.reload();
  }
};

window.State = State;
