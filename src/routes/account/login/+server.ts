import { error, json } from "@sveltejs/kit";
import { Argon2id } from "oslo/password";
import { lucia } from "$lib/auth";
import { db } from "$lib/db";

export async function POST({ url, cookies }) {
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");

    const user = await db.prepare(`SELECT id, password FROM user WHERE username = ?`).get(username);

    if (!user) {
        error(400, {
            success: false,
            target: "username",
            message: "auth.login.error.username-not-found",
        });
    }

    if (!await new Argon2id().verify(user.password, password)) {
        error(400, {
            success: false,
            target: "password",
            message: "auth.login.error.password-incorrect",
        });
    }

    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
    });

    return json({ success: true });
}