(function () {
    try {
        const dark = localStorage.getItem('color-mode') === 'dark';
        if (dark) {
            document.documentElement.classList.add('tw-dark');
            document.documentElement.style.colorScheme = 'dark';
        }
    } catch (_) {
        /* ignore */
    }
})();
