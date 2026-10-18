(function () {
    const KEY = 'bgHeartsState';
    const heartCount = 45;
    const colors = ['#ff6b9d', '#ffb3c6', '#ff4081', '#ff8fab'];

    function heartUrl(color) {
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='${color}' d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>`;
        return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
    }

    let state = null;
    try { state = JSON.parse(sessionStorage.getItem(KEY)); } catch (e) { state = null; }

    if (!state || !state.hearts || state.hearts.length !== heartCount) {
        state = { started: Date.now(), hearts: [] };
        for (let i = 0; i < heartCount; i++) {
            state.hearts.push({
                left: Math.round(Math.random() * 10000) / 100,
                size: Math.round((28 + Math.random() * 38) * 100) / 100,
                dur: Math.round((8 + Math.random() * 14) * 100) / 100,
                delay: Math.round(Math.random() * 14 * 100) / 100,
                drift: Math.round((Math.random() * 100 - 50) * 100) / 100,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    const wrap = document.createElement('div');
    wrap.id = 'bg-hearts';
    wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:hidden;';
    document.body.appendChild(wrap);

    const elapsed = (Date.now() - state.started) / 1000;

    state.hearts.forEach((h) => {
        const hEl = document.createElement('div');
        hEl.className = 'bg-heart';
        hEl.style.width = h.size + 'px';
        hEl.style.height = h.size + 'px';
        hEl.style.left = h.left + '%';
        hEl.style.background = heartUrl(h.color) + ' no-repeat center / contain';
        hEl.style.setProperty('--drift', h.drift + 'px');
        hEl.style.animationDuration = h.dur + 's';
        const resume = (elapsed + h.delay) % h.dur;
        hEl.style.animationDelay = (-resume) + 's';
        wrap.appendChild(hEl);
    });

    window.addEventListener('beforeunload', () => {
        sessionStorage.setItem(KEY, JSON.stringify({ started: state.started, hearts: state.hearts }));
    });
})();