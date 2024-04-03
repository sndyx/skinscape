import Database from 'better-sqlite3';

export const db = new Database('test.db', { verbose: console.log });
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);`);

db.exec(`
CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);`);

db.exec(`
CREATE TABLE IF NOT EXISTS profile (
    id INTEGER NOT NULL PRIMARY KEY,
    username INTEGER UNIQUE NOT NULL,
    join_date INTEGER NOT NULL,
    display_name TEXT,
    display_skin TEXT DEFAULT('/default.png'),
    badges JSON DEFAULT('[]'),
    skins JSON DEFAULT('[]'),
    favorites JSON DEFAULT('[]')
);`);

db.exec(`
CREATE TABLE IF NOT EXISTS skin (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
);`);

db.exec(`
CREATE TABLE IF NOT EXISTS analytics (
    category TEXT NOT NULL PRIMARY KEY,
    value INTEGER DEFAULT(0)
);`);