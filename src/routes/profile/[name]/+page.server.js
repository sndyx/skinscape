import { createUser, getUserInfo } from "$lib/db.js";

export async function load({ params }) {
    createUser(params.name, "hello123", "sandy@sndy.moe", "Sandy");
    return {
        info: await getUserInfo(params.name),
    };
}