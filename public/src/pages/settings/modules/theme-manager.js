export default class ThemeManager {
    constructor({ body, themeToggle, themeLabel, settingsCard, systemSettingsCard, lightPreview, darkPreview }) {
        this.body = body;
        this.themeToggle = themeToggle;
        this.themeLabel = themeLabel;
        this.settingsCard = settingsCard;
        this.systemSettingsCard = systemSettingsCard;
        this.lightPreview = lightPreview;
        this.darkPreview = darkPreview;

        this.init();
    }

    init() {
        this.themeToggle.addEventListener('change', () => this.handleToggle());
        this.loadTheme();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('docutrack-theme') || 'light';
        savedTheme === 'dark' ? this.applyDarkTheme() : this.applyLightTheme();
        this.themeToggle.checked = savedTheme === 'dark';
    }

    applyDarkTheme() {
        this.body.classList.replace('gradient-bg', 'gradient-bg-dark');
        this.body.classList.add('dark-theme');

        this.settingsCard.classList.replace('glass-effect', 'glass-effect-dark');
        this.settingsCard.classList.replace('subtle-shadow', 'subtle-shadow-dark');

        this.themeLabel.textContent = 'Dark';
        this.lightPreview.classList.remove('active');
        this.darkPreview.classList.add('active');

        localStorage.setItem('docutrack-theme', 'dark');
    }

    applyLightTheme() {
        this.body.classList.replace('gradient-bg-dark', 'gradient-bg');
        this.body.classList.remove('dark-theme');

        this.settingsCard.classList.replace('glass-effect-dark', 'glass-effect');
        this.settingsCard.classList.replace('subtle-shadow-dark', 'subtle-shadow');

        this.systemSettingsCard.classList.replace('glass-effect-dark', 'glass-effect');
        this.systemSettingsCard.classList.replace('subtle-shadow-dark', 'subtle-shadow');

        this.themeLabel.textContent = 'Light';
        this.darkPreview.classList.remove('active');
        this.lightPreview.classList.add('active');

        localStorage.setItem('docutrack-theme', 'light');
    }

    handleToggle() {
        this.themeToggle.checked ? this.applyDarkTheme() : this.applyLightTheme();
    }

    setLightTheme() {
        this.themeToggle.checked = false;
        this.applyLightTheme();
    }

    setDarkTheme() {
        this.themeToggle.checked = true;
        this.applyDarkTheme();
    }
}
