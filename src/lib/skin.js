export async function getSkinByName(name) {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`);
    return await skinFromUuid(response['id']);
}

export async function getSkinByUuid(uuid) {
    const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
    let textures = JSON.parse(atob(response['properties'][0]['value']));
    const response_1 = await fetch(textures['textures']['SKIN']['url']);
    return await response_1.arrayBuffer();
}