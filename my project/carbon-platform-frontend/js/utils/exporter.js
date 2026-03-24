/**
 * Exporter Utility
 * Handles file generation and downloading.
 */

const Exporter = {
    /**
     * Download an array as CSV
     * @param {Array} data 
     * @param {string} filename 
     */
    toCSV(data, filename) {
        if (!data || !data.length) return;

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        a.click();
    },

    /**
     * Trigger browser print for PDF generation
     */
    toPDF(containerId) {
        window.print();
    }
};

window.Exporter = Exporter;
