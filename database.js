const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'flowfactory.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error conectando a SQLite:', err);
    } else {
        console.log('✅ Conectado a SQLite (Website)');
        initDatabase();
    }
});

function initDatabase() {
    db.serialize(() => {
        // Tabla de usuarios verificados
        db.run(`
            CREATE TABLE IF NOT EXISTS verified_users (
                discord_id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                ip_address TEXT,
                country TEXT,
                verified_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabla de intentos de whitelist
        db.run(`
            CREATE TABLE IF NOT EXISTS whitelist_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                discord_id TEXT NOT NULL,
                username TEXT NOT NULL,
                score INTEGER DEFAULT 0,
                correct_answers INTEGER DEFAULT 0,
                time_taken INTEGER,
                answers TEXT,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabla de sesiones de captcha
        db.run(`
            CREATE TABLE IF NOT EXISTS captcha_sessions (
                token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                captcha_text TEXT NOT NULL,
                attempts INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME
            )
        `);

        console.log('✅ Tablas inicializadas (Website)');
    });
}

// Helpers con Promises
const dbAsync = {
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    },
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

module.exports = { db, dbAsync };
