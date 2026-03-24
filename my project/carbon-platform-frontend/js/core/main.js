/**
 * Main Entry Point
 * Initializes the application, state, and global components.
 */

const DATA_VERSION = '3'; // Increment this when projects.json changes to force re-fetch

const App = {
    state: {
        user: null,
        projects: [],
        prices: {},
        transactions: [],
        theme: 'dark'
    },

    _readyCallbacks: [],

    async init() {
        console.log('CarbonX initializing...');

        // 1. Load Data (force refresh if data version changed)
        await this.loadInitialData();

        // 2. Initialize State from Storage
        this.initState();

        // 3. Initialize Core Modules (safely)
        if (typeof Router !== 'undefined') Router.init();
        if (typeof Theme !== 'undefined') Theme.init();
        if (typeof Sidebar !== 'undefined') Sidebar.init();

        // 4. Load Components (only if UI module is loaded)
        if (typeof UI !== 'undefined') {
            await UI.init();
        }

        // 5. Start Services (only if on authenticated pages)
        if (typeof PriceSimulator !== 'undefined' && this.state.user) {
            PriceSimulator.start();
        }

        console.log('CarbonX ready. Projects loaded:', this.state.projects.length);

        // 6. Fire ready callbacks (page-specific inits)
        this._readyCallbacks.forEach(fn => fn());
        this._readyCallbacks = [];
    },

    /**
     * Register a callback to run after App is fully initialized
     */
    onReady(fn) {
        if (this.state.projects.length > 0) {
            // Already initialized
            fn();
        } else {
            this._readyCallbacks.push(fn);
        }
    },

    /**
     * Load JSON data into state/localStorage if not already present
     * or if the data version has changed
     */
    async loadInitialData() {
        const storedVersion = localStorage.getItem('carbonx_data_version');
        const needsRefresh = !localStorage.getItem('carbonx_initialized') || storedVersion !== DATA_VERSION;

        if (needsRefresh) {
            try {
                // Preserve user session/transactions if they exist
                const existingSession = localStorage.getItem('carbonx_session');
                const existingTransactions = localStorage.getItem('carbonx_transactions');
                const existingUsers = localStorage.getItem('carbonx_users');

                const [users, projects, prices, testimonials] = await Promise.all([
                    fetch('data/users.json').then(res => res.json()),
                    fetch('data/projects.json').then(res => res.json()),
                    fetch('data/prices.json').then(res => res.json()),
                    fetch('data/testimonials.json').then(res => res.json())
                ]);

                // Only reset users if no existing user data
                if (!existingUsers) {
                    localStorage.setItem('carbonx_users', JSON.stringify(users));
                }

                localStorage.setItem('carbonx_projects', JSON.stringify(projects));
                localStorage.setItem('carbonx_prices', JSON.stringify(prices));
                localStorage.setItem('carbonx_testimonials', JSON.stringify(testimonials));

                // Only reset transactions if none exist
                if (!existingTransactions) {
                    localStorage.setItem('carbonx_transactions', JSON.stringify([]));
                }

                localStorage.setItem('carbonx_initialized', 'true');
                localStorage.setItem('carbonx_data_version', DATA_VERSION);

                console.log('Data loaded/refreshed (version: ' + DATA_VERSION + '). Projects:', projects.length);
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        }
    },

    /**
     * Initialize app state from localStorage and session
     */
    initState() {
        this.state.user = typeof Auth !== 'undefined' ? Auth.getCurrentUser() : null;
        this.state.projects = JSON.parse(localStorage.getItem('carbonx_projects')) || [];
        this.state.prices = JSON.parse(localStorage.getItem('carbonx_prices')) || {};
        this.state.transactions = JSON.parse(localStorage.getItem('carbonx_transactions')) || [];
        this.state.theme = localStorage.getItem('carbonx_theme') || 'dark';

        window.state = this.state;
        console.log('State initialized. Projects in state:', this.state.projects.length);
    },

    /**
     * Save current state to localStorage
     */
    saveState() {
        localStorage.setItem('carbonx_projects', JSON.stringify(this.state.projects));
        localStorage.setItem('carbonx_transactions', JSON.stringify(this.state.transactions));

        if (this.state.user) {
            localStorage.setItem('carbonx_session', JSON.stringify(this.state.user));

            const users = JSON.parse(localStorage.getItem('carbonx_users')) || [];
            const index = users.findIndex(u => u.id === this.state.user.id);
            if (index !== -1) {
                users[index] = this.state.user;
                localStorage.setItem('carbonx_users', JSON.stringify(users));
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

window.App = App;
