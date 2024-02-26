import { writable } from 'svelte/store';
import { browser } from "$app/environment"
import { Eyedropper, Fill, Pencil, Tool } from "./tools.js";
import { colord } from "colord";
import {Skin} from "./skin.js";

export const preferences = writable({
    theme: 'light',
    language: 'auto',
});

export const tools = {
    pencil: new Pencil(),
    eyedropper: new Eyedropper(),
    fill: new Fill(),
}

export const rgba = writable(
    browser && colord(localStorage.getItem("rgba")).toRgb()
    || { r: 0, g: 0, b: 0, a: 1 }
);
rgba.subscribe((value) => { if (browser) localStorage.rgba = colord(value).toHex() });

let skin = [new Skin()];
if (browser) {
    const json = localStorage.getItem("skins");
    if (json) {
        skin = JSON.parse(json).map((json) => { return Skin.fromJSON(json) })
    }
}

export const skins = writable(skin);
skins.subscribe((value) => { if (browser) localStorage.skins = JSON.stringify(value) });

export const tool = writable(tools.pencil);


export const activeEditor = writable(0);

export const profile = writable(null);

export const showAuthOverlay = writable(false);

export function updateProfile() {
    fetch("/account").then((res) => res.json()).then((json) => {
        if (json.success) {
            profile.set(json.profile);
        } else {
            profile.set(null);
        }
    });
}