(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;

    // —— Custom cursor ——
    if (fine && !reduce) {
        document.documentElement.classList.add('has-custom-cursor');

        const cursor = document.createElement('div');
        cursor.className = 'ff-cursor';
        cursor.innerHTML = '<span class="ff-cursor-ring"></span><span class="ff-cursor-dot"></span>';
        document.body.appendChild(cursor);

        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let rx = x;
        let ry = y;
        let hovering = false;

        window.addEventListener('mousemove', (e) => {
            x = e.clientX;
            y = e.clientY;
            cursor.classList.add('is-on');
        }, { passive: true });

        window.addEventListener('mousedown', () => cursor.classList.add('is-click'));
        window.addEventListener('mouseup', () => cursor.classList.remove('is-click'));
        document.addEventListener('mouseleave', () => cursor.classList.remove('is-on'));

        document.querySelectorAll('a, button, .cta, .scroll').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                hovering = true;
                cursor.classList.add('is-hover');
            });
            el.addEventListener('mouseleave', () => {
                hovering = false;
                cursor.classList.remove('is-hover');
            });
        });

        const tick = () => {
            rx += (x - rx) * 0.18;
            ry += (y - ry) * 0.18;
            cursor.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }

    // —— Parallax personajes ——
    const left = document.querySelector('.char-left');
    const right = document.querySelector('.char-right');
    const hero = document.querySelector('.hero');

    if (!reduce && fine && left && right && hero) {
        hero.addEventListener('mousemove', (e) => {
            const r = hero.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            left.style.setProperty('--tx', `${(-px * 28).toFixed(1)}px`);
            left.style.setProperty('--ty', `${(-py * 16).toFixed(1)}px`);
            right.style.setProperty('--tx', `${(px * 28).toFixed(1)}px`);
            right.style.setProperty('--ty', `${(-py * 16).toFixed(1)}px`);
        }, { passive: true });
    }

    // —— Comenzar Aventura: feedback al click ——
    document.querySelectorAll('.cta').forEach((cta) => {
        cta.addEventListener('click', () => {
            cta.classList.add('is-loading');
            const label = cta.querySelector('.cta-label');
            if (label) label.textContent = 'Conectando Discord…';
        });
    });
})();
