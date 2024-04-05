import {get, type Writable, writable} from 'svelte/store';
import { persisted } from "svelte-persisted-store";
import { colord } from "colord";
import {Eraser, Eyedropper, Fill, Marquee, Pencil, Shape, Tool} from "./tools";
import {MutableSkin} from "./util/skin";
import {Models} from "./util/model";

export const preferences = persisted("preferences", {
    theme: 'dark',
    language: 'zh',
});

export const tools = {
    pencil: new Pencil(),
    eyedropper: new Eyedropper(),
    fill: new Fill(),
    eraser: new Eraser(),
    marquee: new Marquee(),
    shape: new Shape(),
}

export const rgba = persisted("rgba",
    { r: 0, g: 0, b: 0, a: 1 }, {
        serializer: {
            parse: (text) => colord(text).toRgb(),
            stringify: (object) => colord(object).toHex(),
        }
    }
);

// This is terrible. Nobody should ever do this. This is awful. I despise this. Please don't do this.
export const skins: Writable<MutableSkin> = persisted("skins",
    [new MutableSkin(Models.steve64)], {
        serializer: {
            parse: (text) => JSON.parse(text).map((json: any) => MutableSkin.fromJSON(json)),
            stringify: (object) => JSON.stringify(object.map((skin: MutableSkin) => skin.toJSON())),
        }
    }
);
// Now this, this nobody should do. This is something that is bad. This is bad. Don't do this.
// This function MUST be called every time a skin is updated to preserve reactivity and persistence. Nice!
export function updateSkins() {
    skins.set(get(skins));
}

export const tool: Writable<Tool> = writable(tools.pencil);

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
