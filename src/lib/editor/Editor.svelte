<script lang="ts">
    import ColorPicker from "$lib/color/ColorPicker.svelte";
    import Palette from "$lib/color/Palette.svelte";
    import { rgba, tool, activeEditor, tools } from '$lib/stores';
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    import * as UPNG from "upng-js";
    import type {WebGLRenderer} from "three";
    import type {MutableSkin} from "$lib/util/skin";
    import {EditorScene} from "$lib/util/scene";
    import {Models} from "$lib/util/model";
    import alex128 = Models.alex128;
    import steve64 = Models.steve64;
    import steve128 = Models.steve128;

    export let renderer: WebGLRenderer;
    export let skin: MutableSkin;
    export let isFirst: boolean;
    export let eid: number;

    let scene: EditorScene;
    let sceneElement: HTMLDivElement;

    let palette = new Set();

    let cursorElement: HTMLDivElement;

    const keybinds = new Map();

    function init() {
        scene = new EditorScene(renderer, sceneElement, skin)

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
                sceneElement.style.cursor = "url('/icons/eyedropper@2x.png') 0 23, auto";
            }
        });

        setSkin("Mr_Beast").then(() => {
            scene.setModel(steve128);
            console.log(scene);
        });
    }

    onMount(init);

    async function setSkin(name: string) {
        let buffer = await (await fetch(`/api/skin/${name}`)).arrayBuffer();
        const image = UPNG.decode(buffer);
        const size = [image.width, image.height];
        const data = UPNG.toRGBA8(image);
        console.log(size);
        const texture = {
            size: size,
            data: new Uint8ClampedArray(data[0]),
        };
        scene.setTexture(texture);
    }

    export function render() {
        scene.render();
    }

    function mousedown(event: MouseEvent) {
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
                    const x = Math.ceil(intersects[0].uv.x * skin.model.texture_size[0]); // Why ceil? IDK LOL
                    const y = Math.floor((1 - intersects[0].uv.y) * skin.model.texture_size[1]); // Why +2? IDK LOL
                    let color = get(rgba);
                    get(tool).down(scene, x, y, color);
                }
            }
        }
    }

    let mouseDown = false;

    function mousemove(event: MouseEvent) {
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
            const x = Math.ceil(intersects[0].uv.x * skin.model.texture_size[0]);
            const y = Math.floor((1 - intersects[0].uv.y) * skin.model.texture_size[1]);
            let color = get(rgba);
            if (mouseDown) {
                get(tool).drag(scene, x, y, color);
            } else {
                get(tool).hover(scene, x, y, color);
            }
        }
    }

    function mouseup(event: MouseEvent) {
        scene.controls.enabled = true;
        if (event.button === 0) {
            mouseDown = false;
            let color = get(rgba);
            get(tool).up(scene, color);
        }
    }

    function keydown(event: KeyboardEvent) {
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
    <div class="scene border"
         bind:this={sceneElement}
         on:mousedown={mousedown}
         on:mousemove={mousemove}
         on:mouseup={mouseup}
         on:mouseover={mouseover}
         on:mouseleave={mouseleave}
    />
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
