/**
 * Generic UI Module
 * Handles common rendering tasks and UI updates.
 */

const UI = {
    async init() {
        console.log('UI Components initializing...');
        this.renderNavbar();
        this.renderSidebar();
        this.initTooltips();
    },

    /**
     * Render common navbar
     */
    renderNavbar() {
        const navbar = document.getElementById('main-navbar');
        if (!navbar) return;

        const user = Auth.getCurrentUser();
        navbar.innerHTML = `
            <div class="nav-container">
                <div class="nav-left">
                    <button id="sidebar-toggle" class="btn-icon"><i class="fas fa-bars"></i></button>
                    <a href="index.html" class="logo">
                        <i class="fas fa-leaf"></i>
                        <span>CarbonX</span>
                    </a>
                </div>
                <div class="nav-search">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Search projects, news, markets...">
                </div>
                <div class="nav-right">
                    <button id="theme-toggle" class="btn-icon" title="Toggle Theme">
                        <i class="fas fa-moon"></i>
                    </button>
                    <div class="nav-notifications">
                        <button class="btn-icon">
                            <i class="fas fa-bell"></i>
                            <span class="badge">3</span>
                        </button>
                    </div>
                    ${user ? `
                        <div class="nav-user dropdown">
                            <button class="user-btn">
                                <img src="https://i.pravatar.cc/150?u=${user.id}" alt="Avatar">
                                <span>${user.name}</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-content">
                                <a href="profile.html"><i class="fas fa-user-circle"></i> Profile</a>
                                <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                            </div>
                        </div>
                    ` : `
                        <div class="nav-auth">
                            <a href="login.html" class="btn btn-outline">Login</a>
                            <a href="register.html" class="btn btn-primary">Join Free</a>
                        </div>
                    `}
                </div>
            </div>
        `;

        // Logout listener
        const logoutBtn = navbar.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Auth.logout();
            });
        }
    },

    /**
     * Render sidebar navigation
     */
    renderSidebar() {
        const sidebar = document.getElementById('main-sidebar');
        if (!sidebar) return;

        const navItems = [
            { label: 'Dashboard', icon: 'fa-th-large', path: 'dashboard.html' },
            { label: 'Marketplace', icon: 'fa-shopping-cart', path: 'marketplace.html' },
            { label: 'Analytics', icon: 'fa-chart-line', path: 'analytics.html' },
            { label: 'Reports', icon: 'fa-file-alt', path: 'reports.html' },
            { label: 'My Portfolio', icon: 'fa-layer-group', path: 'portfolio.html' },
            { label: 'Settings', icon: 'fa-cog', path: 'profile.html' }
        ];

        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/')) || '/index.html';

        sidebar.innerHTML = `
            <nav class="sidebar-nav">
                <ul>
                    ${navItems.map(item => `
                        <li>
                            <a href="${item.path}" class="nav-link ${page === '/' + item.path ? 'active' : ''}">
                                <i class="fas ${item.icon}"></i>
                                <span>${item.label}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </nav>
            <div class="sidebar-footer">
                <div class="balance-card">
                    <p>Available Balance</p>
                    <h3>$${(state.user?.balance || 0).toLocaleString()}</h3>
                    <button class="btn btn-sm btn-block">Add Funds</button>
                </div>
            </div>
        `;
    },

    /**
     * Render a stat card
     */
    renderStatCard(containerId, title, value, change, icon, color) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="stat-card">
                <div class="stat-icon" style="background: ${color}20; color: ${color}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="stat-info">
                    <h4>${title}</h4>
                    <h3>${value}</h3>
                    <p class="stat-change ${change >= 0 ? 'up' : 'down'}">
                        <i class="fas fa-caret-${change >= 0 ? 'up' : 'down'}"></i>
                        ${Math.abs(change)}%
                        <span>vs last month</span>
                    </p>
                </div>
            </div>
        `;
    },

    initTooltips() {
        // Simple tooltip implementation
    }
};

window.UI = UI;
