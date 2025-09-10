// Main entry point for the admin dashboard
import SidebarLoader from './modules/utils/sidebar-loader.js';
import OfficesCard from './modules/core/offices-card.js';
import UsersCard from './modules/core/users-card.js';
import ActivityLogs from './modules/core/activity-logs.js';

// Theme management functions
function loadTheme() {
    const savedTheme = localStorage.getItem('docutrack-theme') || 'light';
    if (savedTheme === 'dark') {
        applyDarkTheme();
    } else {
        applyLightTheme();
    }
}

function applyDarkTheme() {
    const body = document.getElementById('body');
    const cards = document.querySelectorAll('.glass-effect');
    
    body.classList.remove('gradient-bg');
    body.classList.add('gradient-bg-dark', 'dark-theme');
    
    cards.forEach(card => {
        card.classList.remove('glass-effect', 'subtle-shadow');
        card.classList.add('glass-effect-dark', 'subtle-shadow-dark');
    });
}

function applyLightTheme() {
    const body = document.getElementById('body');
    const cards = document.querySelectorAll('.glass-effect');
    
    body.classList.remove('gradient-bg-dark', 'dark-theme');
    body.classList.add('gradient-bg');
    
    cards.forEach(card => {
        card.classList.remove('glass-effect-dark', 'subtle-shadow-dark');
        card.classList.add('glass-effect', 'subtle-shadow');
    });
}

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

        // Apply theme before initializing components
        loadTheme();
        
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