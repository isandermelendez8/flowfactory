const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const svgCaptcha = require('svg-captcha');
require('dotenv').config();

const { db, dbAsync } = require('./database');
const { whitelistQuestions } = require('./questions');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
const BRAND = 'Flow Factory RP';
const LOGO = process.env.SERVER_LOGO || '/img/logo.png';
const WL_COOLDOWN_MS = (parseInt(process.env.WL_COOLDOWN_MINUTES || '10', 10)) * 60 * 1000;

function parseYouTube(url = '') {
    try {
        const u = new URL(url);
        const videoId = u.searchParams.get('v') || (u.pathname.includes('/embed/') ? u.pathname.split('/embed/')[1] : '');
        const playlistId = u.searchParams.get('list') || '';
        return { videoId: videoId || 'X2MGCIDOMZ4', playlistId };
    } catch {
        return { videoId: 'X2MGCIDOMZ4', playlistId: 'RDX2MGCIDOMZ4' };
    }
}

const musicParsed = parseYouTube(process.env.MUSIC_YOUTUBE_URL || 'https://www.youtube.com/watch?v=X2MGCIDOMZ4&list=RDX2MGCIDOMZ4&start_radio=1');
const MUSIC = {
    enabled: String(process.env.MUSIC_ENABLED || 'true').toLowerCase() !== 'false',
    url: process.env.MUSIC_YOUTUBE_URL || 'https://www.youtube.com/watch?v=X2MGCIDOMZ4&list=RDX2MGCIDOMZ4&start_radio=1',
    volume: parseInt(process.env.MUSIC_VOLUME || '18', 10),
    autoplay: String(process.env.MUSIC_AUTOPLAY || 'true').toLowerCase() !== 'false',
    videoId: musicParsed.videoId,
    playlistId: musicParsed.playlistId
};
const ADMIN_ROLE_IDS = (process.env.ADMIN_ROLE_IDS || '1526381200824864852,1526381198874644541,1526382865170825306,1526382863002636400,1526382860397973506,1526382858133049404')
    .split(',').map(s => s.trim()).filter(Boolean);

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// index:false para que `/` use la vista EJS (landing), no public/index.html
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production' || !!process.env.VERCEL,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
const whitelistLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Demasiados intentos. Espera un poco.'
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL || process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/auth/discord/callback',
    scope: ['identify', 'guilds', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const guildMember = profile.guilds?.find(g => g.id === process.env.DISCORD_GUILD_ID);
        return done(null, {
            id: profile.id,
            username: profile.username,
            discriminator: profile.discriminator,
            avatar: profile.avatar,
            email: profile.email,
            accessToken,
            inGuild: !!guildMember,
            guildMember,
            createdAt: profile.fetchedAt || null
        });
    } catch (err) {
        return done(err, null);
    }
}));

function requireAuth(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    next();
}

function requireGuild(req, res, next) {
    if (!req.user.inGuild) {
        return res.render('error', {
            message: 'Debes unirte a nuestro servidor de Discord para continuar',
            invite: process.env.DISCORD_INVITE || '#'
        });
    }
    next();
}

async function isWebsiteAdmin(userId) {
    try {
        const { data } = await axios.get(`${process.env.BOT_API_URL}/api/user/${userId}/admin`, {
            headers: { Authorization: process.env.BOT_SECRET },
            timeout: 5000
        });
        return !!data.isAdmin;
    } catch {
        return false;
    }
}

async function requireAdmin(req, res, next) {
    if (!req.isAuthenticated()) return res.redirect('/login');
    const ok = await isWebsiteAdmin(req.user.id);
    if (!ok) {
        return res.status(403).render('error', {
            message: 'Solo administradores (roles de Discord) pueden acceder.',
            invite: process.env.DISCORD_INVITE || '#'
        });
    }
    next();
}

async function hasWhitelist(userId) {
    const result = await dbAsync.get(
        'SELECT * FROM whitelist_attempts WHERE discord_id = ? AND status = ?',
        [userId, 'approved']
    );
    if (result) return true;
    try {
        const { data } = await axios.get(`${process.env.BOT_API_URL}/api/whitelist/status/${userId}`, {
            headers: { Authorization: process.env.BOT_SECRET },
            timeout: 4000
        });
        if (data.application?.status === 'approved') {
            await dbAsync.run(
                `UPDATE whitelist_attempts SET status='approved' WHERE discord_id=? AND status='pending'`,
                [userId]
            );
            return true;
        }
    } catch (_) {}
    return false;
}

