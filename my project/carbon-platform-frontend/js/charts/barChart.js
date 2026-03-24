/**
 * Bar Chart Utility
 * Facade for Chart.js Bar charts.
 */

const BarChart = {
    instances: {},

    /**
     * Render a bar chart on a canvas
     * @param {string} canvasId 
     * @param {Object} data 
     * @param {Object} options 
     */
    render(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.instances[canvasId]) {
            this.instances[canvasId].destroy();
        }

        const config = {
            type: 'bar',
            data: data,
            options: {
                ...Charts.defaults,
                borderRadius: 4,
                ...options
            }
        };

        this.instances[canvasId] = new Chart(ctx, config);
        return this.instances[canvasId];
    }
};

window.BarChart = BarChart;
