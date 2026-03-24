/**
 * Dashboard Module
 * Handles dashboard specific rendering and logic.
 */

const Dashboard = {
    init() {
        console.log('Dashboard initializing...');
        this.renderStats();
        this.renderPortfolioProgress();
        this.renderRecentTransactions();
        this.renderTopProjects();
        this.initCharts();
    },

    renderStats() {
        const user = state.user;
        if (!user) return;

        // Portfolio Value
        const portfolioValue = Portfolio.calculateTotalValue();
        UI.renderStatCard('stat-portfolio', 'Portfolio Value', `$${portfolioValue.toLocaleString()}`, 5.2, 'fa-wallet', '#10b981');

        // Total Credits
        const totalCredits = user.portfolio.reduce((sum, item) => sum + item.quantity, 0);
        UI.renderStatCard('stat-credits', 'Total Credits', `${totalCredits.toLocaleString()} tCO2e`, -1.5, 'fa-leaf', '#3b82f6');

        // Balance
        UI.renderStatCard('stat-balance', 'Available Balance', `$${user.balance.toLocaleString()}`, 0, 'fa-university', '#f59e0b');

        // Emissions Offset
        UI.renderStatCard('stat-offset', 'Emissions Offset', '1,240 t', 12.4, 'fa-cloud-sun', '#8b5cf6');
    },

    renderPortfolioProgress() {
        const progressBar = document.getElementById('net-zero-progress');
        if (!progressBar) return;

        const target = 5000;
        const current = 1240;
        const percentage = (current / target) * 100;

        progressBar.style.width = `${percentage}%`;
        document.getElementById('progress-text').textContent = `${percentage.toFixed(1)}% of annual goal reached`;
    },

    renderRecentTransactions() {
        const container = document.getElementById('recent-transactions-table');
        if (!container) return;

        const transactions = Transactions.getRecent(5);
        if (transactions.length === 0) {
            container.innerHTML = '<tr><td colspan="5" class="text-center">No recent transactions</td></tr>';
            return;
        }

        container.innerHTML = transactions.map(tx => `
            <tr>
                <td>
                    <div class="tx-info">
                        <span class="tx-icon ${tx.type.toLowerCase()}">
                            <i class="fas ${tx.type === 'Buy' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                        </span>
                        <span>${tx.projectName}</span>
                    </div>
                </td>
                <td>${tx.type}</td>
                <td>${tx.quantity} tCO2e</td>
                <td class="fw-bold">$${tx.total.toLocaleString()}</td>
                <td><span class="status-badge ${tx.status.toLowerCase()}">${tx.status}</span></td>
            </tr>
        `).join('');
    },

    renderTopProjects() {
        const container = document.getElementById('top-projects-list');
        if (!container) return;

        const topProjects = state.projects.slice(0, 3);
        container.innerHTML = topProjects.map(p => `
            <div class="project-item">
                <img src="${p.image}" alt="${p.name}">
                <div class="project-info">
                    <h5>${p.name}</h5>
                    <p>${p.location} • ${p.type}</p>
                </div>
                <div class="project-price">
                    <span>$${p.price.toFixed(2)}</span>
                    <span class="change ${p.change >= 0 ? 'up' : 'down'}">${p.change >= 0 ? '+' : ''}${p.change}%</span>
                </div>
            </div>
        `).join('');
    },

    initCharts() {
        // Line chart for portfolio growth
        LineChart.render('portfolio-chart', {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Portfolio Value',
                data: [42000, 43500, 45000, 44800, 47000, 50000],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true
            }]
        });

        // Pie chart for emissions breakdown
        PieChart.render('emissions-chart', {
            labels: ['Energy', 'Transport', 'Waste', 'Industry'],
            datasets: [{
                data: [45, 25, 15, 15],
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
            }]
        });
    }
};

window.Dashboard = Dashboard;
