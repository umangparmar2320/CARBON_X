/**
 * Profile Module
 * Handles user profile management and settings.
 */

const Profile = {
    init() {
        console.log('Profile initializing...');
        this.renderUserInfo();
        this.initEventListeners();
    },

    initEventListeners() {
        document.getElementById('profile-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSave();
        });
    },

    renderUserInfo() {
        const user = state.user;
        if (!user) return;

        const inputs = {
            'profile-name': user.name,
            'profile-email': user.email,
            'profile-role': user.role
        };

        for (const [id, value] of Object.entries(inputs)) {
            const el = document.getElementById(id);
            if (el) el.value = value;
        }

        document.getElementById('profile-avatar-img').src = `https://i.pravatar.cc/150?u=${user.id}`;
        document.getElementById('profile-full-name').textContent = user.name;
        document.getElementById('profile-subtitle').textContent = user.role;
    },

    handleSave() {
        const user = state.user;
        user.name = document.getElementById('profile-name').value;
        user.email = document.getElementById('profile-email').value;
        user.role = document.getElementById('profile-role').value;

        App.saveState();
        Notifications.show('Success', 'Profile updated successfully!', 'success');
        UI.renderNavbar();
    }
};

window.Profile = Profile;
