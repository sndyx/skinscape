import { drizzle } from 'drizzle-orm/better-sqlite3';
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import Database from 'better-sqlite3';

export const sqlite = new Database('test.db');
export const db = drizzle(sqlite);

export const users = sqliteTable('users', {
    id: text('id').notNull().primaryKey(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    email: text('email').notNull().unique(),
});

export const sessions = sqliteTable('sessions', {
    id: text('id').notNull().primaryKey(),
    expires_at: integer('expires_at').notNull(),
    user_id: text('user_id').notNull().references(() => user.id),
});

export const profiles = sqliteTable('profiles', {
    id: text('id').notNull().primaryKey(),
    username: text('username').notNull().unique(),
    display_name: text('display_name'),
    display_skin: text('display_skin'),
    skins: text('skins', { mode: 'json' }).notNull().default('[]'),
    badges: text('badges', { mode: 'json' }).notNull().default('[]'),
    favorites: text('favorites', { mode: 'json' }).notNull().default('[]'),
});

export const skins = sqliteTable('skins', {
    id: text('id').notNull().primaryKey(),
    name: text('name').notNull(),
});