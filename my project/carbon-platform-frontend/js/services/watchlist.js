/**
 * Watchlist Service
 * Handles user watchlist persistence.
 */

const Watchlist = {
    toggle(projectId) {
        const index = state.user.watchlist.indexOf(projectId);
        if (index === -1) {
            state.user.watchlist.push(projectId);
            Notifications.show('Success', 'Project added to watchlist!', 'info');
        } else {
            state.user.watchlist.splice(index, 1);
            Notifications.show('Removed', 'Project removed from watchlist!', 'info');
        }
        App.saveState();

        // Refresh UI
        if (window.location.pathname.includes('marketplace.html')) Marketplace.renderProjects();
        if (window.location.pathname.includes('project.html')) {
            const btn = document.querySelector('.watchlist-btn');
            if (btn) {
                btn.classList.toggle('active', state.user.watchlist.includes(projectId));
                btn.querySelector('i').className = state.user.watchlist.includes(projectId) ? 'fas fa-star' : 'far fa-star';
            }
        }
    }
};

window.Watchlist = Watchlist;
