/**
 * Notifications Service
 * Handles on-screen toast notifications and alerts.
 */

const Notifications = {
    /**
     * Show a toast notification
     * @param {string} title 
     * @param {string} message 
     * @param {string} type - 'success', 'error', 'info', 'warning'
     * @param {number} duration 
     */
    show(title, message, type = 'info', duration = 5000) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };

        toast.innerHTML = `
            <div class="toast-icon"><i class="fas ${icons[type]}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Auto-remove
        const timeout = setTimeout(() => {
            this.remove(toast);
        }, duration);

        toast.querySelector('.toast-close').onclick = () => {
            clearTimeout(timeout);
            this.remove(toast);
        };

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
    },

    remove(toast) {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }
};

window.Notifications = Notifications;
