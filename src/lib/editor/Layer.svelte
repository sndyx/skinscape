<script>
    import { onMount } from "svelte";
    import Skin from "../common/Skin.svelte";

    export let layer;
    export let renderer;

    /*
    let canvas;
    let ctx;

    onMount(() => {
        ctx = canvas.getContext("2d");
        ctx.putImageData(new ImageData(layer.data, 64, 64), 0, 0)
    })

    $: if (ctx) ctx.putImageData(new ImageData(layer.data, 64, 64), 0, 0);
     */
</script>

<div class="layer">
    {#if layer}
        <Skin bind:src={layer.data} renderer={renderer}></Skin>
    {/if}
</div>

<style>
    .layer {
        width: 128px;
        height: 200px;
    }
</style>