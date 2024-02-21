import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { dev } from "$app/environment";
import { sqlite } from "./db.js";

const adapter = new BetterSqlite3Adapter(sqlite, {
    user: "users",
    session: "sessions",
});

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: !dev
        }
    }
});