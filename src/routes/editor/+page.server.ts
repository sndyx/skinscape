import { db } from "$lib/db";

export function load() {
    // Analytics! Lets go!!!
    db.prepare(`UPDATE analytics SET value = value + 1 WHERE category = 'skins_created';`).run();
}