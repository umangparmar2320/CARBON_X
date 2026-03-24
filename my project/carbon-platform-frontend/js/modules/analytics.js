/**
 * Analytics Module
 * Handles market trends and detailed project performance analysis.
 */

const Analytics = {
    init() {
        console.log('Analytics initializing...');
        this.renderMarketOverview();
        this.renderTrendCharts();
        this.renderTopMovers();
    },

    renderMarketOverview() {
        const avgPrice = state.projects.reduce((sum, p) => sum + p.price, 0) / state.projects.length;
        const totalVolume = state.transactions.reduce((sum, tx) => sum + tx.total, 0);

        document.getElementById('market-avg-price').textContent = `$${avgPrice.toFixed(2)}`;
        document.getElementById('market-total-volume').textContent = `$${totalVolume.toLocaleString()}`;
    },

    renderTrendCharts() {
        // Market trend line chart
        const marketHistory = state.prices.market || [100, 105, 110, 108, 115, 120];
        LineChart.render('market-trend-chart', {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
            datasets: [{
                label: 'Market Index',
                data: marketHistory,
                borderColor: '#3b82f6',
                tension: 0.4
            }]
        });

        // Category breakdown pie chart
        const categories = {};
        state.projects.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });

        PieChart.render('market-category-chart', {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
            }]
        });
    },

    renderTopMovers() {
        const container = document.getElementById('top-movers-table');
        if (!container) return;

        const movers = [...state.projects].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 5);

        container.innerHTML = movers.map(p => `
            <tr>
                <td>${p.name}</td>
                <td class="fw-bold">$${p.price.toFixed(2)}</td>
                <td class="${p.change >= 0 ? 'text-green' : 'text-red'}">
                    ${p.change >= 0 ? '+' : ''}${p.change}%
                </td>
                <td><button class="btn btn-sm btn-outline" onclick="window.location.href='project.html?id=${p.id}'">View</button></td>
            </tr>
        `).join('');
    }
};

window.Analytics = Analytics;
