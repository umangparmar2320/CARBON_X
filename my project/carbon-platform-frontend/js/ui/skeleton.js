/**
 * Skeleton Loader Module
 * Handles showing and hiding skeleton loaders.
 */

const Skeleton = {
    /**
     * Show skeleton loaders in a container
     * @param {string} selector 
     * @param {string} type - 'card', 'table', 'chart'
     * @param {number} count 
     */
    show(selector, type = 'card', count = 3) {
        const container = document.querySelector(selector);
        if (!container) return;

        container.classList.add('skeleton-loading');
        let html = '';

        if (type === 'card') {
            for (let i = 0; i < count; i++) {
                html += `
                    <div class="skeleton-card">
                        <div class="skeleton-img"></div>
                        <div class="skeleton-text title"></div>
                        <div class="skeleton-text body"></div>
                        <div class="skeleton-text footer"></div>
                    </div>
                `;
            }
        } else if (type === 'table') {
            html = `
                <div class="skeleton-table">
                    <div class="skeleton-row header"></div>
                    ${Array(count).fill('<div class="skeleton-row"></div>').join('')}
                </div>
            `;
        }

        container.innerHTML = html;
    },

    /**
     * Hide skeleton loaders
     * @param {string} selector 
     */
    hide(selector) {
        const container = document.querySelector(selector);
        if (container) {
            container.classList.remove('skeleton-loading');
        }
    }
};

window.Skeleton = Skeleton;
