function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const toggleIcon = document.getElementById('toggle-icon');
    
    sidebar.classList.toggle('retracted');
    mainContent.classList.toggle('expanded');
    
    // Toggle icon
    if (sidebar.classList.contains('retracted')) {
        toggleIcon.className = 'fas fa-chevron-right';
    } else {
        toggleIcon.className = 'fas fa-bars';
    }
}