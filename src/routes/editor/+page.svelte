<script>
    import Editor from "$lib/Editor.svelte";
    import { onMount } from "svelte";
    import * as THREE from 'three';

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
                rgba: rgba
            }
        })
        editors.push(editor);
    }

    function updateSize() {
        if (canvas === null) return;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if (canvas.width !== width || canvas.height !== height) {
            renderer.setSize(width, height, false);
        }
    }

    function updateEditorSizes() {
        const sceneWidth = (element.clientWidth - 169 - (88 * (editors.length - 1)) - 12) / editors.length;
        for (let i = 0; i < editors.length; i++) {
            editors[i].setWidth(sceneWidth);
        }
    }

    function render() {
        updateSize();
        updateEditorSizes();

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
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, logarithmicDepthBuffer: true });
		renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        addEditor();
        addEditor();
        render();
    })
</script>

<canvas bind:this={canvas}></canvas>

<div class="header"
></div>

<div 
    class="editors"
    bind:this={element}
>

</div>
<div class="status-bar"
></div>

<style>
    canvas {
        pointer-events: none;
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 2;
        background: rgba(0.0, 0.0, 0.0, 0.0)
    }

    .header {
        position: absolute;
        top: 0;
        height: 20px;
        left: 0; right: 0;
        background-color: var(--menu-bar);
        border-bottom: 2px solid var(--highlight-dark);
        pointer-events: none;
    }

    .editors {
        position: absolute;
        left: 0; right: 0;
        top: 22px;
        bottom: 24px;
        display: flex;
        padding-right: 12px;
        background-color: var(--main-color);
    }

    .status-bar {
        position: absolute;
        bottom: 0;
        height: 20px;
        left: 0; right: 0;
        background-color: var(--status-line);
        box-shadow: 0 -2px 0 0 var(--highlight-light), 0 -4px 0 0 #000;
    }
</style>