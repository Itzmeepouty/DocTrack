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

function openLogoutModal() {
    document.getElementById('logoutModal').classList.remove('hidden');
}

function closeLogoutModal() {
    document.getElementById('logoutModal').classList.add('hidden');
}

async function confirmLogout() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
        }
        
        localStorage.clear();
        window.location.href = '/login';
    } catch (err) {
        console.error('Error logging out:', err);
        alert('Logout failed. Please try again.');
    } finally {
        closeLogoutModal();
    }
}
