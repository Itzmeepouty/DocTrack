import { OfficeManager } from './modules/managers/officeManager.js';
import { loadSidebar } from './modules/ui/sidebar.js';
import { loadTheme } from '../../../../assets/javascript/theme-manager.js';

document.addEventListener('DOMContentLoaded', async function() {
    

    try {
        const res = await fetch('/api/validate-token', {
            method: 'GET',
            credentials: 'include'
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