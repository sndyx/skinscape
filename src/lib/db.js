import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('test.db');

db.run(`
CREATE TABLE user_credentials (
    username TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT NOT NULL
);
`);

db.run(`
CREATE TABLE user_info (
    username TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    badges JSON DEFAULT('[]'),
    skins JSON DEFAULT('[]'),
    favorites JSON DEFAULT('[]')
);
`);

db.run(`
CREATE TABLE skins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);
`);

console.log("db initialized");

export function createUser(username, email, password, display_name) {
    const hashed_password = bcrypt.hashSync(password, 10);
    db.run(`
    INSERT INTO user_credentials (username, email, password)
    VALUES ('${username}', '${email}', '${hashed_password}');
    `);
    db.run(`
    INSERT INTO user_info (username, display_name)
    VALUES ('${username}', '${display_name}');
    `);
}

export async function getUserInfo(username) {
    return db.get(`SELECT * FROM user_info WHERE username = '${username}';`);
}