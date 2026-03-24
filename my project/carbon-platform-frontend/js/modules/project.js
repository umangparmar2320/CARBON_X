/**
 * Project Detail Module
 * Handles project-specific overview and price history.
 */

const ProjectDetail = {
    init() {
        console.log('Project Detail initializing...');
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        if (!projectId) {
            window.location.href = 'marketplace.html';
            return;
        }

        const project = state.projects.find(p => p.id === projectId);
        if (!project) {
            window.location.href = 'marketplace.html';
            return;
        }

        this.render(project);
    },

    render(p) {
        document.getElementById('project-name').textContent = p.name;
        document.getElementById('project-location').textContent = `${p.location} • ${p.type}`;
        document.getElementById('project-price').textContent = `$${p.price.toFixed(2)}`;
        document.getElementById('project-change').textContent = `${p.change >= 0 ? '+' : ''}${p.change}%`;
        document.getElementById('project-available').textContent = `${p.available.toLocaleString()} credits available`;
        document.getElementById('project-description').textContent = p.description;
        document.getElementById('project-img').src = p.image;
        document.getElementById('project-rating').textContent = p.rating;
        document.getElementById('project-risk').textContent = p.risk;

        // Render history chart
        const history = state.prices[p.id] || [];
        LineChart.render('project-history-chart', {
            labels: history.map((_, i) => `T-${history.length - i}`),
            datasets: [{
                label: 'Price History',
                data: history,
                borderColor: '#10b981',
                fill: false
            }]
        });

        // Setup buy button
        document.getElementById('btn-buy-now').onclick = () => Marketplace.openBuyModal(p.id);
    }
};

window.ProjectDetail = ProjectDetail;
