import { writable } from 'svelte/store';
import {Eyedropper, Fill, Pencil, Tool} from "./tools.js";

export const preferences = writable({
    theme: 'light',
    language: 'auto',
});

export const tools = {
    pencil: new Pencil(),
    eyedropper: new Eyedropper(),
    fill: new Fill(),
}

export const rgba = writable({ r: 0, g: 0, b: 0, a: 1 });
export const tool = writable(tools.pencil);
export const activeEditor = writable(0);