/**
 * Portfolio Service
 * Handles portfolio calculations and tracking.
 */

const Portfolio = {
    /**
     * Calculate total portfolio value based on current prices
     */
    calculateTotalValue() {
        if (!state.user || !state.user.portfolio) return 0;

        return state.user.portfolio.reduce((sum, item) => {
            const project = state.projects.find(p => p.id === item.projectId);
            const currentPrice = project ? project.price : item.averagePrice;
            return sum + (item.quantity * currentPrice);
        }, 0);
    },

    /**
     * Calculate profit/loss per holding
     * @param {string} projectId 
     */
    calculatePnL(projectId) {
        const item = state.user.portfolio.find(h => h.projectId === projectId);
        if (!item) return 0;

        const project = state.projects.find(p => p.id === projectId);
        if (!project) return 0;

        const currentVal = item.quantity * project.price;
        const purchaseVal = item.quantity * item.averagePrice;
        return currentVal - purchaseVal;
    },

    /**
     * Calculate total CO2 offset by portfolio
     */
    getTotalOffset() {
        if (!state.user || !state.user.portfolio) return 0;
        return state.user.portfolio.reduce((sum, item) => sum + item.quantity, 0);
    }
};

window.Portfolio = Portfolio;
