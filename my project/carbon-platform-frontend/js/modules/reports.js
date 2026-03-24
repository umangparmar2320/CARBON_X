/**
 * Reports Module
 * Handles ESG reporting and transaction exports.
 */

const Reports = {
    init() {
        console.log('Reports initializing...');
        this.renderSummary();
        this.renderHistory();
        this.initEventListeners();
    },

    initEventListeners() {
        document.getElementById('export-pdf')?.addEventListener('click', () => Exporter.toPDF('report-container'));
        document.getElementById('export-csv')?.addEventListener('click', () => Exporter.toCSV(state.transactions, 'carbon_transactions.csv'));
    },

    renderSummary() {
        const totalBought = state.transactions
            .filter(tx => tx.type === 'Buy')
            .reduce((sum, tx) => sum + tx.quantity, 0);

        const totalSpent = state.transactions
            .filter(tx => tx.type === 'Buy')
            .reduce((sum, tx) => sum + tx.total, 0);

        document.getElementById('report-total-bought').textContent = `${totalBought.toLocaleString()} tCO2e`;
        document.getElementById('report-total-spent').textContent = `$${totalSpent.toLocaleString()}`;
    },

    renderHistory() {
        const container = document.getElementById('reports-history-table');
        if (!container) return;

        container.innerHTML = state.transactions.map(tx => `
            <tr>
                <td>${new Date(tx.date).toLocaleDateString()}</td>
                <td>${tx.projectName}</td>
                <td>${tx.type}</td>
                <td>${tx.quantity}</td>
                <td>$${tx.price.toFixed(2)}</td>
                <td class="fw-bold">$${tx.total.toLocaleString()}</td>
            </tr>
        `).join('');
    }
};

window.Reports = Reports;
