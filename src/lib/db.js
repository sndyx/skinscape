import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('test.db');

db.run(`
CREATE TABLE IF NOT EXISTS user_credentials (
    username TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS user_info (
    username TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    display_skin TEXT,
    badges JSON DEFAULT('[]'),
    skins JSON DEFAULT('[]'),
    favorites JSON DEFAULT('[]')
);
`);

db.run(`
CREATE TABLE IF NOT EXISTS skins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);
`);

console.log("db initialized");

export function hasEmail(email) {
    return new Promise((resolve, reject) => {
        return db.get(`SELECT EXISTS(SELECT 1 FROM user_credentials WHERE email = '${email}');`, (err, res) => {
            if (err) { reject(err); } else { resolve(res); }
        });
    });
}

export function hasUsername(username) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT EXISTS(SELECT 1 FROM user_credentials WHERE username = '${username}');`, (err, res) => {
            if (err) { reject(err); } else { resolve(res); }
        });
    });
}

export async function createUser(username, email, password, display_name) {
    const hashed_password = bcrypt.hashSync(password, 10);
    db.run(`
        INSERT OR IGNORE INTO user_credentials (username, email, password)
         VALUES ('${username}', '${email}', '${hashed_password}');
    `);
    db.run(`
        INSERT OR IGNORE INTO user_info (username, display_name)
        VALUES ('${username}', '${display_name}');
    `);
}

export async function getUserInfo(username) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT display_name, badges, skins, favorites FROM user_info WHERE username = '${username}';`, (err, row) => {
            if (err) { reject(err); } else { resolve(row); }
        });
    });
}