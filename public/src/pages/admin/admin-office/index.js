import { OfficeManager } from './modules/managers/officeManager.js';
import { loadSidebar } from './modules/ui/sidebar.js';
import { loadTheme } from '../../../../assets/javascript/theme-manager.js';

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
        
        loadTheme();
        
        loadSidebar();
        OfficeManager.init();

    } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
});