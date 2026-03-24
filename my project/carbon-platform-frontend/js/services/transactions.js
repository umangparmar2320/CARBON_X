/**
 * Transactions Service
 * Handles transaction history retrieval and filtering.
 */

const Transactions = {
    /**
     * Get recent transactions
     * @param {number} limit 
     */
    getRecent(limit = 10) {
        return state.transactions.slice(0, limit);
    },

    /**
     * Get transactions by date range
     * @param {Date} start 
     * @param {Date} end 
     */
    getByRange(start, end) {
        return state.transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate >= start && txDate <= end;
        });
    },

    /**
     * Save a new transaction
     * @param {Object} tx 
     */
    add(tx) {
        state.transactions.unshift(tx);
        App.saveState();
    }
};

window.Transactions = Transactions;
