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

function navigateToSection(section) {
    console.log('Navigating to:', section);
    // Here you would implement navigation logic
    // For example: window.location.href = `/admin/${section}`;
    alert(`Navigating to ${section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')} section`);
}