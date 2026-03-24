/**
 * Charting Module
 * Wraps Chart.js with global defaults and helper functions.
 */

const Charts = {
    defaults: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#94a3b8',
                    font: {
                        family: 'Inter'
                    }
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)'
                },
                ticks: {
                    color: '#94a3b8'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#94a3b8'
                }
            }
        }
    },

    getThemeColors() {
        const isDark = !document.body.classList.contains('light-mode');
        return {
            background: isDark ? '#1e293b' : '#ffffff',
            text: isDark ? '#94a3b8' : '#64748b',
            grid: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)'
        };
    }
};

window.Charts = Charts;
