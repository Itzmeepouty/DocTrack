export default class SettingsManager {
    constructor({ themeManager, autosaveToggle, successMessage }) {
        this.themeManager = themeManager;
        this.autosaveToggle = autosaveToggle;
        this.successMessage = successMessage;
    }

    saveSettings() {
        const theme = this.themeManager.themeToggle.checked ? 'dark' : 'light';
        const autosave = this.autosaveToggle.checked;

        localStorage.setItem('docutrack-theme', theme);
        localStorage.setItem('docutrack-autosave', autosave);

        this.showSuccess();
    }

    resetSettings() {
        this.themeManager.setLightTheme();
        this.autosaveToggle.checked = true;

        localStorage.removeItem('docutrack-theme');
        localStorage.removeItem('docutrack-autosave');

        alert('Settings have been reset to defaults');
    }

    loadSettings() {
        const savedAutosave = localStorage.getItem('docutrack-autosave');
        if (savedAutosave !== null) {
            this.autosaveToggle.checked = savedAutosave === 'true';
        }
    }

    showSuccess() {
        this.successMessage.classList.remove('hidden');
        setTimeout(() => this.successMessage.classList.add('hidden'), 3000);
    }
}
