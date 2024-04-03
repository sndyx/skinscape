import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./lang/en.json'));
register('ja', () => import('./lang/ja.json'));
register('zh', () => import('./lang/zh.json'));

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
});