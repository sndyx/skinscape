<script>
    import Editor from "$lib/Editor.svelte";
    import { onMount } from "svelte";
    import * as THREE from "three";
    import FileMenu from "$lib/FileMenu.svelte";
    import EditMenu from "$lib/EditMenu.svelte";
    import Menu from "$lib/Menu.svelte";

    let canvas;
    let element;

    let rgba = { r: 0, g: 0, b: 0, a: 1 };
    let renderer;
    let editors = [];

    function addEditor() {
        let isFirst = editors.length === 0;
        const editor = new Editor({
            target: element,
            props: {
                renderer: renderer,
                isFirst: isFirst,
                rgba: rgba,
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
        updateEditorSizes();
    }

    function updateEditorSizes() {
        const sceneWidth =
            (element.clientWidth -
                (Math.min(120, window.innerWidth / 10) + 24) -
                58 * (editors.length - 1)) / editors.length;
        for (let i = 0; i < editors.length; i++) {
            editors[i].setWidth(sceneWidth);
        }
    }

    function render() {
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

<div class="header">
    <FileMenu />
    <EditMenu />
    <Menu label="View"></Menu>
    <Menu label="Color"></Menu>
</div>

<div class="workspace">
    <div class="editors" bind:this={element}></div>
    <div class="tool-bar"></div>
</div>

<div class="status-bar">
    <div class="status-bar-left">
        <p class="status-item">
            Untitled Skin
        </p>
        <p class="status-item">
            Layer 1
        </p>
    </div>
    <div class="status-bar-right">
        <p class="status-item">
            64x64
        </p>
    </div>
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

    .header {
        display: flex;
        position: absolute;
        top: 0;
        height: 24px;
        left: 0;
        right: 0;
        background-color: var(--menu-bar);
        border-bottom: 2px solid var(--highlight-dark);
    }

    .workspace {
        position: absolute;
        left: 0;
        right: 0;
        top: 24px;
        bottom: 24px;
        display: flex;
        background-color: var(--main-color);
    }

    .editors {
        position: absolute;
        left: 0;
        right: 34px;
        height: 100%;
        display: flex;
    }

    .tool-bar {
        position: absolute;
        right: 0;
        width: 34px;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: red;
    }

    .status-bar {
        position: absolute;
        bottom: 0;
        height: 20px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        background-color: var(--status-line);
        box-shadow:
            0 -2px 0 0 var(--highlight-light),
            0 -4px 0 0 #000;
        overflow: hidden;
    }

    .status-bar-left {
        flex: 1;
        display: flex;
        justify-content: left;
    }

    .status-bar-right {
        flex: 1;
        display: flex;
        justify-content: right;
    }

    .status-item {
        font-family: "Muncro", serif;
        text-shadow: 2px 2px var(--inlay-color);
        font-size: 18px;
        color: var(--status-line-text);
        margin: 0 16px;
        height: 100%;
        padding: 0;
    }
</style>
