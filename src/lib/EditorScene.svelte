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
        setSkin('sourgummmybears');
    }

    async function setSkin(name) {
        let buffer = await (await fetch(`/api/skin/${name}`)).arrayBuffer();
        scene.setTexture(new Uint8Array(UPNG.toRGBA8(UPNG.decode(buffer))[0]));
    }

    export function render() {
        scene.render();
    }

    function mousedown(event) {
        if (event.button === 0) {
            scene.raycaster.setFromCamera(scene.pointer, scene.camera)
            const intersects = scene.raycaster.intersectObjects(scene.scene.children, true);
            if (intersects.length > 0) {
                console.log(intersects[0].object.name);
            }
        }
    }

    function mousemove(event) {
        let rect = element.getBoundingClientRect();
        scene.updatePointer(
            ((event.clientX - rect.left) / element.clientWidth) * 2 - 1,
            -((event.clientY - rect.top) / element.clientHeight) * 2 + 1
        );
    }

    function mouseup(event) {
        if (event.button === 1) mouseDown = false;
    }

    function keydown(event) {
        if (event.key === 'g') {
            scene.toggleGridlines(!scene.gridlines);
        } else if (event.key === 'o') {
            scene.toggleOverlay(!scene.overlay);
        }
    }

    onMount(init);
</script>

<svelte:window on:keydown={keydown} />

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

