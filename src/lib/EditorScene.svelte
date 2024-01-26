<script>
    import { Scene } from './scene.js';
    import { onMount } from "svelte";
    import UPNG from "upng-js";

    export let renderer;
    export let rgba;
    export let palette;

    let element;
    let scene;
    let mouseDown = false;

    function init() {
        scene = new Scene(renderer, element);
        scene.setModel('alex');
        setSkin('pigleet');
    }

    async function setSkin(name) {
        let buffer = await (await fetch(`/api/skin/${name}`)).arrayBuffer();
        scene.setTexture(new Uint8Array(UPNG.toRGBA8(UPNG.decode(buffer))[0]));
    }

    export function render() {
        scene.render();
    }

    function mousedown(event) {
        // if ()
    }

    function mousemove(event) {

    }

    function mouseup(event) {
        if (event.button === 1) mouseDown = false;
    }

    onMount(init);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    bind:this={element}
    on:mousedown={mousedown}
    on:mousemove={mousemove}
    on:mouseup={mouseup}
/>

<style>
    div {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>

