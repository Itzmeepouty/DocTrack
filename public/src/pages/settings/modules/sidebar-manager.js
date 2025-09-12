export default class SidebarManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async loadSidebar() {
        try {
            const response = await fetch('/assets/components/admin-sidebar.html');
            this.container.innerHTML = await response.text();
        } catch {
            console.log('Sidebar component not found, continuing without it');
        }
    }
}
