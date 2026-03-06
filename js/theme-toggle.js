// Theme Toggle Logic
(function() {
    const storageKey = 'hs-theme-preference';

    const getColorPreference = () => {
        if (localStorage.getItem(storageKey)) {
            return localStorage.getItem(storageKey);
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const setPreference = (theme) => {
        localStorage.setItem(storageKey, theme);
        reflectPreference(theme);
    };

    const reflectPreference = (theme) => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        document.documentElement.setAttribute('data-theme', theme);
        
        const toggles = document.querySelectorAll('.js-theme-toggle');
        toggles.forEach(toggle => {
            toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            const icon = toggle.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
            }
        });
    };

    // Initialize
    const theme = getColorPreference();
    reflectPreference(theme);

    window.onload = () => {
        reflectPreference(theme);
        
        const toggles = document.querySelectorAll('.js-theme-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const currentTheme = getColorPreference();
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setPreference(nextTheme);
            });
        });
    };

    // Sync with system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches }) => {
        const nextPreference = matches ? 'dark' : 'light';
        setPreference(nextPreference);
    });
})();
