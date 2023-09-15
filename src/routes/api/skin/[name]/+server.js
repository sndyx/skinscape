export async function GET({ params }) {
    
    return new Response(await getSkinByName(params.name));
}

async function getSkinByName(name) {
    const response = await (await fetch(`https://api.mojang.com/users/profiles/minecraft/${name}`)).json();
    return await getSkinByUuid(response['id']);
}

async function getSkinByUuid(uuid) {
    const response = await (await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`)).json();
    let textures = JSON.parse(atob(response['properties'][0]['value']));
    const response_1 = await fetch(textures['textures']['SKIN']['url']);
    return await response_1.arrayBuffer();
}