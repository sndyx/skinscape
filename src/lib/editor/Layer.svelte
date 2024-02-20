<script>
    import { onMount } from "svelte";

    export let layer;

    let canvas;
    let ctx;

    onMount(() => {
        ctx = canvas.getContext("2d");
        ctx.putImageData(new ImageData(layer.data, 64, 64), 0, 0)
    })

    $: if (ctx) ctx.putImageData(new ImageData(layer.data, 64, 64), 0, 0);
</script>

<div class="layer">
    <canvas bind:this={canvas} class="layer-skin-2d" width="64" height="64"></canvas>
</div>

<style>
    canvas {
        width: 128px;
        height: 128px;
    }
</style>