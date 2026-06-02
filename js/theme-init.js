(function () {
    try {
        const dark =
            localStorage.getItem('color-mode') === 'dark' ||
            (!('color-mode' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (dark) {
            document.documentElement.classList.add('tw-dark');
            document.documentElement.style.colorScheme = 'dark';
        }
    } catch (_) {
        /* ignore */
    }
})();
