document.addEventListener('DOMContentLoaded', () => {
    /* === Stars === */
    const starsContainer = document.getElementById('stars');
    const isSmall = window.innerWidth < 650;
    const starCount = isSmall ? 40 : 80;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (1.5 + Math.random() * 3) + 's';
        starsContainer.appendChild(star);
    }

    /* === Game State === */
    const DURATION = 30;
    const TARGET = 15;
    const gameArea = document.getElementById('gameArea');
    const gameHint = document.getElementById('gameHint');
    const scoreValue = document.getElementById('scoreValue');
    const timeValue = document.getElementById('timeValue');
    const timeFill = document.getElementById('timeFill');
    const resultOverlay = document.getElementById('resultOverlay');
    const resultEmoji = document.getElementById('resultEmoji');
    const resultTitle = document.getElementById('resultTitle');
    const resultSub = document.getElementById('resultSub');
    const retryBtn = document.getElementById('retryBtn');
    const skipBtn = document.getElementById('skipBtn');
    const timeItem = timeValue.closest('.hud-item');

    const BALLOON_COLORS = ['c-pink', 'c-purple', 'c-gold', 'c-blue', 'c-coral'];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let score = 0;
    let timeLeft = DURATION;
    let running = false;
    let spawnTimer = null;
    let tickTimer = null;
    let hintHidden = false;

    /* === Pop sound (WebAudio, tanpa file) === */
    let audioCtx = null;
    function popSound() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(420 + Math.random() * 260, t);
            osc.frequency.exponentialRampToValueAtTime(90, t + 0.12);
            gain.gain.setValueAtTime(0.22, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.16);
        } catch (e) {}
    }

    /* === Spawn balloon === */
    function spawnBalloon() {
        if (!running) return;

        const el = document.createElement('div');
        el.className = 'balloon ' + BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];

        const size = 46 + Math.random() * 30;
        const dur = 5 + Math.random() * 3.5 - Math.min((DURATION - timeLeft) * 0.04, 1.8);
        const sway = (Math.random() * 60 - 30);
        const left = 6 + Math.random() * 76;

        el.style.left = left + '%';
        el.style.setProperty('--dur', Math.max(2.8, dur) + 's');
        el.style.setProperty('--sway', sway + 'px');

        el.innerHTML =
            '<span class="balloon-body" style="width:' + size + 'px;height:' + (size * 1.18) + 'px"></span>' +
            '<span class="balloon-knot"></span>' +
            '<span class="balloon-string"></span>';

        el.addEventListener('click', (e) => popBalloon(el, e), { once: true });
        gameArea.appendChild(el);
        requestAnimationFrame(() => el.classList.add('rising'));

        el.addEventListener('animationend', () => {
            if (el.parentNode && !el.classList.contains('popped')) el.remove();
        });
    }

    /* === Pop effect === */
    function popBalloon(el, e) {
        if (!running || el.classList.contains('popped')) return;
        el.classList.add('popped');

        const rect = el.getBoundingClientRect();
        const areaRect = gameArea.getBoundingClientRect();
        const cx = rect.left - areaRect.left + rect.width / 2;
        const cy = rect.top - areaRect.top + rect.height / 2;

        const color = getComputedStyle(el.querySelector('.balloon-body')).background;
        const fragCount = reduceMotion ? 4 : 7;
        for (let i = 0; i < fragCount; i++) {
            const f = document.createElement('div');
            f.className = 'pop-fragment';
            const fs = 8 + Math.random() * 12;
            const angle = (Math.PI * 2 * i) / fragCount + Math.random() * 0.5;
            const dist = 30 + Math.random() * 45;
            f.style.width = fs + 'px';
            f.style.height = fs * 1.1 + 'px';
            f.style.left = cx + 'px';
            f.style.top = cy + 'px';
            f.style.background = color;
            f.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
            f.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
            f.style.setProperty('--fr', (Math.random() * 360 - 180) + 'deg');
            gameArea.appendChild(f);
            setTimeout(() => f.remove(), 600);
        }

        if (!reduceMotion) {
            const poof = document.createElement('div');
            poof.className = 'pop-poof';
            poof.textContent = '💥';
            poof.style.left = (cx - 15) + 'px';
            poof.style.top = (cy - 15) + 'px';
            gameArea.appendChild(poof);
            setTimeout(() => poof.remove(), 650);
        }

        const sf = document.createElement('div');
        sf.className = 'score-float';
        sf.textContent = '+1';
        sf.style.left = (cx - 10) + 'px';
        sf.style.top = (cy - 10) + 'px';
        gameArea.appendChild(sf);
        setTimeout(() => sf.remove(), 850);

        popSound();

        score++;
        scoreValue.textContent = score;
        el.remove();
    }

    /* === Spawn scheduling (makin cepat di 10 detik terakhir) === */
    function scheduleSpawn() {
        clearTimeout(spawnTimer);
        if (!running) return;
        const base = 700 + Math.random() * 500;
        const speedup = timeLeft <= 10 ? 0.65 : 1;
        spawnTimer = setTimeout(() => {
            spawnBalloon();
            scheduleSpawn();
        }, base * speedup);
    }

    /* === Tick === */
    function tick() {
        timeLeft--;
        timeValue.textContent = timeLeft;
        timeFill.style.width = (timeLeft / DURATION * 100) + '%';

        if (timeLeft <= 10) timeItem.classList.add('time-warning');

        if (timeLeft <= 0) endGame();
    }

    /* === End === */
    function endGame() {
        running = false;
        clearTimeout(spawnTimer);
        clearInterval(tickTimer);
        timeItem.classList.remove('time-warning');

        // Hapus balon sisa
        gameArea.querySelectorAll('.balloon').forEach(b => b.remove());

        if (score >= TARGET) {
            resultEmoji.textContent = '🎉';
            resultTitle.textContent = 'Selamat sayang!';
            resultSub.textContent = 'Kamu hebat banget! Skormu ' + score + ' balon 💖';
            retryBtn.style.display = 'none';
            resultOverlay.classList.add('show');

            // 3 detik lalu otomatis ke page8
            setTimeout(() => {
                resultOverlay.classList.remove('show');
                setTimeout(() => go('page8.html'), 350);
            }, 3000);
        } else {
            resultEmoji.textContent = '💪';
            resultTitle.textContent = 'Hampir!';
            resultSub.textContent = 'Skormu ' + score + ' dari ' + TARGET + '. Coba lagi ya sayang!';
            retryBtn.style.display = '';
            resultOverlay.classList.add('show');
        }
    }

    /* === Start / Restart === */
    function startGame() {
        score = 0;
        timeLeft = DURATION;
        scoreValue.textContent = '0';
        timeValue.textContent = String(DURATION);
        timeFill.style.width = '100%';
        timeItem.classList.remove('time-warning');
        resultOverlay.classList.remove('show');
        gameArea.querySelectorAll('.balloon, .pop-fragment, .pop-poof, .score-float').forEach(n => n.remove());

        running = true;
        if (!hintHidden) {
            hintHidden = true;
            gameHint.classList.add('hidden');
        }

        spawnBalloon();
        scheduleSpawn();
        tickTimer = setInterval(tick, 1000);
    }

    retryBtn.addEventListener('click', startGame);

    /* === Next button === */
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            go('page8.html');
        });
    }

    // Mulai game saat halaman siap
    startGame();
});
