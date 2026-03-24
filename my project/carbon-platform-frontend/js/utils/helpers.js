/**
 * CarbonX — Global Helpers
 * Reusable utility functions used across all modules.
 */

const Helpers = {
  /**
   * Format currency
   * @param {number} amount
   * @returns {string}
   */
  formatCurrency(amount) {
    return '$' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },

  /**
   * Format large numbers (e.g. 1200 → 1.2K)
   */
  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  },

  /**
   * Format date to readable string
   */
  formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  /**
   * Format date with time
   */
  formatDateTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  },

  /**
   * Calculate percentage change
   */
  percentChange(oldVal, newVal) {
    if (oldVal === 0) return 0;
    return ((newVal - oldVal) / oldVal * 100).toFixed(2);
  },

  /**
   * Generate a unique ID
   */
  generateId(prefix = 'id') {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  /**
   * Debounce function calls
   */
  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Truncate text with ellipsis
   */
  truncate(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Get time ago string (e.g. "2 hours ago")
   */
  timeAgo(dateStr) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 }
    ];
    for (const { label, seconds: s } of intervals) {
      const count = Math.floor(seconds / s);
      if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
    }
    return 'Just now';
  }
};

window.Helpers = Helpers;
