<script>
    import { preferences } from '$lib/stores'
    import { get } from 'svelte/store';

    let theme = get(preferences).theme;

    preferences.subscribe(value => {
        value.theme
    })
</script>
  
<svelte:head>
    <link rel="stylesheet" href={`/themes/${theme}.css`} />
</svelte:head>
  
<slot />

<style>
    @font-face {
        font-family: 'Muncro';
        font-style: normal;
        font-weight: 500;
        src: url('/fonts/munro.woff2') format('woff')
    }
    @font-face {
        font-family: 'Silkscreen';
        font-style: normal;
        font-weight: 500;
        src: url('/fonts/slkscr.woff2') format('woff')
    }
</style>