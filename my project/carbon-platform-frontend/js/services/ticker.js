/**
 * Price Ticker Service
 * Handles the horizontal scrolling price ticker logic.
 */

const Ticker = {
    init() {
        const ticker = document.getElementById('price-ticker');
        if (!ticker) return;

        this.render();
    },

    render() {
        const ticker = document.getElementById('price-ticker');
        if (!ticker) return;

        const content = state.projects.map(p => `
            <div class="ticker-item" data-id="${p.id}">
                <span class="ticker-name">${p.name}</span>
                <span class="ticker-price">$${p.price.toFixed(2)}</span>
                <span class="ticker-change ${p.change >= 0 ? 'up' : 'down'}">
                    ${p.change >= 0 ? '+' : ''}${p.change}%
                </span>
            </div>
        `).join('');

        // Duplicate for seamless loop
        ticker.innerHTML = `<div class="ticker-wrap">${content}${content}</div>`;
    },

    update(projectId, price, change) {
        const items = document.querySelectorAll(`#price-ticker [data-id="${projectId}"]`);
        items.forEach(el => {
            const priceEl = el.querySelector('.ticker-price');
            const changeEl = el.querySelector('.ticker-change');

            if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`;
            if (changeEl) {
                changeEl.className = `ticker-change ${change >= 0 ? 'up' : 'down'}`;
                changeEl.textContent = `${change >= 0 ? '+' : ''}${change}%`;
            }
        });
    }
};

window.Ticker = Ticker;
