import { OfficeManager } from './modules/managers/officeManager.js';

function loadSidebar() {
    fetch('/assets/components/admin-sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
        })
        .catch(() => {
            console.log('Sidebar component not found, continuing without it');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadSidebar();
    OfficeManager.init();
});
