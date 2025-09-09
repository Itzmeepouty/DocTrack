// Main entry point for the admin dashboard
import SidebarLoader from './modules/utils/sidebar-loader.js';
import OfficesCard from './modules/core/offices-card.js';
import UsersCard from './modules/core/users-card.js';
import ActivityLogs from './modules/core/activity-logs.js';

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = '/login';
        return;
    }

    try {
        const res = await fetch('/api/validate-token', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error("Invalid token");
        }

        SidebarLoader.init();
        OfficesCard.init();
        UsersCard.init();
        ActivityLogs.init();

    } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
});