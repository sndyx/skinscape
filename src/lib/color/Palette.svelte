<script lang="ts">
    import Color from "./Color.svelte";
    import type { RgbaColor } from "colord";

    export let rgba: RgbaColor;
    export let palette: RgbaColor[];
</script>

<div class="palette">
    {#each palette as color}
        <Color bind:rgba color={color} />
    {/each}
</div>

<style>
    .palette {
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        position: relative;
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        margin: 4px;
        background: var(--inlay-color);
        box-shadow: 2px 0 0 0 #000, -2px 0 0 0 #000, 0 2px 0 0 #000, 0 -2px 0 0 #000, 0 0 0 2px var(--highlight-dark), 4px 0 0 0 var(--highlight-dark), -4px 0 0 0 var(--highlight-dark), 0 4px 0 0 var(--highlight-light), 0 -4px 0 0 var(--highlight-dark);
    }
</style>
