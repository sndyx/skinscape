<script>
    import * as THREE from "three";
    import Editor from "$lib/editor/Editor.svelte";
    import FileMenu from "$lib/FileMenu.svelte";
    import EditMenu from "$lib/EditMenu.svelte";
    import Menu from "$lib/Menu.svelte";
    import Toolbar from "$lib/editor/Toolbar.svelte";
    import { onMount } from "svelte";

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
        frames ++;
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

<div class="header">
    <div class="header-left">
        <FileMenu />
        <EditMenu />
        <Menu label="View"></Menu>
        <Menu label="Color"></Menu>
    </div>
    <div class="header-right">
        <a href="/donate" class="heart">
            <img alt="heart" src="/icons/heart.png" width="18" height="18" />
        </a>
        <div class="login">
            <img alt="login" src="/icons/login.png" width="60" height="18" />
        </div>
    </div>
</div>

<div class="workspace">
    <div class="editors" bind:this={element}></div>
    <div class="tool-bar">
        <Toolbar />
    </div>
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
        border-bottom: 2px solid var(--highlight-light);
    }

    .header-left {
        flex: 1;
        display: flex;
        justify-content: left;
    }

    .header-right {
        flex: 1;
        display: flex;
        justify-content: right;
    }

    .heart {
        padding: 2px;
    }

    .login {
        padding: 2px 10px;
    }

    .workspace {
        position: absolute;
        left: 0;
        right: 0;
        top: 26px;
        bottom: 24px;
        display: flex;
        background-color: var(--main-color);
    }

    .editors {
        position: absolute;
        left: 0;
        right: 50px;
        height: 100%;
        display: flex;
    }

    .tool-bar {
        position: absolute;
        right: 0;
        width: 44px;
        padding: 14px 4px;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .tool-bar svg {
        fill: red;
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
