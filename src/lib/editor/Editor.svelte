<script>
    import ColorPicker from "../color/ColorPicker.svelte";
    import Palette from "../color/Palette.svelte";
    import { rgba, tool, activeEditor } from '../stores.js';
    import { Scene } from "../scene.js";
    import { onMount,  } from "svelte";
    import UPNG from "upng-js";
    import { get } from "svelte/store";
    import Toolbar from "$lib/editor/Toolbar.svelte";

    export let renderer;

    export let isFirst;
    export let eid;

    let palette = new Set();

    let sceneElement;
    let scene;

    function init() {
        scene = new Scene(renderer, sceneElement);
        scene.setModel("alex");
        // setSkin("sourgummmybears");
    }

    onMount(init);

    async function setSkin(name) {
        let buffer = await (await fetch(`/api/skin/${name}`)).arrayBuffer();
        scene.setTexture(new Uint8Array(UPNG.toRGBA8(UPNG.decode(buffer))[0]));
    }

    export function render() {
        scene.render();
    }

    function mousedown(event) {
        activeEditor.set(eid);

        if (event.button === 0) {
            scene.raycaster.setFromCamera(scene.pointer, scene.camera);
            const intersects = scene.raycaster.intersectObjects(
                scene.scene.children,
                true,
            );
            if (intersects.length > 0) {
                mouseDown = true;
                scene.controls.enabled = false;
                const x = Math.ceil(intersects[0].uv.x * 64); // Why ceil? IDK LOL
                const y = Math.floor((1 - intersects[0].uv.y) * 64);
                let color = get(rgba);
                get(tool).down(scene, x, y, color);
            }
        }
    }

    let mouseDown = false;

    function mousemove(event) {
        let rect = sceneElement.getBoundingClientRect();
        scene.updatePointer(
            ((event.clientX - rect.left) / sceneElement.clientWidth) * 2 - 1,
            -((event.clientY - rect.top) / sceneElement.clientHeight) * 2 + 1,
        );
        scene.raycaster.setFromCamera(scene.pointer, scene.camera);
        const intersects = scene.raycaster.intersectObjects(
            scene.scene.children,
            true,
        );
        if (intersects.length > 0) {
            const x = Math.ceil(intersects[0].uv.x * 64);
            const y = Math.floor((1 - intersects[0].uv.y) * 64);
            let color = get(rgba);
            if (mouseDown) {
                get(tool).drag(scene, x, y, color);
            } else {
                get(tool).hover(scene, x, y, color);
            }
        }
    }

    function mouseup(event) {
        scene.controls.enabled = true;
        if (event.button === 0) {
            mouseDown = false;
            let color = get(rgba);
            get(tool).up(scene, color);
        }
    }

    function keydown(event) {
        if (get(activeEditor) === eid) {
            if (event.key === "g") {
                scene.toggleGridlines(!scene.gridlines);
            } else if (event.key === "o") {
                scene.toggleOverlay(!scene.overlay);
            }
        }
    }
</script>

<svelte:window on:keydown={keydown} />

<div class="editor-sidebar">
    <div class="palette-container">
        <Palette bind:rgba={$rgba} bind:palette />
    </div>
    {#if isFirst}
        <div class="picker-container">
            <ColorPicker bind:rgba={$rgba} />
        </div>
    {/if}
</div>
<div class="center">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="scene"
        bind:this={sceneElement}
        on:mousedown={mousedown}
        on:mousemove={mousemove}
        on:mouseup={mouseup}
    >
        <!---
        <div class="part-toggle">
            <PartToggle bind:bodyToggles />
        </div>
        -->
    </div>
</div>

<style>
    .editor-sidebar {
        display: flex;
        flex-direction: column;
        width: 34px;
        gap: 12px;
    }

    .editor-sidebar:has(.picker-container) {
        flex: 1;
        min-width: 68px;
        max-width: 120px;
    }

    .palette-container {
        flex: 1;
        display: flex;
        flex-direction: row;
        gap: 12px;
    }

    .picker-container {
        height: 25%;
        aspect-ratio: 1 / 2;
        bottom: 0;
    }

    .center {
        flex: 5;
    }

    .scene {
        position: relative;
        width: calc(100% - 12px);
        height: calc(100% - 12px);
        margin: 6px;
        background: var(--scene-color, var(--inlay-color));
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
</style>
