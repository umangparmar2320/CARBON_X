/**
 * Line Chart Utility
 * Facade for Chart.js Line charts.
 */

const LineChart = {
    instances: {},

    /**
     * Render a line chart on a canvas
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
            type: 'line',
            data: data,
            options: {
                ...Charts.defaults,
                elements: {
                    line: {
                        tension: 0.4
                    },
                    point: {
                        radius: 2
                    }
                },
                ...options
            }
        };

        this.instances[canvasId] = new Chart(ctx, config);
        return this.instances[canvasId];
    }
};

window.LineChart = LineChart;
