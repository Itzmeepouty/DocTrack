// Main entry point for the admin dashboard
import SidebarLoader from './modules/utils/sidebar-loader.js';
import OfficesCard from './modules/core/offices-card.js';
import UsersCard from './modules/core/users-card.js';
import ActivityLogs from './modules/core/activity-logs.js';
import TransactionCard from './modules/core/transactions-card.js';
import { loadTheme } from '../../../../assets/javascript/theme-manager.js';

document.addEventListener('DOMContentLoaded', async function() {

    try {
        const res = await fetch('/api/validate-token', {
            method: 'GET',
            credentials: 'include',
        });

        if (!res.ok) {
            throw new Error("Invalid token");
        }

        // Apply theme before initializing components
        loadTheme();
        
        SidebarLoader.init();
        OfficesCard.init();
        UsersCard.init();
        TransactionCard.init();
        ActivityLogs.init();

    } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
});