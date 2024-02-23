<script lang="ts">
    import { preferences } from '$lib/stores';
    import { get } from 'svelte/store';

    let theme = get(preferences)['theme'];

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
        font-weight: 100;
        src: url('/fonts/slkscr.woff2') format('woff')
    }
    @font-face {
        font-family: 'LanaPixel';
        font-style: normal;
        font-weight: 100;
        src: url('/fonts/LanaPixel.woff2') format('woff')
    }
    @font-face {
        font-family: 'Unifont';
        font-style: normal;
        font-weight: 500;
        src: url('/fonts/Unifont.woff2') format('woff')
    }

    :global(*) { /* Only works with :global despite being in a layout? */
        image-rendering: pixelated;
        overflow: hidden;

        -webkit-user-select: none; /* Chrome/Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+ */
        user-select: none;
    }

    :global(.text) {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;

        /* Try to fix blurry fonts */
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: subpixel-antialiased;
        -moz-osx-font-smoothing: grayscale;

        cursor: url('/icons/input@2x.png') 12 12, auto;
    }

    :global(.border) {
        margin: 6px;
        box-shadow:
                2px 0 0 0 var(--border-dark),
                -2px 0 0 0 var(--border-dark),
                0 2px 0 0 var(--border-dark),
                0 -2px 0 0 var(--border-dark),
                0 0 0 2px var(--border-light),
                4px 0 0 0 var(--border-light),
                -4px 0 0 0 var(--border-light),
                0 4px 0 0 var(--border-light),
                0 -4px 0 0 var(--border-color),
                0 0 0 4px var(--border-dark),
                -4px 0 0 2px var(--border-dark),
                4px 0 0 2px var(--border-dark),
                0 4px 0 2px var(--border-dark),
                0 -4px 0 2px var(--border-dark);
    }

    :global(.border-small) {
        margin: 4px;
        box-shadow: 2px 0 0 0 var(--border-dark), -2px 0 0 0 var(--border-dark), 0 2px 0 0 var(--border-dark), 0 -2px 0 0 var(--border-dark), 0 0 0 2px var(--border-color), 4px 0 0 0 var(--border-color), -4px 0 0 0 var(--border-color), 0 4px 0 0 var(--border-light), 0 -4px 0 0 var(--border-color);
    }
</style>