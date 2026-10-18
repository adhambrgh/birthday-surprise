const targetDate = new Date().getTime() + 10000;
const ctaBtn = document.getElementById('ctaBtn');
let countdownDone = false;

function playFromStart() {
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ action: 'playFromStart' }, '*');
        }
    } catch (e) {}
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
        document.getElementById('hari').textContent = '00';
        document.getElementById('jam').textContent = '00';
        document.getElementById('menit').textContent = '00';
        document.getElementById('detik').textContent = '00';
        document.getElementById('remaining').textContent = 'Tersisa 00:00 lagi';
        countdownDone = true;
        ctaBtn.classList.remove('locked');
        ctaBtn.removeAttribute('disabled');
        ctaBtn.innerHTML = `
            <span class="nav-btn__heart" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </span>
            <span class="nav-btn__label">Klik Di Sini</span>
            <span class="nav-btn__heart" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </span>`;
        clearInterval(countdownInterval);
        return;
    }

    const hari = Math.floor(distance / (1000 * 60 * 60 * 24));
    const jam = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const menit = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('hari').textContent = String(hari).padStart(2, '0');
    document.getElementById('jam').textContent = String(jam).padStart(2, '0');
    document.getElementById('menit').textContent = String(menit).padStart(2, '0');
    document.getElementById('detik').textContent = String(detik).padStart(2, '0');

    const totalSeconds = Math.floor(distance / 1000);
    const remainingH = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const remainingM = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    document.getElementById('remaining').textContent = `Tersisa ${remainingH}:${remainingM} lagi`;
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

function createParticles() {
    const container = document.getElementById('particles');

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

function createBubbles() {
    const container = document.getElementById('bubbles');

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

function createStars() {
    const container = document.getElementById('stars');

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

createParticles();
createBubbles();
createStars();

ctaBtn.addEventListener('click', () => {
    if (countdownDone) {
        playFromStart();
        go('page2.html');
    }
});