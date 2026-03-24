/**
 * Pie Chart Utility
 * Facade for Chart.js Pie/Doughnut charts.
 */

const PieChart = {
    instances: {},

    /**
     * Render a pie chart on a canvas
     * @param {string} canvasId 
     * @param {Object} data 
     * @param {Object} options 
     */
    render(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destroy existing chart if any
        if (this.instances[canvasId]) {
            this.instances[canvasId].destroy();
        }

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                ...Charts.defaults,
                cutout: '70%',
                ...options
            }
        };

        this.instances[canvasId] = new Chart(ctx, config);
        return this.instances[canvasId];
    }
};

window.PieChart = PieChart;
