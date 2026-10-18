document.addEventListener('DOMContentLoaded', () => {
    /* === Stars === */
    const starsContainer = document.getElementById('stars');
    if (starsContainer) {
        for (let i = 0; i < 120; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            const size = Math.random() * 3 + 1;
            star.style.width = size + 'px';
            star.style.height = size + 'px';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (2 + Math.random() * 3) + 's';
            starsContainer.appendChild(star);
        }
    }

    /* === Typewriter === */
    const typingText = document.getElementById('typingText');
    const darkOverlay = document.getElementById('darkOverlay');

    const messages = ['Happy Birthday', 'With All My Love', 'Always & Forever'];
    const typingSpeed = 100;
    const deletingSpeed = 55;
    const pauseAfterTyping = 1800;
    const pauseAfterDeleting = 500;

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function typeWord(word) {
        for (let i = 0; i < word.length; i++) {
            typingText.textContent = word.substring(0, i + 1);
            await wait(typingSpeed);
        }
    }

    async function deleteWord() {
        const word = typingText.textContent;
        for (let i = word.length; i > 0; i--) {
            typingText.textContent = word.substring(0, i - 1);
            await wait(deletingSpeed);
        }
    }

    async function playAnimation() {
        typingText.textContent = '';

        await typeWord(messages[0]);
        await wait(pauseAfterTyping);

        await deleteWord();
        await wait(pauseAfterDeleting);
        await typeWord(messages[1]);
        await wait(pauseAfterTyping);

        await deleteWord();
        await wait(pauseAfterDeleting);
        await typeWord(messages[2]);

        await wait(2000);

        if (darkOverlay) {
            darkOverlay.classList.add('active');
            setTimeout(() => go('page1.html'), 3200);
        }
    }

    setTimeout(() => {
        playAnimation();
    }, 1200);
});