/**
 * Price Simulator Service
 * Simulates live price changes for the marketplace.
 */

const PriceSimulator = {
    interval: null,
    config: {
        simulationInterval: 5000, // 5 seconds
        maxVolatility: 0.02 // 2%
    },

    start() {
        if (this.interval) clearInterval(this.interval);

        console.log('Price Simulator started.');
        this.interval = setInterval(() => {
            this.simulate();
        }, this.config.simulationInterval);
    },

    stop() {
        clearInterval(this.interval);
        this.interval = null;
    },

    simulate() {
        const projects = state.projects;
        let changed = false;

        projects.forEach(p => {
            // Random price move
            const volatility = (Math.random() * 2 - 1) * this.config.maxVolatility;
            const change = p.price * volatility;
            p.price += change;

            // Update percentage change
            const prevPrice = p.price - change;
            p.change = parseFloat(((p.price - prevPrice) / prevPrice * 100).toFixed(2));

            // Limit price to minimum 1.0
            if (p.price < 1) p.price = 1;

            // Trigger animation if in marketplace or dashboard
            this.updateUI(p.id, p.price, p.change);
            changed = true;
        });

        if (changed) {
            // Update prices.json history
            const today = new Date().toISOString().split('T')[0];
            // In a real app we'd save to history, but for simplicity we just update state
        }
    },

    /**
     * Update UI elements that show prices
     */
    updateUI(projectId, price, change) {
        const priceElements = document.querySelectorAll(`[data-id="${projectId}"] .value, [data-id="${projectId}"] .project-price span:first-child`);
        const changeElements = document.querySelectorAll(`[data-id="${projectId}"] .price-change, [data-id="${projectId}"] .change`);

        priceElements.forEach(el => {
            const oldPrice = parseFloat(el.textContent.replace('$', ''));
            el.textContent = `$${price.toFixed(2)}`;

            // Add flash animation
            if (price > oldPrice) {
                el.classList.add('flash-green');
            } else if (price < oldPrice) {
                el.classList.add('flash-red');
            }
            setTimeout(() => el.classList.remove('flash-green', 'flash-red'), 1000);
        });

        changeElements.forEach(el => {
            el.className = `price-change ${change >= 0 ? 'up' : 'down'}`;
            el.innerHTML = `
                <i class="fas fa-caret-${change >= 0 ? 'up' : 'down'}"></i>
                ${Math.abs(change)}%
            `;
        });

        // Update ticker if active
        Ticker.update(projectId, price, change);
    }
};

window.PriceSimulator = PriceSimulator;
