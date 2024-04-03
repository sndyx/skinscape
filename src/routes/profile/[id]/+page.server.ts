import { error } from "@sveltejs/kit";
import { db } from "$lib/db";

export async function load({ params }) {
    const id = params.id;

    if (Number.isInteger(Number(id))) {
        // Load page from user id
        const profile = await db.prepare(`SELECT * FROM profile WHERE id = '${id}';`).get();
        if (profile) {
            return { profile };
        }
    }
    if (/^[a-zA-Z0-9_]+$/.test(id)) {
        // Load page from username
        const profile = await db.prepare(`SELECT * FROM profile WHERE username = '${id}';`).get();
        if (profile) {
            return { profile };
        }
    }

    error(404, {
        message: "User not found"
    });
}