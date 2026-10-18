(function () {
    const audio = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playBtn');
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    const transition = document.getElementById('shellTransition');

    audio.addEventListener('error', function (e) {
        console.warn('[shell] audio error:', e);
    });

    function setUI(playing) {
        playIcon.style.display = playing ? 'none' : 'block';
        pauseIcon.style.display = playing ? 'block' : 'none';
    }

    setUI(false);

    function tryPlay() {
        audio.muted = false;
        const p = audio.play();
        if (p && p.catch) {
            p.catch(function (err) {
                console.warn('[shell] play rejected:', err.name, err.message);
            });
        }
    }

    function tryPause() {
        audio.pause();
    }

    playBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (audio.paused) {
            tryPlay();
        } else {
            tryPause();
        }
    });

    audio.addEventListener('play', function () { setUI(true); });
    audio.addEventListener('pause', function () { setUI(false); });
    audio.addEventListener('ended', function () { setUI(false); });

    window.addEventListener('message', function (e) {
        if (e.data && e.data.action === 'playFromStart') {
            audio.muted = false;
            audio.currentTime = 0;
            tryPlay();
        }
    });

    window.shellControls = {
        playFromStart: function () {
            audio.muted = false;
            audio.currentTime = 0;
            tryPlay();
        },
        play: function () {
            tryPlay();
        },
        isPlaying: function () {
            return !audio.paused;
        }
    };

    window.frameGo = function (url, delay) {
        transition.classList.add('active');
        setTimeout(function () {
            var frame = document.getElementById('frame');
            if (frame) frame.src = url;
        }, delay || 1600);
        setTimeout(function () {
            transition.classList.remove('active');
        }, (delay || 1600) + 1500);
    };

    window.frameEnter = function () {
        requestAnimationFrame(function () {
            transition.classList.add('active');
            requestAnimationFrame(function () {
                transition.classList.remove('active');
            });
        });
    };
})();