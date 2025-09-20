import ThemeManager from './modules/theme-manager.js';
import SettingsManager from './modules/setting-manager.js';
import SidebarManager from './modules/sidebar-manager.js';

document.addEventListener('DOMContentLoaded', async function() {
    const themeManager = new ThemeManager({
        body: document.getElementById('body'),
        themeToggle: document.getElementById('theme-toggle'),
        themeLabel: document.getElementById('theme-label'),
        settingsCard: document.getElementById('settings-card'),
        systemSettingsCard: document.getElementById('system-settings-card'),
        lightPreview: document.getElementById('light-preview'),
        darkPreview: document.getElementById('dark-preview')
    });

    const settingsManager = new SettingsManager({
        themeManager,
        autosaveToggle: document.getElementById('autosave-toggle'),
        successMessage: document.getElementById('success-message')
    });

    const sidebarManager = new SidebarManager('sidebar-container');

    try {
        const res = await fetch ('/api/validate-token', {
            method: 'GET',
            credentials: 'include',
        });

        if(!res.ok){
            throw new Error("Invalid token");
        }

        themeManager.loadTheme();
        settingsManager.loadSettings();
        sidebarManager.loadSidebar();

        window.saveSettings = () => settingsManager.saveSettings();
        window.resetSettings = () => settingsManager.resetSettings();
        window.setLightTheme = () => themeManager.setLightTheme();
        window.setDarkTheme = () => themeManager.setDarkTheme();
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        window.location.href = '/login';   
    }
});
