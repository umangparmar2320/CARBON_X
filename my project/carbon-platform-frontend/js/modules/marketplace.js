/**
 * Marketplace Module
 * Handles project listing, filtering, buying AND selling credits.
 */

const Marketplace = {
    viewType: 'grid',
    filters: {
        search: '',
        type: 'all',
        risk: 'all',
        sortBy: 'newest'
    },

    init() {
        console.log('Marketplace initializing...');
        this.renderProjects();
        this.initEventListeners();
    },

    initEventListeners() {
        document.getElementById('market-search')?.addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.renderProjects();
        });

        document.getElementById('filter-type')?.addEventListener('change', (e) => {
            this.filters.type = e.target.value;
            this.renderProjects();
        });

        document.getElementById('view-grid')?.addEventListener('click', () => this.setView('grid'));
        document.getElementById('view-table')?.addEventListener('click', () => this.setView('table'));
    },

    setView(type) {
        this.viewType = type;
        document.getElementById('view-grid')?.classList.toggle('active', type === 'grid');
        document.getElementById('view-table')?.classList.toggle('active', type === 'table');
        this.renderProjects();
    },

    getFilteredProjects() {
        if (!state || !state.projects) return [];
        return state.projects.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(this.filters.search) ||
                p.location.toLowerCase().includes(this.filters.search);
            const matchesType = this.filters.type === 'all' || p.type === this.filters.type;
            return matchesSearch && matchesType;
        });
    },

    renderProjects() {
        const container = document.getElementById('marketplace-container');
        if (!container) return;

        const projects = this.getFilteredProjects();

        if (projects.length === 0) {
            container.innerHTML = '<div class="no-results"><i class="fas fa-search" style="font-size:2rem;margin-bottom:1rem;color:var(--text-dim)"></i><br>No projects found matching your criteria.</div>';
            return;
        }

        if (this.viewType === 'grid') {
            container.className = 'projects-grid fade-in';
            container.innerHTML = projects.map(p => this.createProjectCard(p)).join('');
        } else {
            container.className = 'projects-table-container fade-in';
            container.innerHTML = this.createProjectTable(projects);
        }
    },

    /** Check if user has a holding */
    getUserHolding(projectId) {
        if (!state.user || !state.user.portfolio) return null;
        return state.user.portfolio.find(h => h.projectId === projectId);
    },

    /** Check if project is in watchlist */
    isWatched(projectId) {
        return state.user && state.user.watchlist && state.user.watchlist.includes(projectId);
    },

    createProjectCard(p) {
        const holding = this.getUserHolding(p.id);
        const watched = this.isWatched(p.id);

        return `
            <div class="project-card" data-id="${p.id}">
                <div class="card-image">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                    <span class="category-badge">${p.category}</span>
                    <button class="watchlist-btn ${watched ? 'active' : ''}" onclick="Marketplace.toggleWatch('${p.id}')">
                        <i class="fa${watched ? 's' : 'r'} fa-star"></i>
                    </button>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h4>${p.name}</h4>
                        <span class="rating-badge">${p.rating}</span>
                    </div>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${p.location}</p>
                    <div class="card-stats">
                        <div class="stat">
                            <span class="label">Price</span>
                            <span class="value">$${p.price.toFixed(2)}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Available</span>
                            <span class="value">${p.available.toLocaleString()}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Risk</span>
                            <span class="value">${p.risk}</span>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="price-change ${p.change >= 0 ? 'up' : 'down'}">
                            <i class="fas fa-caret-${p.change >= 0 ? 'up' : 'down'}"></i>
                            ${Math.abs(p.change)}%
                        </div>
                        <div style="display:flex;gap:0.5rem;">
                            <button class="btn btn-primary btn-buy" onclick="Marketplace.openBuyModal('${p.id}')">
                                <i class="fas fa-shopping-cart"></i> Buy
                            </button>
                            ${holding ? `
                                <button class="btn btn-outline btn-buy" onclick="Marketplace.openSellModal('${p.id}')" style="border-color: var(--error); color: var(--error);">
                                    <i class="fas fa-hand-holding-usd"></i> Sell
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    ${holding ? `
                        <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border); font-size: 0.8rem; color: var(--primary);">
                            <i class="fas fa-wallet"></i> You hold <strong>${holding.quantity}</strong> credits
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    createProjectTable(projects) {
        return `
            <table class="market-table">
                <thead>
                    <tr>
                        <th>Project</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Change</th>
                        <th>Available</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${projects.map(p => {
            const holding = this.getUserHolding(p.id);
            return `
                        <tr>
                            <td>
                                <div class="project-cell">
                                    <img src="${p.image}" alt="">
                                    <span>${p.name}</span>
                                </div>
                            </td>
                            <td>${p.type}</td>
                            <td>${p.location}</td>
                            <td class="fw-bold">$${p.price.toFixed(2)}</td>
                            <td class="${p.change >= 0 ? 'text-green' : 'text-red'}">
                                <i class="fas fa-caret-${p.change >= 0 ? 'up' : 'down'}"></i> ${Math.abs(p.change)}%
                            </td>
                            <td>${p.available.toLocaleString()}</td>
                            <td><span class="rating-badge">${p.rating}</span></td>
                            <td>
                                <div style="display:flex;gap:0.35rem;">
                                    <button class="btn btn-sm btn-primary" onclick="Marketplace.openBuyModal('${p.id}')">Buy</button>
                                    ${holding ? `<button class="btn btn-sm btn-outline" style="border-color:var(--error);color:var(--error)" onclick="Marketplace.openSellModal('${p.id}')">Sell</button>` : ''}
                                </div>
                            </td>
                        </tr>
                    `;
        }).join('')}
                </tbody>
            </table>
        `;
    },

    /** Toggle watchlist */
    toggleWatch(projectId) {
        if (!state.user) return;
        if (!state.user.watchlist) state.user.watchlist = [];
        const idx = state.user.watchlist.indexOf(projectId);
        if (idx > -1) {
            state.user.watchlist.splice(idx, 1);
        } else {
            state.user.watchlist.push(projectId);
        }
        App.saveState();
        this.renderProjects();
    },

    /* ==========================================================
       BUY MODAL
       ========================================================== */
    openBuyModal(projectId) {
        const project = state.projects.find(p => p.id === projectId);
        if (!project) return;

        const modalHTML = `
            <div id="buy-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-shopping-cart" style="color:var(--primary)"></i> Buy Carbon Credits</h3>
                        <button class="close-modal" onclick="Marketplace.closeModal('buy-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="project-summary">
                            <img src="${project.image}" alt="">
                            <div>
                                <h4>${project.name}</h4>
                                <p>${project.location} • $${project.price.toFixed(2)} / tCO₂e</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Quantity (tCO₂e)</label>
                            <input type="number" id="buy-quantity" min="1" max="${project.available}" value="10">
                            <p class="available">Max available: ${project.available.toLocaleString()} credits</p>
                        </div>
                        <div class="order-summary">
                            <div class="summary-row">
                                <span>Unit Price</span>
                                <span>$${project.price.toFixed(2)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Service Fee (2%)</span>
                                <span id="buy-fee">$${(project.price * 10 * 0.02).toFixed(2)}</span>
                            </div>
                            <hr style="border-color:var(--border);margin:0.5rem 0">
                            <div class="summary-row total">
                                <span>Total Cost</span>
                                <span id="buy-total">$${(project.price * 10 * 1.02).toFixed(2)}</span>
                            </div>
                            <div class="summary-row" style="font-size:0.8rem;color:var(--text-dim)">
                                <span>Your Balance</span>
                                <span>$${(state.user?.balance || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="Marketplace.closeModal('buy-modal')">Cancel</button>
                        <button class="btn btn-primary" id="confirm-buy"><i class="fas fa-check"></i> Confirm Purchase</button>
                    </div>
                </div>
            </div>
        `;

        this._injectModal('buy-modal', modalHTML);

        const quantityInput = document.getElementById('buy-quantity');
        quantityInput.addEventListener('input', () => {
            const qty = parseFloat(quantityInput.value) || 0;
            const subtotal = qty * project.price;
            const fee = subtotal * 0.02;
            document.getElementById('buy-fee').textContent = `$${fee.toFixed(2)}`;
            document.getElementById('buy-total').textContent = `$${(subtotal + fee).toFixed(2)}`;
        });

        document.getElementById('confirm-buy').onclick = () => this.handlePurchase(project.id);
        this._showModal('buy-modal');
    },

    handlePurchase(projectId) {
        const qty = parseFloat(document.getElementById('buy-quantity').value);
        if (!qty || qty <= 0) return;

        const project = state.projects.find(p => p.id === projectId);
        if (!project) return;

        if (qty > project.available) {
            this._notify('Error', `Only ${project.available} credits available.`, 'error');
            return;
        }

        const totalCost = qty * project.price * 1.02;

        if (state.user.balance < totalCost) {
            this._notify('Error', 'Insufficient balance to complete this purchase.', 'error');
            return;
        }

        // Deduct balance
        state.user.balance -= totalCost;
        project.available -= qty;

        // Update or create portfolio holding
        const existingHolding = state.user.portfolio.find(h => h.projectId === projectId);
        if (existingHolding) {
            const totalQty = existingHolding.quantity + qty;
            existingHolding.averagePrice = ((existingHolding.averagePrice * existingHolding.quantity) + (project.price * qty)) / totalQty;
            existingHolding.quantity = totalQty;
        } else {
            state.user.portfolio.push({
                projectId: project.id,
                projectName: project.name,
                quantity: qty,
                averagePrice: project.price
            });
        }

        // Log transaction
        state.transactions.unshift({
            id: 'TX' + Date.now(),
            projectId: project.id,
            projectName: project.name,
            type: 'Buy',
            quantity: qty,
            price: project.price,
            total: totalCost,
            date: new Date().toISOString(),
            status: 'Completed'
        });

        App.saveState();
        this.closeModal('buy-modal');
        this._notify('Purchase Successful', `Bought ${qty} credits of ${project.name} for $${totalCost.toFixed(2)}`, 'success');
        this.renderProjects();
        if (typeof UI !== 'undefined') UI.renderSidebar();
    },

    /* ==========================================================
       SELL MODAL
       ========================================================== */
    openSellModal(projectId) {
        const project = state.projects.find(p => p.id === projectId);
        const holding = this.getUserHolding(projectId);
        if (!project || !holding) return;

        const modalHTML = `
            <div id="sell-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-hand-holding-usd" style="color:var(--error)"></i> Sell Carbon Credits</h3>
                        <button class="close-modal" onclick="Marketplace.closeModal('sell-modal')">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="project-summary">
                            <img src="${project.image}" alt="">
                            <div>
                                <h4>${project.name}</h4>
                                <p>${project.location} • $${project.price.toFixed(2)} / tCO₂e</p>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Quantity to Sell (tCO₂e)</label>
                            <input type="number" id="sell-quantity" min="1" max="${holding.quantity}" value="${Math.min(10, holding.quantity)}">
                            <p class="available">You own: ${holding.quantity} credits (avg cost: $${holding.averagePrice.toFixed(2)})</p>
                        </div>
                        <div class="order-summary">
                            <div class="summary-row">
                                <span>Sell Price</span>
                                <span>$${project.price.toFixed(2)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Platform Fee (1.5%)</span>
                                <span id="sell-fee">-$${(project.price * Math.min(10, holding.quantity) * 0.015).toFixed(2)}</span>
                            </div>
                            <hr style="border-color:var(--border);margin:0.5rem 0">
                            <div class="summary-row total">
                                <span>You Receive</span>
                                <span id="sell-total" style="color:var(--success)">$${(project.price * Math.min(10, holding.quantity) * 0.985).toFixed(2)}</span>
                            </div>
                            <div class="summary-row" style="font-size:0.8rem;">
                                <span style="color:${(project.price - holding.averagePrice) >= 0 ? 'var(--success)' : 'var(--error)'}">
                                    P/L per credit: ${(project.price - holding.averagePrice) >= 0 ? '+' : ''}$${(project.price - holding.averagePrice).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline" onclick="Marketplace.closeModal('sell-modal')">Cancel</button>
                        <button class="btn btn-primary" id="confirm-sell" style="background:var(--error);border-color:var(--error)"><i class="fas fa-check"></i> Confirm Sale</button>
                    </div>
                </div>
            </div>
        `;

        this._injectModal('sell-modal', modalHTML);

        const quantityInput = document.getElementById('sell-quantity');
        quantityInput.addEventListener('input', () => {
            const qty = parseFloat(quantityInput.value) || 0;
            const subtotal = qty * project.price;
            const fee = subtotal * 0.015;
            document.getElementById('sell-fee').textContent = `-$${fee.toFixed(2)}`;
            document.getElementById('sell-total').textContent = `$${(subtotal - fee).toFixed(2)}`;
        });

        document.getElementById('confirm-sell').onclick = () => this.handleSell(project.id);
        this._showModal('sell-modal');
    },

    handleSell(projectId) {
        const qty = parseFloat(document.getElementById('sell-quantity').value);
        if (!qty || qty <= 0) return;

        const project = state.projects.find(p => p.id === projectId);
        const holding = this.getUserHolding(projectId);
        if (!project || !holding) return;

        if (qty > holding.quantity) {
            this._notify('Error', `You only hold ${holding.quantity} credits.`, 'error');
            return;
        }

        const revenue = qty * project.price * 0.985; // After 1.5% fee

        // Add revenue to balance
        state.user.balance += revenue;

        // Reduce or remove holding
        holding.quantity -= qty;
        if (holding.quantity <= 0) {
            state.user.portfolio = state.user.portfolio.filter(h => h.projectId !== projectId);
        }

        // Return credits to market
        project.available += qty;

        // Log transaction
        state.transactions.unshift({
            id: 'TX' + Date.now(),
            projectId: project.id,
            projectName: project.name,
            type: 'Sell',
            quantity: qty,
            price: project.price,
            total: revenue,
            date: new Date().toISOString(),
            status: 'Completed'
        });

        App.saveState();
        this.closeModal('sell-modal');
        this._notify('Sale Completed', `Sold ${qty} credits of ${project.name} for $${revenue.toFixed(2)}`, 'success');
        this.renderProjects();
        if (typeof UI !== 'undefined') UI.renderSidebar();
    },

    /* ==========================================================
       MODAL HELPERS
       ========================================================== */
    _injectModal(id, html) {
        let existing = document.getElementById(id);
        if (existing) existing.remove();
        document.body.insertAdjacentHTML('beforeend', html);
    },

    _showModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        // Small delay for CSS animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(id);
        });
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    },

    /** Safe notification helper */
    _notify(title, message, type) {
        if (typeof Notifications !== 'undefined') {
            Notifications.show(title, message, type);
        } else {
            alert(`${title}: ${message}`);
        }
    }
};

window.Marketplace = Marketplace;