async function canAttemptWhitelist(userId) {
    const lastAttempt = await dbAsync.get(
        'SELECT * FROM whitelist_attempts WHERE discord_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
    );
    if (!lastAttempt) return true;
    if (lastAttempt.status === 'approved' || lastAttempt.status === 'pending') return false;
    if (lastAttempt.status === 'denied') {
        const ms = Date.now() - new Date(lastAttempt.created_at).getTime();
        return ms >= WL_COOLDOWN_MS;
    }
    return false;
}

function clientIp(req) {
    const xf = req.headers['x-forwarded-for'];
    const ip = (xf ? String(xf).split(',')[0] : null) || req.headers['x-real-ip'] || req.socket.remoteAddress || '';
    return String(ip).replace('::ffff:', '').trim();
}

async function lookupGeo(ip) {
    try {
        if (!ip || ip === '127.0.0.1' || ip === '::1') {
            return { country: 'Local', region: 'Local', city: 'Local' };
        }
        const { data } = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,proxy,hosting`, { timeout: 4000 });
        if (data.status === 'success') {
            return {
                country: data.country,
                region: data.regionName,
                city: data.city,
                isVpn: !!(data.proxy || data.hosting)
            };
        }
    } catch (_) {}
    return { country: reqCountryFallback(), region: 'Unknown', city: 'Unknown', isVpn: false };
}

function reqCountryFallback() {
    return 'Unknown';
}

app.locals.brand = BRAND;
app.locals.logo = LOGO;

app.get('/login', passport.authenticate('discord'));
app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    (req, res) => res.redirect('/whitelist')
);
app.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

app.get('/api/public-config', (req, res) => {
    res.json({ music: MUSIC, brand: BRAND, logo: LOGO });
});

app.get('/', (req, res) => res.render('index', { user: req.user, brand: BRAND, logo: LOGO, music: MUSIC }));
app.get('/rules', (req, res) => res.render('rules', { user: req.user, brand: BRAND, logo: LOGO, music: MUSIC }));

app.get('/dashboard', requireAuth, requireGuild, async (req, res) => {
    const applications = await dbAsync.all(
        'SELECT * FROM whitelist_attempts WHERE discord_id = ? ORDER BY created_at DESC',
        [req.user.id]
    );
    const admin = await isWebsiteAdmin(req.user.id);
    let verified = null;
    try {
        const { data } = await axios.get(`${process.env.BOT_API_URL}/api/verified/${req.user.id}`, {
            headers: { Authorization: process.env.BOT_SECRET },
            timeout: 4000
        });
        verified = data;
    } catch (_) {}

    res.render('dashboard', {
        user: req.user,
        applications,
        hasWhitelist: await hasWhitelist(req.user.id),
        isAdmin: admin,
        verified,
        brand: BRAND,
        logo: LOGO
    });
});

app.get('/admin', requireAuth, requireAdmin, async (req, res) => {
    const pending = await dbAsync.all(
        `SELECT * FROM whitelist_attempts WHERE status = 'pending' ORDER BY created_at DESC LIMIT 50`
    );
    res.render('dashboard', {
        user: req.user,
        applications: pending,
        hasWhitelist: true,
        isAdmin: true,
        adminPanel: true,
        brand: BRAND,
        logo: LOGO
    });
});

app.get('/whitelist', requireAuth, requireGuild, async (req, res) => {
    const canAttempt = await canAttemptWhitelist(req.user.id);
    const hasWL = await hasWhitelist(req.user.id);
    if (hasWL) return res.render('whitelist-complete', { user: req.user, message: 'Ya tienes whitelist aprobada', logo: LOGO });
    if (!canAttempt) return res.render('whitelist-cooldown', { user: req.user, logo: LOGO });
    res.render('whitelist-intro', { user: req.user, brand: BRAND, logo: LOGO });
});

app.get('/whitelist/start', requireAuth, requireGuild, async (req, res) => {
    if (await hasWhitelist(req.user.id) || !(await canAttemptWhitelist(req.user.id))) {
        return res.redirect('/whitelist');
    }
    // Anti-cheat: shuffle question order stored in session
    const order = whitelistQuestions.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    req.session.whitelistStart = Date.now();
    req.session.answers = {};
    req.session.currentQuestion = 0;
    req.session.questionOrder = order;
    req.session.quizToken = `${req.user.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    res.redirect('/whitelist/quiz');
});

app.get('/whitelist/quiz', requireAuth, requireGuild, (req, res) => {
    if (!req.session.whitelistStart || !req.session.questionOrder) return res.redirect('/whitelist');
    const current = req.session.currentQuestion || 0;
    const realIndex = req.session.questionOrder[current];
    const question = whitelistQuestions[realIndex];
    if (!question) return res.redirect('/whitelist/review');
    const elapsed = Math.floor((Date.now() - req.session.whitelistStart) / 1000);
    // Anti-cheat: answers too fast overall later
    res.render('quiz', {
        user: req.user,
        question,
        current: current + 1,
        total: whitelistQuestions.length,
        elapsed,
        answered: Object.keys(req.session.answers || {}).length,
        brand: BRAND,
        logo: LOGO
    });
});

app.post('/whitelist/answer', requireAuth, requireGuild, (req, res) => {
    const { questionIndex, answer } = req.body;
    if (!req.session.answers) req.session.answers = {};
    if (!req.session.answerTimes) req.session.answerTimes = [];
    req.session.answerTimes.push(Date.now());
    const idx = parseInt(questionIndex, 10);
    const realIndex = req.session.questionOrder?.[idx] ?? idx;
    req.session.answers[realIndex] = answer;
    req.session.currentQuestion = idx + 1;
    if (req.session.currentQuestion >= whitelistQuestions.length) {
        return res.json({ redirect: '/whitelist/review' });
    }
    res.json({ success: true });
});

app.post('/whitelist/navigate', requireAuth, requireGuild, (req, res) => {
    req.session.currentQuestion = parseInt(req.body.question, 10);
    res.json({ redirect: '/whitelist/quiz' });
});

app.get('/whitelist/review', requireAuth, requireGuild, (req, res) => {
    if (!req.session.answers) return res.redirect('/whitelist');
    const answers = req.session.answers;
    const reviewData = whitelistQuestions.map((q, i) => ({
        question: q.question,
        userAnswer: answers[i],
        index: i
    }));
    res.render('review', {
        user: req.user,
        questions: reviewData,
        answered: Object.keys(answers).length,
        total: whitelistQuestions.length,
        brand: BRAND,
        logo: LOGO
    });
});

app.post('/whitelist/submit', requireAuth, requireGuild, whitelistLimiter, async (req, res) => {
    if (!req.session.answers || !req.session.whitelistStart) {
        return res.status(400).json({ error: 'Sesión inválida' });
    }
    if (!(await canAttemptWhitelist(req.user.id))) {
        return res.status(429).json({ error: 'Cooldown activo' });
    }

    const answers = req.session.answers;
    const timeTaken = Math.floor((Date.now() - req.session.whitelistStart) / 1000);

    // Anti-cheat: demasiado rápido (< 45s para 45 preguntas)
    if (timeTaken < 45) {
        return res.status(400).json({ error: 'Envío inválido (anti-cheat). Responde con calma.' });
    }

    let correct = 0;
    const formattedAnswers = [];
    whitelistQuestions.forEach((q, i) => {
        const userAnswer = answers[i];
        const isCorrect = userAnswer === q.correct;
        if (isCorrect) correct++;
        formattedAnswers.push({ question: q.question, answer: userAnswer, correct: isCorrect });
    });

    const score = Math.round((correct / whitelistQuestions.length) * 100);
    let status = 'pending';
    if (correct >= 38) status = 'pending'; // fase 2 voz — staff aprueba
    else if (correct >= 35) status = 'pending';
    else status = 'denied';

    await dbAsync.run(
        `INSERT INTO whitelist_attempts (discord_id, username, score, correct_answers, time_taken, answers, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, req.user.username, score, correct, timeTaken, JSON.stringify(formattedAnswers), status, new Date().toISOString()]
    );

    try {
        await axios.post(`${process.env.BOT_API_URL}/api/whitelist/submit`, {
            userId: req.user.id,
            username: req.user.username,
            avatar: req.user.avatar,
            score,
            correct,
            time: `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`,
            answers: formattedAnswers,
            joinedDiscordAt: req.user.guildMember ? 'En servidor' : 'N/A'
        }, {
            headers: { Authorization: process.env.BOT_SECRET },
            timeout: 10000
        });
    } catch (err) {
        console.error('Error enviando al bot:', err.message);
    }

    delete req.session.whitelistStart;
    delete req.session.answers;
    delete req.session.currentQuestion;
    delete req.session.questionOrder;
    delete req.session.answerTimes;
    delete req.session.quizToken;

    if (status === 'denied') {
        return res.json({ redirect: '/whitelist/denied', status: 'denied', score });
    }
    return res.json({ redirect: '/whitelist/pending', status: 'pending', score });
});

app.get('/whitelist/complete', requireAuth, requireGuild, (req, res) => {
    res.render('whitelist-result', {
        user: req.user,
        status: 'approved',
        message: '¡Felicidades! Tu whitelist ha sido aprobada.',
        brand: BRAND,
        logo: LOGO
    });
});

app.get('/whitelist/denied', requireAuth, requireGuild, (req, res) => {
    res.render('whitelist-result', {
        user: req.user,
        status: 'denied',
        message: `No alcanzaste el puntaje mínimo. Espera ${process.env.WL_COOLDOWN_MINUTES || 10} minutos para reintentar.`,
        brand: BRAND,
        logo: LOGO
    });
});

app.get('/whitelist/pending', requireAuth, requireGuild, (req, res) => {
    res.render('whitelist-result', {
        user: req.user,
        status: 'pending',
        message: 'Fase 2: espera la llamada a sala de voz. Un admin te contactará por DM.',
        brand: BRAND,
        logo: LOGO
    });
});

// ==================== VERIFICACIÓN ====================

app.get('/verify', requireAuth, async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(400).send('Token requerido');

    try {
        const { data } = await axios.get(`${process.env.BOT_API_URL}/api/verified/${req.user.id}`, {
            headers: { Authorization: process.env.BOT_SECRET },
            timeout: 4000
        });
        if (data.verified) {
            return res.render('error', {
                message: 'Ya estás verificado. No puedes verificarte dos veces.',
                invite: process.env.DISCORD_INVITE || '#'
            });
        }
    } catch (_) {}

    const captcha = svgCaptcha.create({ size: 6, noise: 3, color: true, background: '#111827' });
    req.session.captchaText = captcha.text;
    req.session.verifyToken = token;

    res.render('verify', {
        user: req.user,
        captcha: captcha.data,
        token,
        brand: BRAND,
        logo: LOGO
    });
});

app.post('/verify', requireAuth, async (req, res) => {
    const { captcha, token } = req.body;
    if (!captcha || captcha.toLowerCase() !== String(req.session.captchaText || '').toLowerCase()) {
        return res.json({ success: false, error: 'Captcha incorrecto' });
    }
    if (token !== req.session.verifyToken) {
        return res.json({ success: false, error: 'Token de sesión inválido' });
    }

    const ip = clientIp(req);
    const geo = await lookupGeo(ip);
    const ua = req.headers['user-agent'] || '';

    try {
        const response = await axios.post(`${process.env.BOT_API_URL}/api/verify`, {
            token,
            userId: req.user.id,
            ipData: { ip, country: geo.country, region: geo.region, city: geo.city },
            userAgent: ua,
            headers: {
                via: req.headers['via'],
                'x-forwarded-for': req.headers['x-forwarded-for']
            },
            isVpn: !!geo.isVpn
        }, {
            headers: { Authorization: process.env.BOT_SECRET },
            timeout: 10000
        });

        if (response.data.success) {
            await dbAsync.run(
                `INSERT OR REPLACE INTO verified_users (discord_id, username, ip_address, country, verified_at)
                 VALUES (?, ?, ?, ?, ?)`,
                [req.user.id, req.user.username, ip, geo.country, new Date().toISOString()]
            );
            delete req.session.captchaText;
            delete req.session.verifyToken;
            return res.json({ success: true });
        }
        return res.json({ success: false, error: response.data.error || 'Error de verificación' });
    } catch (err) {
        console.error('Error verificando:', err.message);
        return res.json({ success: false, error: 'Error de conexión con el bot' });
    }
});

app.get('/api/user', requireAuth, (req, res) => res.json(req.user));
app.get('/api/questions', (req, res) => {
    res.json(whitelistQuestions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        category: q.category
    })));
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', { message: 'Error interno del servidor', invite: process.env.DISCORD_INVITE || '#' });
});

app.use((req, res) => {
    res.status(404).render('error', { message: 'Página no encontrada', invite: process.env.DISCORD_INVITE || '#' });
});

// En Vercel no hacemos listen (serverless). En local sí.
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🌐 ${BRAND} Website → http://localhost:${PORT}`);
    });
}

module.exports = app;
