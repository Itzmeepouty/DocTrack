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

export { loadTheme };