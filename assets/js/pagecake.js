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

    /* === Element === */
    const stage = document.getElementById('cakeStage');
    const glow = document.getElementById('cakeGlow');
    const hint = document.getElementById('blowHint');
    const wishEl = document.getElementById('wishText');
    const candles = [...document.querySelectorAll('.candle')];

    const WISH = 'habedeee yaaa princesskuuu dunialkuuu bidadarikuuu segalakuuu cintaakuu sayangkuu';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let blown = false;
    let typingDone = false;

    /* === Suara tiup (WebAudio, tanpa file) === */
    function blowSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const t = ctx.currentTime;
            const bufSize = Math.floor(ctx.sampleRate * 0.5);
            const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < bufSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / bufSize);
            }
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(700, t);
            filter.frequency.exponentialRampToValueAtTime(240, t + 0.45);
            filter.Q.value = 0.8;
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
            src.connect(filter).connect(gain).connect(ctx.destination);
            src.start(t);
            setTimeout(() => ctx.close(), 900);
        } catch (e) {}
    }

    /* === Tiup lilin === */
    function blowCandles() {
        if (blown) return;
        blown = true;

        hint.classList.add('hidden');
        stage.classList.add('blown');
        glow.classList.add('out');
        blowSound();

        // Lilin padam + asap bertahap (stagger)
        candles.forEach((c, i) => {
            setTimeout(() => {
                const flame = c.querySelector('.flame');
                if (flame) flame.classList.add('out');
                c.classList.add('puffed');
            }, i * (reduceMotion ? 40 : 90));
        });

        // Setelah lilin padam semua -> ketik ucapan
        const candlesDone = candles.length * (reduceMotion ? 40 : 90) + 350;
        setTimeout(typeWish, candlesDone);
    }

    /* === Typing ucapan === */
    function typeWish() {
        wishEl.innerHTML = '<span class="txt"></span><span class="caret"></span>';
        const txt = wishEl.querySelector('.txt');
        let i = 0;

        const speed = reduceMotion ? 12 : 55;

        function step() {
            i++;
            txt.textContent = WISH.slice(0, i);
            if (i < WISH.length) {
                setTimeout(step, speed + Math.random() * 30);
            } else {
                typingDone = true;
                const caret = wishEl.querySelector('.caret');
                if (caret) caret.remove();
                // 1 detik setelah ucapan selesai -> halaman terakhir
                setTimeout(() => go('page8.html'), 1000);
            }
        }
        step();
    }

    /* === Trigger === */
    stage.addEventListener('click', blowCandles);
    stage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            blowCandles();
        }
    });
});
