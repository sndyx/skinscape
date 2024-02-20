<script>
    import ColorPicker from "../color/ColorPicker.svelte";
    import Palette from "../color/Palette.svelte";
    import {rgba, tool, activeEditor, tools} from '../stores.js';
    import { Scene } from "../scene.js";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import UPNG from "upng-js";
    import Layer from "./Layer.svelte";

    export let renderer;

    export let isFirst;
    export let eid;

    let palette = new Set();

    let sceneElement;
    let scene;

    let cursorElement;

    const keybinds = new Map();

    function init() {
        scene = new Scene(renderer, sceneElement);
        scene.setModel("alex");
        setSkin("sourgummmybears");

        keybinds.set('o', () => {
            scene.toggleOverlay(!scene.overlay);
        });
        keybinds.set('g', () => {
            scene.toggleGridlines(!scene.gridlines);
        });
        keybinds.set('i', () => {
            tools.eyedropper.previous = get(tool);
            tool.set(tools.eyedropper);
        });
        keybinds.set('b', () => {
            tool.set(tools.pencil);
        });

        tool.subscribe((t) => {
            if (t === tools.pencil) {
                sceneElement.style.cursor = "none";
            } else {
                sceneElement.style.cursor = "url('/icons/eyedropper@2x.png') 0 24, auto";
            }
        })
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
            if (event.detail === 2) {
                scene.resetCameraPosition();
            }
            else {
                scene.raycaster.setFromCamera(scene.pointer, scene.camera);
                const intersects = scene.raycaster.intersectObjects(
                    scene.scene.children,
                    true,
                );
                if (intersects.length > 0) {
                    mouseDown = true;
                    scene.controls.enabled = false;
                    const x = Math.ceil(intersects[0].uv.x * 64); // Why ceil? IDK LOL
                    const y = Math.floor((1 - intersects[0].uv.y) * 64); // Why +2? IDK LOL
                    let color = get(rgba);
                    get(tool).down(scene, x, y, color);
                }
            }
        }
    }

    let mouseDown = false;

    function mousemove(event) {
        scene.tempLayer().clear();

        cursorElement.style.left = event.clientX - 12 + 'px';
        cursorElement.style.top = event.clientY - 12 + 'px';

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
            keybinds.forEach((f, key) => {
                if (key === event.key) {
                    f();
                }
            })
        }
    }

    let isMouseOver = false;
    function mouseover() {
        isMouseOver = true;
    }

    function mouseleave() {
        isMouseOver = false;
    }
</script>

<svelte:window on:keydown={keydown} />

<div bind:this={cursorElement} class="cursor" class:active={$tool === tools.pencil && isMouseOver}></div>

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
        class="scene border"
        bind:this={sceneElement}
        on:mousedown={mousedown}
        on:mousemove={mousemove}
        on:mouseup={mouseup}
        on:mouseover={mouseover}
        on:mouseleave={mouseleave}
    >
        <!---
        <div class="part-toggle">
            <PartToggle bind:bodyToggles />
        </div>
        -->

        <div class="layers">
            {#if scene}
                {#each scene.layers as layer}
                    <Layer layer={layer}></Layer>
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    .cursor {
        position: absolute;
        background-image: url('/icons/crosshair@2x.png');
        display: none;
        width: 24px;
        height: 24px;
        z-index: 999;
        pointer-events: none;
        mix-blend-mode: difference;
    }

    .active {
        display: block;
    }

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
        display: flex;
    }

    .scene {
        position: relative;
        flex: 1;
        background: var(--scene-color, var(--inlay-color));
    }
</style>
