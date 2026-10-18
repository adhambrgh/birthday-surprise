document.addEventListener('DOMContentLoaded', () => {
    /* === Stars === */
    const starsContainer = document.getElementById('stars');
    const isSmall = window.innerWidth < 650;
    const starCount = isSmall ? 40 : 100;
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

    /* === Video Control === */
    const video = document.getElementById('birthdayVideo');
    const overlay = document.getElementById('playOverlay');
    const playButton = document.querySelector('.play-button');
    const seekBar = document.getElementById('seekBar');
    const seekFill = document.getElementById('seekFill');
    const bufferFill = document.getElementById('bufferFill');
    const seekThumb = document.getElementById('seekThumb');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const ctrlPlayIcon = document.querySelector('.ctrl-play');
    const ctrlPauseIcon = document.querySelector('.ctrl-pause');
    const timeDisplay = document.getElementById('timeDisplay');
    const muteBtn = document.getElementById('muteBtn');
    const ctrlVolIcon = document.querySelector('.ctrl-vol');
    const ctrlMuteIcon = document.querySelector('.ctrl-mute');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const videoSparkles = document.getElementById('videoSparkles');

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function updateControls() {
        if (!video.duration) return;
        const pct = (video.currentTime / video.duration) * 100;
        seekFill.style.width = pct + '%';
        seekThumb.style.left = pct + '%';
        timeDisplay.textContent = formatTime(video.currentTime) + ' / ' + formatTime(video.duration);
    }

    /* === Video Sparkles === */
    if (videoSparkles) {
        const sparkleColors = ['#ff6b9d', '#ffd700', '#7ed6ff', '#a8e6a1', '#ff8fab', '#ffffff'];
        const sparkleCount = isSmall ? 10 : 30;
        for (let i = 0; i < sparkleCount; i++) {
            const sp = document.createElement('div');
            sp.classList.add('vsparkle');
            sp.style.left = Math.random() * 100 + '%';
            sp.style.top = Math.random() * 100 + '%';
            sp.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
            sp.style.width = (3 + Math.random() * 5) + 'px';
            sp.style.height = sp.style.width;
            sp.style.animationDelay = Math.random() * 4 + 's';
            sp.style.animationDuration = (3 + Math.random() * 3) + 's';
            videoSparkles.appendChild(sp);
        }
    }
    /* === Video Init === */
    if (video) {
        video.preload = 'auto';
        if (video.readyState >= 2) {
            video.play().catch(() => {});
        } else {
            video.addEventListener('canplay', () => {
                video.play().catch(() => {});
            }, { once: true });
        }
        video.addEventListener('loadedmetadata', updateControls);
        video.addEventListener('timeupdate', updateControls);
        video.addEventListener('progress', () => {
            if (video.buffered.length > 0) {
                const buffered = video.buffered.end(video.buffered.length - 1);
                const pct = (buffered / video.duration) * 100;
                bufferFill.style.width = pct + '%';
            }
        });
        video.addEventListener('play', () => {
            overlay.style.visibility = 'hidden';
            overlay.style.opacity = '0';
            ctrlPauseIcon.style.display = 'block';
            ctrlPlayIcon.style.display = 'none';
            if (playButton) playButton.classList.add('playing');
        });
        video.addEventListener('pause', () => {
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
            ctrlPauseIcon.style.display = 'none';
            ctrlPlayIcon.style.display = 'block';
            if (playButton) playButton.classList.remove('playing');
        });
        video.addEventListener('ended', () => {
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
            ctrlPauseIcon.style.display = 'none';
            ctrlPlayIcon.style.display = 'block';
            if (playButton) playButton.classList.remove('playing');
        });
        video.addEventListener('volumechange', () => {
            if (video.muted || video.volume === 0) {
                ctrlMuteIcon.style.display = 'block';
                ctrlVolIcon.style.display = 'none';
            } else {
                ctrlMuteIcon.style.display = 'none';
                ctrlVolIcon.style.display = 'block';
            }
        });
    }

    function togglePlay() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    if (overlay) {
        overlay.addEventListener('click', togglePlay);
    }
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlay);
    }

    function seekTo(e) {
        if (!video.duration) return;
        const rect = seekBar.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        video.currentTime = ratio * video.duration;
        updateControls();
    }

    if (seekBar) {
        seekBar.addEventListener('click', seekTo);
        seekBar.addEventListener('mousemove', (e) => {
            if (e.buttons === 1) seekTo(e);
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            const container = document.querySelector('.video-container');
            if (container.requestFullscreen) {
                container.requestFullscreen();
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen();
            }
        });
    }

    /* === Next button === */
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            e.preventDefault();
            go('page7.html');
        });
    }
});