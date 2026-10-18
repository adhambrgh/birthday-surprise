document.addEventListener('DOMContentLoaded', () => {
    /* === Stars === */
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 110; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (1.5 + Math.random() * 3) + 's';
        starsContainer.appendChild(star);
    }

    /* === Lightbox === */
    const memories = document.querySelectorAll('.memory');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('closeBtn');

    memories.forEach(memory => {
        memory.addEventListener('click', () => {
            const image = memory.dataset.image;
            lightboxImage.src = image;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLightbox();
        }
    });

    /* === Next button === */
    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            go('page6.html');
        });
    }
});