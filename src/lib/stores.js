import { writable } from 'svelte/store';
import {Fill, Pencil} from "./tools.js";

export const preferences = writable({
    theme: 'light',
    language: 'auto',
});

export const rgba = writable({ r: 0, g: 0, b: 0, a: 1 });
export const tool = writable(new Fill());
export const activeEditor = writable(0);