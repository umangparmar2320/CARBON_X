/**
 * Filters Service
 * Shared filtering logic for projects and transactions.
 */

const Filters = {
    /**
     * Filter projects based on criteria
     * @param {Array} projects 
     * @param {Object} criteria 
     */
    apply(projects, criteria) {
        return projects.filter(p => {
            const matchesSearch = !criteria.search ||
                p.name.toLowerCase().includes(criteria.search.toLowerCase()) ||
                p.location.toLowerCase().includes(criteria.search.toLowerCase());
            const matchesType = !criteria.type || criteria.type === 'all' || p.type === criteria.type;
            const matchesRisk = !criteria.risk || criteria.risk === 'all' || p.risk === criteria.risk;
            const matchesCategory = !criteria.category || criteria.category === 'all' || p.category === criteria.category;

            return matchesSearch && matchesType && matchesRisk && matchesCategory;
        });
    },

    /**
     * Sort projects
     * @param {Array} projects 
     * @param {string} sortBy 
     */
    sort(projects, sortBy) {
        const sorted = [...projects];
        switch (sortBy) {
            case 'price-low': return sorted.sort((a, b) => a.price - b.price);
            case 'price-high': return sorted.sort((a, b) => b.price - a.price);
            case 'rating': return sorted.sort((a, b) => a.rating.localeCompare(b.rating));
            default: return sorted;
        }
    }
};

window.Filters = Filters;
