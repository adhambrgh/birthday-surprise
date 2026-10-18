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

            // Nada "pop" melengkung turun
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(420 + Math.random() * 260, t);
            osc.frequency.exponentialRampToValueAtTime(90, t + 0.1);
            gain.gain.setValueAtTime(0.25, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.15);

            // Noise burst kecil biar terasa "meledak"
            const bufSize = Math.floor(audioCtx.sampleRate * 0.12);
            const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);
            const noise = audioCtx.createBufferSource();
            noise.buffer = buf;
            const nGain = audioCtx.createGain();
            nGain.gain.setValueAtTime(0.16, t);
            nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            const nFilter = audioCtx.createBiquadFilter();
            nFilter.type = 'lowpass';
            nFilter.frequency.value = 2400;
            noise.connect(nFilter).connect(nGain).connect(audioCtx.destination);
            noise.start(t);
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

        // Ukur posisi SEBELUM class 'popped' dipasang (class itu menghapus
        // transform rising, sehingga balon akan melompat ke posisi awal)
        const bodyEl = el.querySelector('.balloon-body');
        const rect = (bodyEl || el).getBoundingClientRect();
        const areaRect = gameArea.getBoundingClientRect();
        const cx = rect.left - areaRect.left + rect.width / 2;
        const cy = rect.top - areaRect.top + rect.height / 2;
        const popSize = rect.width;

        el.classList.add('popped');

        const color = getComputedStyle(el.querySelector('.balloon-body')).background;

        // Kilatan kilat ledakan (langsung, biar terasa "DUG")
        if (!reduceMotion) {
            const flash = document.createElement('div');
            flash.className = 'pop-flash';
            flash.style.left = cx + 'px';
            flash.style.top = cy + 'px';
            gameArea.appendChild(flash);
            setTimeout(() => flash.remove(), 220);
        }

        // Shockwave ring
        if (!reduceMotion) {
            const ring = document.createElement('div');
            ring.className = 'pop-ring';
            ring.style.left = cx + 'px';
            ring.style.top = cy + 'px';
            ring.style.width = (popSize * 1.1) + 'px';
            ring.style.height = (popSize * 1.1) + 'px';
            gameArea.appendChild(ring);
            setTimeout(() => ring.remove(), 500);
        }

        // Fragment: separuh meledak ke segala arah, separuh lagi memantul jatuh
        const fragCount = reduceMotion ? 5 : 14;
        for (let i = 0; i < fragCount; i++) {
            const f = document.createElement('div');
            f.className = 'pop-fragment' + (i % 2 ? ' fall' : '');
            const fs = 7 + Math.random() * 13;
            const angle = (Math.PI * 2 * i) / fragCount + Math.random() * 0.6;
            const dist = 34 + Math.random() * 55;
            f.style.width = fs + 'px';
            f.style.height = fs * 1.15 + 'px';
            f.style.left = cx + 'px';
            f.style.top = cy + 'px';
            f.style.background = color;
            f.style.setProperty('--fx', Math.cos(angle) * dist + 'px');
            f.style.setProperty('--fy', Math.sin(angle) * dist + 'px');
            f.style.setProperty('--fr', (Math.random() * 360 - 180) + 'deg');
            gameArea.appendChild(f);
            setTimeout(() => f.remove(), 950);
        }

        // Confetti sparkle ✨ terpental lebih jauh
        if (!reduceMotion) {
            const sparks = ['✨', '⭐', '✨', '🌟', '✨', '💫'];
            for (let i = 0; i < 6; i++) {
                const s = document.createElement('div');
                s.className = 'pop-spark';
                s.textContent = sparks[i];
                const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.7;
                const dist = 55 + Math.random() * 50;
                s.style.left = cx + 'px';
                s.style.top = cy + 'px';
                s.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
                s.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
                gameArea.appendChild(s);
                setTimeout(() => s.remove(), 850);
            }

            // 💥 poof
            const poof = document.createElement('div');
            poof.className = 'pop-poof';
            poof.textContent = '💥';
            poof.style.left = cx + 'px';
            poof.style.top = cy + 'px';
            gameArea.appendChild(poof);
            setTimeout(() => poof.remove(), 650);

            // Screen shake halus
            gameArea.classList.remove('shake');
            void gameArea.offsetWidth;
            gameArea.classList.add('shake');
            setTimeout(() => gameArea.classList.remove('shake'), 260);
        }

        const sf = document.createElement('div');
        sf.className = 'score-float';
        sf.textContent = '+1';
        sf.style.left = cx + 'px';
        sf.style.top = cy + 'px';
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
                setTimeout(() => go('pagecake.html'), 350);
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
            go('pagecake.html');
        });
    }

    // Mulai game saat halaman siap
    startGame();
});
