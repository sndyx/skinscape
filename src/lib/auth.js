import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { dev } from "$app/environment";
import { db } from "./db.js";

const adapter = new BetterSqlite3Adapter(db, {
    user: "user",
    session: "session",
});

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev
        }
    }
});