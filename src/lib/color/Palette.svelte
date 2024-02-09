<script>
    import Color from "./Color.svelte";

    export let rgba;
    export let palette;
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
        overflow-y: scroll;
        box-shadow: 2px 0 0 0 var(--border-dark), -2px 0 0 0 var(--border-dark), 0 2px 0 0 var(--border-dark), 0 -2px 0 0 var(--border-dark), 0 0 0 2px var(--border-color), 4px 0 0 0 var(--border-color), -4px 0 0 0 var(--border-color), 0 4px 0 0 var(--border-light), 0 -4px 0 0 var(--border-color);
    }

    .palette {
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        scrollbar-width: none;  /* Firefox */
    }
    .palette::-webkit-scrollbar {
        display: none;  /* Safari and Chrome */
    }
</style>
