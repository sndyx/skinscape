import { json } from "@sveltejs/kit";
import { lucia } from "$lib/auth.js";
import { db } from "$lib/db.js";

export async function GET({ cookies }) {
    const sessionId = cookies.get(lucia.sessionCookieName);
    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });
    }
    if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: ".",
            ...sessionCookie.attributes
        });
    }

    // Return user data
    if (user) {
        const profile = await db.prepare(`SELECT * FROM profile WHERE id = '${user.id}';`).get();
        return json({ success: true, profile });
    } else {
        return json({ success: false, });
    }
}