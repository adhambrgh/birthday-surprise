document.addEventListener('DOMContentLoaded', () => {
    // === Fit to viewport (scale to fit 1 frame) ===
    // Hanya aktif di desktop. Di mobile/tablet layout sudah responsif
    // dan halaman bisa di-scroll, jadi scaling justru merusak keterbacaan.
    const DESKTOP_MIN_WIDTH = 1024;
    const DESKTOP_MIN_HEIGHT = 640;

    function fitViewport() {
        const el = document.querySelector('.letter-container');
        if (!el) return;

        const isDesktop =
            window.innerWidth >= DESKTOP_MIN_WIDTH &&
            window.innerHeight >= DESKTOP_MIN_HEIGHT;

        if (!isDesktop) {
            el.style.transform = '';
            el.style.transformOrigin = '';
            return;
        }

        const vh = window.innerHeight;
        const scale = Math.min(1, (vh - 24) / el.offsetHeight);
        if (scale < 1) {
            el.style.transform = `scale(${scale})`;
            el.style.transformOrigin = 'center center';
        } else {
            el.style.transform = '';
            el.style.transformOrigin = '';
        }
    }
    fitViewport();
    setTimeout(fitViewport, 2100);
    window.addEventListener('resize', fitViewport);
    window.addEventListener('orientationchange', () => setTimeout(fitViewport, 250));
    // === Next page button ===
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            go('page4.html');
        });
    }

    // === Sparkle particles ===
    const sparkleContainer = document.getElementById('sparkles3');
    const sparkleCount = 50;

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDuration = (Math.random() * 4 + 3) + 's';
        sparkle.style.animationDelay = (Math.random() * 5) + 's';
        sparkle.style.width = (Math.random() * 4 + 3) + 'px';
        sparkle.style.height = sparkle.style.width;
        sparkle.style.background = ['#ffd700', '#ff6b9d', '#ffffff', '#ffb3c6'][Math.floor(Math.random() * 4)];
        sparkleContainer.appendChild(sparkle);
    }

    // === Heart rain ===
    const heartRain = document.getElementById('heartRain3');
    let heartCount = 0;
    const maxHearts = 40;

    function addHeart() {
        if (heartCount >= maxHearts) return;
        const heart = document.createElement('div');
        heart.classList.add('falling-heart');
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 8 + 6) + 's';
        const size = Math.random() * 36 + 18;
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';
        heart.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
        heartRain.appendChild(heart);
        heartCount++;
    }

    const heartInterval = setInterval(addHeart, 300);
    setTimeout(() => clearInterval(heartInterval), maxHearts * 300 + 2000);

    // === Polaroid hover — sparkle effect ===
    document.querySelectorAll('.polaroid').forEach(polaroid => {
        polaroid.addEventListener('mouseenter', () => {
            for (let i = 0; i < 6; i++) {
                setTimeout(() => {
                    const sparkle = document.createElement('div');
                    sparkle.style.cssText = `
                        position: fixed;
                        top: ${Math.random() * 100}%;
                        left: ${Math.random() * 100}%;
                        width: 10px;
                        height: 10px;
                        background: #ffd700;
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 99;
                        animation: sparklePop 0.6s ease-out forwards;
                    `;
                    document.body.appendChild(sparkle);
                    setTimeout(() => sparkle.remove(), 700);
                }, i * 70);
            }
        });
    });
});