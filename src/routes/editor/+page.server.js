import { db } from "$lib/db.js";

export function load() {
    db.prepare(`UPDATE analytics SET value = value + 1 WHERE category = 'skins_created';`).run();
}