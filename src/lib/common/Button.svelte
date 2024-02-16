<script>
    export let svg;
    export let selected = false;
    export let click;
</script>

{#if selected}
    <div class="button button-selected" on:mousedown={click}>
        <img src={svg} />
    </div>
{:else}
    <div class="button button-unselected" on:mousedown={click}>
        <img src={svg} />
    </div>
{/if}

<style>
    .button {
        aspect-ratio: 1/1;
        margin: 6px 6px 10px;
    }

    .button:hover {
        --border-dark: var(--button-hover);
    }

    .button-unselected {
        background: var(--button-color);
        box-shadow: 2px 0 0 0 var(--button-color), -2px 0 0 0 var(--button-color), 0 2px 0 0 var(--button-color), -2px -2px 0 0 var(--button-color), 2px -2px 0 0 var(--button-color), 0 0 0 2px var(--button-light, var(--border-light)), 4px 0 0 0 var(--button-color), -4px 0 0 0 var(--button-color), 0 4px 0 0 var(--button-light, var(--border-light)), 0 -4px 0 0 var(--button-color),
        2px 0 0 2px var(--button-dark, var(--border-color)), -2px 0 0 2px var(--button-dark, var(--border-color)), 0 2px 0 2px var(--button-dark, var(--border-color)), 0 -2px 0 2px var(--button-dark, var(--border-color)), 0 6px 0 2px var(--button-dark, var(--border-color)), 0 2px 0 4px var(--button-dark, var(--border-color)),
        4px -4px 0 0 var(--border-dark), -4px -4px 0 0 var(--border-dark), 0 -4px 0 2px var(--border-dark), 2px 2px 0 4px var(--border-dark), -2px 2px 0 4px var(--border-dark), -4px 8px 0 0 var(--border-dark), 4px 8px 0 0 var(--border-dark), 0 8px 0 2px var(--border-dark);
    }

    .button-selected {
        margin-top: 10px;
        margin-bottom: 6px;
        background: var(--button-selected);
        box-shadow: 2px 0 0 2px var(--button-selected), -2px 0 0 2px var(--button-selected), 0 2px 0 2px var(--button-selected), 0 -2px 0 2px var(--button-selected),
        0 0 0 4px var(--border-dark), 4px 0 0 2px var(--border-dark), -4px 0 0 2px var(--border-dark), 0 4px 0 2px var(--border-dark), 0 -4px 0 2px var(--border-dark);
    }

    .button {

    }

    img {
        width: 100%;
        height: 100%;
    }
</style>