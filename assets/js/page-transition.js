(function () {
    var parentWin = null;
    try {
        if (window.self !== window.top && window.parent &&
            window.parent.document.getElementById('frame')) {
            parentWin = window.parent;
        }
    } catch (e) {
        parentWin = null;
    }

    var entering = sessionStorage.getItem('pt') === '1';
    sessionStorage.removeItem('pt');

    var ov = document.createElement('div');
    ov.id = 'page-transition';
    ov.style.cssText =
        'position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999;' +
        'background:linear-gradient(135deg,#2d1b4e,#ff6b9d,#2d1b4e);' +
        'opacity:' + (entering ? '1' : '0') + ';' +
        'filter:blur(12px);transform:scale(1.5);' +
        'pointer-events:none;' +
        'transition:opacity 0.7s cubic-bezier(0.4,0,0.2,1),' +
        'filter 0.7s cubic-bezier(0.4,0,0.2,1),' +
        'transform 0.7s cubic-bezier(0.4,0,0.2,1);';

    if (parentWin) {
        ov.style.display = 'none';
    }

    document.body.insertBefore(ov, document.body.firstChild);

    if (entering) {
        if (parentWin && parentWin.frameEnter) {
            setTimeout(function () { parentWin.frameEnter(); }, 120);
        } else {
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    ov.style.opacity = '0';
                    ov.style.filter = 'blur(0px)';
                    ov.style.transform = 'scale(0.6)';
                });
            });
        }
    }

        window.go = function (url) {
        if (parentWin && parentWin.frameGo) {
            sessionStorage.setItem('pt', '1');
            parentWin.frameGo(url, 600);
            return;
        }
        ov.style.pointerEvents = 'auto';
        ov.style.opacity = '1';
        ov.style.filter = 'blur(12px)';
        ov.style.transform = 'scale(1.5)';
        sessionStorage.setItem('pt', '1');
        setTimeout(function () { window.location.href = url; }, 700);
    };
})();