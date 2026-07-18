/**
 * DB ligera sin módulos nativos (compatible con Vercel).
 * En Vercel usa /tmp (efímero). La fuente de verdad del bot sigue en Railway/SQLite.
 */
const fs = require('fs');
const path = require('path');

const isVercel = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dbPath = process.env.DB_PATH || (isVercel
    ? path.join('/tmp', 'flowfactory-web.json')
    : path.join(__dirname, 'flowfactory-web.json'));

const defaultData = {
    verified_users: {},
    whitelist_attempts: [],
    captcha_sessions: {}
};

function load() {
    try {
        if (fs.existsSync(dbPath)) {
            return { ...defaultData, ...JSON.parse(fs.readFileSync(dbPath, 'utf8')) };
        }
    } catch (e) {
        console.error('DB load:', e.message);
    }
    return structuredClone(defaultData);
}

function save(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('DB save:', e.message);
    }
}

let store = load();
console.log('✅ DB web lista:', dbPath);

function matchWhere(row, whereSql, params) {
    // Soporte mínimo: WHERE discord_id = ? AND status = ?
    // o WHERE discord_id = ? ORDER BY ... LIMIT
    if (!whereSql) return true;
    const clauses = whereSql
        .replace(/ORDER BY[\s\S]*/i, '')
        .replace(/LIMIT[\s\S]*/i, '')
        .replace(/^WHERE\s+/i, '')
        .split(/\s+AND\s+/i)
        .map(s => s.trim())
        .filter(Boolean);

    let pi = 0;
    for (const clause of clauses) {
        const m = clause.match(/^(\w+)\s*=\s*\?$/i);
        if (!m) continue;
        const key = m[1];
        const val = params[pi++];
        if (String(row[key]) !== String(val)) return false;
    }
    return true;
}

function parseSelect(sql) {
    // SELECT * FROM table WHERE ... ORDER BY created_at DESC LIMIT 1
    const from = sql.match(/FROM\s+(\w+)/i);
    const table = from ? from[1] : null;
    const whereMatch = sql.match(/WHERE\s+([\s\S]+?)(?:ORDER BY|LIMIT|$)/i);
    const where = whereMatch ? whereMatch[1].trim() : '';
    const order = /ORDER BY\s+created_at\s+DESC/i.test(sql);
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    const limit = limitMatch ? parseInt(limitMatch[1], 10) : null;
    return { table, where, order, limit };
}

const dbAsync = {
    run: async (sql, params = []) => {
        store = load();
        const insert = sql.match(/INSERT\s+INTO\s+(\w+)/i);
        const update = sql.match(/UPDATE\s+(\w+)\s+SET/i);
        const replace = /INSERT\s+OR\s+REPLACE/i.test(sql);

        if (insert) {
            const table = insert[1];
            if (table === 'whitelist_attempts') {
                const row = {
                    id: (store.whitelist_attempts[store.whitelist_attempts.length - 1]?.id || 0) + 1,
                    discord_id: params[0],
                    username: params[1],
                    score: params[2],
                    correct_answers: params[3],
                    time_taken: params[4],
                    answers: params[5],
                    status: params[6],
                    created_at: params[7]
                };
                store.whitelist_attempts.push(row);
                save(store);
                return { id: row.id, changes: 1 };
            }
            if (table === 'verified_users' || replace) {
                store.verified_users[params[0]] = {
                    discord_id: params[0],
                    username: params[1],
                    ip_address: params[2],
                    country: params[3],
                    verified_at: params[4]
                };
                save(store);
                return { id: params[0], changes: 1 };
            }
        }

        if (update) {
            const table = update[1];
            if (table === 'whitelist_attempts') {
                // UPDATE whitelist_attempts SET status='approved' WHERE discord_id=? AND status='pending'
                const whereMatch = sql.match(/WHERE\s+([\s\S]+)$/i);
                const where = whereMatch ? whereMatch[1] : '';
                let changes = 0;
                // Simple: set status approved for matching
                for (const row of store.whitelist_attempts) {
                    if (matchWhere(row, where, params.slice(-2).length ? params : params)) {
                        // Detect SET status='approved' or SET status=?
                        if (/status\s*=\s*'approved'/i.test(sql) || /status\s*=\s*\?/i.test(sql)) {
                            if (/status\s*=\s*\?/i.test(sql)) row.status = params[0];
                            else row.status = 'approved';
                            changes++;
                        }
                    }
                }
                // Fallback específico usado en server.js
                if (!changes && params[0]) {
                    for (const row of store.whitelist_attempts) {
                        if (row.discord_id === params[0] && row.status === 'pending') {
                            row.status = 'approved';
                            changes++;
                        }
                    }
                }
                save(store);
                return { id: 0, changes };
            }
        }

        return { id: 0, changes: 0 };
    },

    get: async (sql, params = []) => {
        store = load();
        const { table, where, order, limit } = parseSelect(sql);
        if (table === 'whitelist_attempts') {
            let rows = store.whitelist_attempts.filter(r => matchWhere(r, where, params));
            if (order) rows = rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            return rows[0] || null;
        }
        if (table === 'verified_users') {
            const id = params[0];
            return store.verified_users[id] || null;
        }
        return null;
    },

    all: async (sql, params = []) => {
        store = load();
        const { table, where, order, limit } = parseSelect(sql);
        if (table === 'whitelist_attempts') {
            let rows = store.whitelist_attempts.filter(r => matchWhere(r, where, params));
            if (order) rows = rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            if (limit) rows = rows.slice(0, limit);
            return rows;
        }
        return [];
    }
};

const db = { async: dbAsync };

module.exports = { db, dbAsync };
