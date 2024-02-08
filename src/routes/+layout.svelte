<script lang="ts">
    import { preferences } from '$lib/stores'
    import { get } from 'svelte/store';
    import { _ } from '$lib/i18n';

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
    @font-face {
        font-family: 'LanaPixel';
        font-style: normal;
        font-weight: 500;
        src: url('/fonts/LanaPixel.woff2') format('woff')
    }

    :global(*) {
        image-rendering: pixelated;
        overflow: hidden;
    }
</style>