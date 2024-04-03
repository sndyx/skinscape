import '$lib/i18n' // Import to initialize. Important :)
import { locale, waitLocale } from 'svelte-i18n'
import { preferences } from "$lib/stores";
import { browser } from "$app/environment";
import { get } from "svelte/store";
export async function load() {
    const language = get(preferences).language;
    if (browser) {
        if (language === 'auto') {
            locale.set(window.navigator.language);
        } else {
            locale.set(language);
        }
    }
    await waitLocale();
}