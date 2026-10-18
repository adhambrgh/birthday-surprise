function createParticles2() {
    const container = document.getElementById('particles2');

    for (let i = 0; i < 25; i++) {
        const el = document.createElement('div');
        el.classList.add('heart');
        const size = Math.random() * 34 + 18;
        el.style.width = size + 'px';
        el.style.height = size * 0.9 + 'px';
        el.style.left = Math.random() * 100 + '%';
        el.style.animationDuration = (Math.random() * 12 + 8) + 's';
        el.style.animationDelay = (Math.random() * 12) + 's';
        container.appendChild(el);
    }
}

function createBubbles2() {
    const container = document.getElementById('bubbles2');

    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        const size = Math.random() * 20 + 10;
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (Math.random() * 15 + 10) + 's';
        bubble.style.animationDelay = (Math.random() * 15) + 's';
        container.appendChild(bubble);
    }
}

function createStars2() {
    const container = document.getElementById('stars2');

    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.classList.add('star-particle');
        const size = Math.random() * 14 + 6;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDuration = (Math.random() * 10 + 6) + 's';
        star.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(star);
    }
}

createParticles2();
createBubbles2();
createStars2();

const giftWrapper = document.getElementById('giftWrapper');
const fireworksLayer = document.getElementById('fireworks');
const ageReveal = document.getElementById('ageReveal');

const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SPARK_COLORS = ['#ff6b9d', '#ffd700', '#ffffff', '#ffb3c6', '#7ed6ff', '#ff4081'];
const SPARK_COUNT = 48;

/**
 * Ledakan petasan besar dari satu titik di tengah-atas layar.
 */
function burstFireworks() {
    if (!fireworksLayer) return;

    // Pusat ledakan: 50% horizontal, 42% vertikal (sedikit di atas tengah
    // agar angka 17 tidak tertutup).
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.42;

    const flash = document.createElement('div');
    flash.className = 'firework-flash';
    flash.style.left = cx + 'px';
    flash.style.top = cy + 'px';
    fireworksLayer.appendChild(flash);

    const ring = document.createElement('div');
    ring.className = 'firework-ring';
    ring.style.left = cx + 'px';
    ring.style.top = cy + 'px';
    fireworksLayer.appendChild(ring);

    const baseAngle = Math.random() * Math.PI * 2;

    for (let i = 0; i < SPARK_COUNT; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark-burst';

        // Varian ekor untuk sebagian percikan
        if (i % 3 === 0) {
            spark.classList.add('spark-burst--trail');
        }

        const angle = baseAngle + (i / SPARK_COUNT) * Math.PI * 2 +
            (Math.random() - 0.5) * 0.16;
        const distance = 90 + Math.random() * 110;

        spark.style.left = cx + 'px';
        spark.style.top = cy + 'px';
        spark.style.setProperty('--dx', (Math.cos(angle) * distance).toFixed(1) + 'px');
        spark.style.setProperty('--dy', (Math.sin(angle) * distance).toFixed(1) + 'px');
        spark.style.setProperty('--c', SPARK_COLORS[i % SPARK_COLORS.length]);
        spark.style.animationDelay = (Math.random() * 0.12).toFixed(2) + 's';

        fireworksLayer.appendChild(spark);
    }

    // Bersihkan DOM agar tidak menumpuk
    setTimeout(() => {
        if (fireworksLayer) fireworksLayer.innerHTML = '';
    }, 2200);
}

let isOpened = false;

giftWrapper.addEventListener('click', () => {
    if (isOpened) return;
    isOpened = true;

    giftWrapper.classList.add('opened');

    if (reduceMotion) {
        // Versi tanpa animasi: angka 17 langsung tampil
        document.body.classList.add('celebrating');
        if (ageReveal) ageReveal.classList.add('show');
        setTimeout(() => {
            go('page3.html');
        }, 1000);
        return;
    }

    // 1. Petasan meledak setelah tutup terbang
    setTimeout(burstFireworks, 550);

    // 2. Gift memudar agar angka 17 bersih
    setTimeout(() => {
        document.body.classList.add('celebrating');
    }, 900);

    // 3. Angka 17 muncul
    setTimeout(() => {
        if (ageReveal) ageReveal.classList.add('show');
    }, 1250);

    // 4. Lanjut ke halaman berikutnya (1 detik setelah angka 17 muncul)
    setTimeout(() => {
        go('page3.html');
    }, 2250);
});
