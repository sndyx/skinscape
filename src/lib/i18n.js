import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./lang/en.json'));
register('jp', () => import('./lang/jp.json'));
register('cn', () => import('./lang/cn.json'));

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
});