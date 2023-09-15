<script>
    import { Scene } from './scene.js';
    import { onMount } from "svelte";
    import UPNG from "upng-js";

    export let renderer;
    export let rgba;
    export let palette;

    let element;
    let scene;

    function init() {
        scene = new Scene(renderer, element);
        scene.model('alex');
        setSkin('Incompleteusern');
    }

    async function setSkin(name) {
        let buffer = await (await fetch(`/api/skin/${name}`)).arrayBuffer();
        scene.skin(new Uint8Array(UPNG.toRGBA8(UPNG.decode(buffer))[0]));
    }

    export function render() {
        scene.render();
    }

    function mousedown() {

    }

    function mousemove() {

    }

    function mouseup() {

    }

    onMount(init);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
        bind:this={element}
        on:mousedown={mousedown}
        on:mousemove={mousemove}
        on:mouseup={mouseup}
></div>

<style>
    div {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>