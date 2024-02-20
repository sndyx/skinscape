import { createUser, getUserInfo } from "$lib/db.js";

export async function load({ params }) {
    createUser(params.name, "hello123", "Sandy", "sandy@sndy.moe")
    getUserInfo(params.name).then((db) => {
        console.log(db);
        return {
            data: db,
        }
    });
}