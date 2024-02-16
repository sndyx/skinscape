<script>
    import Color from "./Color.svelte";

    export let rgba;
    export let palette;
</script>

<div class="palette border-small">
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
        width: 100%;
        background: var(--inlay-color);
        overflow-y: scroll;
    }

    .palette {
        -ms-overflow-style: none;  /* Internet Explorer 10+ */
        scrollbar-width: none;  /* Firefox */
    }
    .palette::-webkit-scrollbar {
        display: none;  /* Safari and Chrome */
    }
</style>
