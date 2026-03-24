/**
 * Modal Module
 * Handles open, close and interaction with modals.
 */

const Modal = {
    /**
     * Open a modal by ID
     * @param {string} modalId 
     */
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close(modalId);
            }
        });

        // Close on ESC key
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                this.close(modalId);
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    },

    /**
     * Close a modal by ID
     * @param {string} modalId 
     */
    close(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('active');
        document.body.style.overflow = '';
    },

    /**
     * Show a confirmation modal
     * @param {string} title 
     * @param {string} message 
     * @param {Function} onConfirm 
     */
    confirm(title, message, onConfirm) {
        let modal = document.getElementById('confirm-modal');
        if (!modal) {
            // Create confirm modal if not exists
            const modalHTML = `
                <div id="confirm-modal" class="modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 id="confirm-title">${title}</h3>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p id="confirm-message">${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-outline" id="confirm-cancel">Cancel</button>
                            <button class="btn btn-primary" id="confirm-ok">Confirm</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            modal = document.getElementById('confirm-modal');
        }

        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-message').textContent = message;

        const cancelBtn = modal.querySelector('#confirm-cancel');
        const okBtn = modal.querySelector('#confirm-ok');
        const closeBtn = modal.querySelector('.close-modal');

        const cleanUp = () => {
            this.close('confirm-modal');
            okBtn.removeEventListener('click', handleOk);
            cancelBtn.removeEventListener('click', cleanUp);
            closeBtn.removeEventListener('click', cleanUp);
        };

        const handleOk = () => {
            onConfirm();
            cleanUp();
        };

        okBtn.addEventListener('click', handleOk);
        cancelBtn.addEventListener('click', cleanUp);
        closeBtn.addEventListener('click', cleanUp);

        this.open('confirm-modal');
    }
};

window.Modal = Modal;
