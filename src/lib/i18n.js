import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./lang/en.json'));
register('jp', () => import('./lang/jp.json'));

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
});