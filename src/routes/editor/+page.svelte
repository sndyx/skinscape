<script>
    import * as THREE from "three";
    import Editor from "$lib/editor/Editor.svelte";
    import Toolbar from "$lib/editor/Toolbar.svelte";
    import { onMount } from "svelte";
    import Header from "../../lib/editor/Header.svelte";
    import StatusBar from "../../lib/editor/StatusBar.svelte";
    import ConfigBar from "$lib/editor/config/ConfigBar.svelte";
    import AuthOverlay from "../../lib/common/AuthOverlay.svelte";

    let canvas;
    let element;

    let renderer;
    let editors = [];
    let eid = 0;

    function addEditor() {
        let isFirst = editors.length === 0;
        const editor = new Editor({
            target: element,
            props: {
                eid: eid++,
                renderer: renderer,
                isFirst: isFirst,
            },
        });
        editors.push(editor);
    }

    function resize() {
        if (canvas === null) return;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if (canvas.width !== width || canvas.height !== height) {
            renderer.setSize(width, height, false);
        }
    }

    let frames = 0;
    let prevTime = performance.now();

    function render() {
        frames++;
        const time = performance.now();

        if (time >= prevTime + 1000) {
            console.log(Math.round((frames * 1000) / (time - prevTime)));
            frames = 0;
            prevTime = time;
        }

        renderer.setClearColor(0x000000, 0);
        renderer.setScissorTest(false);
        renderer.clear();

        renderer.setClearColor(0xff0000, 0);
        renderer.setScissorTest(true);

        for (let i = 0; i < editors.length; i++) {
            editors[i].render();
        }

        requestAnimationFrame(render);
    }

    onMount(() => {
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            logarithmicDepthBuffer: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        addEditor();
        addEditor();
        resize();
        render();
    });
</script>

<svelte:window on:resize={resize} />

<canvas bind:this={canvas}></canvas>
<AuthOverlay />

<div class="container">
    <Header />

    <div class="center-panel">
        <ConfigBar />
        <div class="workspace">
            <div class="editors" bind:this={element}></div>
            <Toolbar />
        </div>
    </div>

    <StatusBar />
</div>

<style>
    canvas {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        background: rgba(0, 0, 0, 0);
    }

    .container {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
    }

    .center-panel {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: var(--main-color);
    }

    .workspace {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        gap: 12px;
        padding: 0 12px 12px 12px;
    }

    .editors {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: row;
        gap: 12px;
    }
</style>
