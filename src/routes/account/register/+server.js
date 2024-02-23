import { error, json } from "@sveltejs/kit";
import { Argon2id } from "oslo/password";
import { lucia } from "$lib/auth.js";
import { db } from "$lib/db.js";

export async function POST({ url, cookies }) {
    const username = url.searchParams.get("username");
    const password = url.searchParams.get("password");
    const email = url.searchParams.get("email");

    if (username.length < 3) {
        error(400, {
            success: false,
            target: "username",
            message: "auth.register.error.username-too-short",
        });
    } else if (username.length > 29) {
        error(400, {
            success: false,
            target: "username",
            message: "auth.register.error.username-too-long"
        })
    }  else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        error(400, {
            success: false,
            target: "username",
            message: "auth.register.error.username-not-alphanumeric"
        })
    }

    if (password.length < 6) {
        error(400, {
            success: false,
            target: "password",
            message: "auth.register.error.password-too-short",
        });
    } else if (password.length > 255) {
        error(400, {
            success: false,
            target: "password",
            message: "auth.register.error.password-too-long",
        });
    }

    if (
        !/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/.test(email)
    ) {
        error(400, {
            success: false,
            target: "email",
            message: "auth.register.error.email-invalid",
        });
    }

    if (
        Object.values(await db.prepare(`SELECT EXISTS (SELECT 1 FROM user WHERE username = ?);`).get(username))[0] === 1
    ) {
        error(400, {
            success: false,
            target: "username",
            message: "auth.register.error.username-already-exists",
        });
    }

    if (
        Object.values(await db.prepare(`SELECT EXISTS(SELECT 1 FROM user WHERE email = ?);`).get(email))[0] === 1
    ) {
        error(400, {
            success: false,
            target: 'email',
            message: "auth.register.error.email-already-exists",
        });
    }

    const hashedPassword = await new Argon2id().hash(password);

    const id = (await db.prepare(`
        INSERT INTO user (username, password, email)
        VALUES (?, ?, ?);
    `).run(username, hashedPassword, email)).lastInsertRowid; // Get user id of inserted value (row id)

    db.prepare(`
        INSERT INTO profile (id, username, join_date)
        VALUES (?, ?, ?);
    `).run(id, username, Date.now()); // insert basic profile data, no need to wait for result

    const session = await lucia.createSession(id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies.set(sessionCookie.name, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
    });

    return json({ success: true });
}