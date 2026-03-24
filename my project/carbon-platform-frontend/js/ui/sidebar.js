/**
 * Sidebar Module
 * Handles sidebar specific logic like mobile toggling.
 */

const Sidebar = {
    init() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#sidebar-toggle')) {
                this.toggle();
            }
            if (e.target.closest('.sidebar-overlay')) {
                this.close();
            }
        });
    },

    toggle() {
        const sidebar = document.getElementById('main-sidebar');
        if (!sidebar) return;

        sidebar.classList.toggle('open');
        this.toggleOverlay(sidebar.classList.contains('open'));
    },

    close() {
        const sidebar = document.getElementById('main-sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
            this.toggleOverlay(false);
        }
    },

    toggleOverlay(show) {
        let overlay = document.querySelector('.sidebar-overlay');
        if (show) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
            }
            setTimeout(() => overlay.classList.add('show'), 10);
        } else if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 300);
        }
    }
};

window.Sidebar = Sidebar;
