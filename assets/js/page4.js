document.addEventListener('DOMContentLoaded', () => {
    /* === Fit to viewport (scale to fit 1 frame) === */
    // Hanya untuk desktop. Di mobile/tablet layout responsif + scroll,
    // jadi scaling tidak dipakai supaya teks tetap terbaca.
    const DESKTOP_MIN_WIDTH = 1024;
    const DESKTOP_MIN_HEIGHT = 640;

    function fitViewport() {
        const el = document.querySelector('.birthday-container');
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
        const vw = window.innerWidth;
        const scale = Math.min(1, (vh - 20) / el.offsetHeight, (vw - 20) / el.offsetWidth);
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

    /* === Stars === */
    const starsContainer = document.getElementById("stars");
    for (let i = 0; i < 90; i++) {
        const star = document.createElement("span");
        star.classList.add("star");
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 2 + "s";
        star.style.animationDuration = (1.5 + Math.random() * 2.5) + "s";
        const size = 1 + Math.random() * 3;
        star.style.width = size + "px";
        star.style.height = size + "px";
        starsContainer.appendChild(star);
    }

    /* === Typewriter === */
    const texts = [
        "Selamat ulang tahun, sayangku Hari ini adalah hari yang paling istimewa karena dengan kehadiranmu dunia menjadi lebih indah. Setiap detik bersamamu adalah anugerah yang tak ternilai, asekkk",
        "Terima kasih sudah menjadi bagian terbaik dari hari-hariku. Terima kasih untuk setiap senyuman, tawa, dan kebahagiaan yang kamu bagikan. Kehadiranmu adalah pelangi di tengah hujan.",
        "Di usia yang baru ini, semoga semua impianmu perlahan menjadi kenyataan. Tenang ada aku yang ingin mewujudkan whislistmu satu persatu. Semoga kebahagiaan menyertai setiap langkahmu dan doa baik selalu mengiringi hidupmu.",
        "Jangan pernah lelah menjadi dirimu sendiri, karena kamu sempurna dengan caramu yang tak bisa digantikan siapa pun. Aku bangga bisa ada di sisimu, yang selalu ada buat kamu.",
        "Semoga Allah selalu melindungimu, menjaga setiap langkahmu dan memberi kekuatan melewati segala hal. Semoga tahun ini menjadi tahun terbaik yang pernah ada.",
        "Terima kasih untuk setiap momen kecil yang membuatku jatuh cinta lagi setiap hari. Cerita kita masih panjang, dan aku bersyukur bisa jadi bagian dari cerita itu.",
        "Berbahagialah selalu sayangkuu. Seberapa tinggi pun kamu terbang, aku akan selalu ada untuk menunggu dengan tangan terbuka. Kamu adalah alasan terindah di kehidupanku.",
        "Selamat ulang tahun sekali lagi untuk orang yang paling kucintai. Semoga dikelilingi kebahagiaan, kesehatan, dan cinta. I love you, always. Happy Birthday Ya CAYAAAANGGGG!"
    ];

    async function typeText(elementId, text, speed = 45) {
        const element = document.getElementById(elementId);
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await new Promise(resolve => setTimeout(resolve, speed));
        }
    }

    async function startTyping() {
        await new Promise(resolve => setTimeout(resolve, 1200));
        await typeText("text1", texts[0], 30);
        await new Promise(resolve => setTimeout(resolve, 600));
        await typeText("text2", texts[1], 30);
        await new Promise(resolve => setTimeout(resolve, 600));
        await typeText("text3", texts[2], 30);
        await new Promise(resolve => setTimeout(resolve, 600));
        await typeText("text4", texts[3], 30);
        await new Promise(resolve => setTimeout(resolve, 600));
        await typeText("text5", texts[4], 30);
        await new Promise(resolve => setTimeout(resolve, 600));
        await typeText("text6", texts[5], 30);
        await new Promise(resolve => setTimeout(resolve, 600));
        await typeText("text7", texts[6], 30);
        await new Promise(resolve => setTimeout(resolve, 600));
        await typeText("text8", texts[7], 30);
    }

    startTyping();

    /* === Confetti === */
    const confettiLayer = document.createElement("div");
    confettiLayer.classList.add("confetti-layer");
    document.body.appendChild(confettiLayer);

    const confettiColors = ["#ff6b9d", "#ffd700", "#7ed6ff", "#a8e6a1", "#ff8fab", "#ffffff", "#c39bff"];
    const shapes = [0, 0, 50];

    for (let i = 0; i < 70; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.width = (6 + Math.random() * 6) + "px";
        confetti.style.height = (10 + Math.random() * 8) + "px";
        confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)] + "%";
        confetti.style.animationDuration = (4 + Math.random() * 5) + "s";
        confetti.style.animationDelay = (Math.random() * 8) + "s";
        confetti.style.setProperty("--sway", (Math.random() * 120 - 60) + "px");
        confettiLayer.appendChild(confetti);
    }

    /* === Next button === */
    const nextBtn = document.getElementById("nextBtn");
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            go('page5.html');
        });
    }
});