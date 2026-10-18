document.addEventListener('DOMContentLoaded', () => {
    /* === Stars === */
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        for (let i = 0; i < 110; i++) {
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
    }

    /* === Next button === */
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            go('pagegame.html');
        });
    }
});