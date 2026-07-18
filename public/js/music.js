(() => {
    const cfg = window.FF_MUSIC || {};
    if (!cfg.enabled || !cfg.videoId) return;

    const volume = Math.max(0, Math.min(100, Number(cfg.volume) || 18));
    let player = null;
    let ready = false;
    let playing = false;
    let started = false;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'music-toggle';
    btn.setAttribute('aria-label', 'Música');
    btn.innerHTML = '<span class="music-icon">♪</span><span class="music-text">Música</span>';
    document.body.appendChild(btn);

    const host = document.createElement('div');
    host.id = 'ff-yt-player';
    host.className = 'yt-hidden';
    document.body.appendChild(host);

    function setUi(on) {
        playing = on;
        btn.classList.toggle('is-on', on);
        btn.classList.toggle('is-off', !on);
        const t = btn.querySelector('.music-text');
        if (t) t.textContent = on ? 'Sonando' : 'Música';
    }

    function applyVolume() {
        if (!player || !ready) return;
        try {
            player.unMute();
            player.setVolume(volume);
        } catch (_) {}
    }

    function play() {
        if (!player || !ready) return;
        applyVolume();
        player.playVideo();
        setUi(true);
        started = true;
    }

    function pause() {
        if (!player || !ready) return;
        player.pauseVideo();
        setUi(false);
    }

    function toggle() {
        if (!ready) return;
        if (playing) pause();
        else play();
    }

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!ready) return;
        toggle();
    });

    // Primer click en la página (autoplay con sonido requiere gesto del usuario)
    if (cfg.autoplay !== false) {
        const once = () => {
            if (!started && ready) play();
            window.removeEventListener('pointerdown', once);
            window.removeEventListener('keydown', once);
        };
        window.addEventListener('pointerdown', once, { passive: true });
        window.addEventListener('keydown', once);
    }

    window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
        player = new YT.Player('ff-yt-player', {
            height: '1',
            width: '1',
            videoId: cfg.videoId,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
                loop: 1,
                playlist: cfg.playlistId || cfg.videoId,
                origin: window.location.origin
            },
            events: {
                onReady: (e) => {
                    ready = true;
                    e.target.setVolume(volume);
                    e.target.mute();
                    btn.classList.add('is-ready');
                },
                onStateChange: (e) => {
                    if (e.data === YT.PlayerState.PLAYING) {
                        applyVolume();
                        setUi(true);
                    }
                    if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
                        setUi(false);
                    }
                    // Loop manual si falla playlist
                    if (e.data === YT.PlayerState.ENDED) {
                        try { player.seekTo(0); player.playVideo(); } catch (_) {}
                    }
                }
            }
        });
    };

    // Cargar API YouTube
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    } else if (window.YT && window.YT.Player) {
        window.onYouTubeIframeAPIReady();
    }
})();
