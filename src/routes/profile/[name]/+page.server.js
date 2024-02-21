import { error } from "@sveltejs/kit";
import { db, profiles } from "$lib/db.js";
import { eq } from "drizzle-orm";

export async function load({ params }) {
    const profile = await db.select().from(profiles).where(eq(profiles.username, params.username)).limit(1)[0];

    if (!profile) {
        error(404, {
            message: "User not found"
        })
    }

    return { profile };
}