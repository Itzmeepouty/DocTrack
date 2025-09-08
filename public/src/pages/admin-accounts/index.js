import { initializeUserTable, UserTableManager } from "./modules/table_init.js";

function loadSidebar() {
    fetch('/assets/components/admin-sidebar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
        })
        .catch(error => {
            console.log('Sidebar component not found, continuing without it');
        });
}

document.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
    initializeUserTable();
});