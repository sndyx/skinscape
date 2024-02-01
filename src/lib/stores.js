import { writable } from 'svelte/store';
import { Pencil, Fill } from "./tools.js";

export const preferences = writable({
    theme: 'light',
    gridlines: false,
});

export const rgba = writable({ r: 0, g: 0, b: 0, a: 1 });
export const tool = writable(new Fill());
export const activeEditor = writable(0);