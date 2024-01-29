<script>
    import ColorPicker from "./color/ColorPicker.svelte";
    import Palette from "./color/Palette.svelte";
    import EditorScene from "./EditorScene.svelte";

    export let renderer;

    export let rgba;
    export let palette = [];
    export let isFirst = false;

    let element;
    let center;
    let scene;

    export function render() {
        scene.render();
    }

    export function setWidth(width) {
        // console.log(width);
        center.setAttribute("style",`width:${width}px;`);
        // center.style.width = `${width}px;`;  This doesnt work!! haha :(
    }

    let paletteWidth = 0;
    $: if (element !== undefined) {
        if (isFirst) paletteWidth = 145;
        // else paletteWidth = 32 * Math.max(Math.min(Math.ceil(palette.length / Math.floor((element.clientHeight - 32) / 37)), 5), 2);
        else paletteWidth = 64;
    }
</script>

<div class="editor"
     bind:this={element}
>
    <div class="left-sidebar">
        <div class="palette" style="width: {paletteWidth}px;">
            <Palette bind:rgba={rgba} bind:palette={palette} />
        </div>
        {#if isFirst}
            <div class="picker">
                <ColorPicker bind:rgba />
            </div>
        {/if}
    </div>
    <div class="center" bind:this={center}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="scene">
            <EditorScene bind:this={scene} bind:renderer bind:rgba bind:palette />
        </div>
    </div>
</div>

<style>
    .editor {
        height: 100%;
        width: fit-content;
        display: flex;
    }

    .left-sidebar {
        display: flex;
        position: relative;
        flex-direction: column;
        height: calc(100% - 24px);
        padding: 12px;
    }

    .center {
        position: relative;
        height: calc(100% - 24px);
        padding: 12px 0 12px 0;
    }

    .palette {
        flex: 3;
    }

    .picker {
        width: 145px;
        min-height: 120px;
        margin-top: 12px;
        flex: 1;
    }

    .scene {
        position: relative;
        width: calc(100% - 12px);
        height: calc(100% - 12px);
        margin: 6px;
        background: var(--canvas-color);
        box-shadow: 2px 0 0 0 #000, -2px 0 0 0 #000, 0 2px 0 0 #000, 0 -2px 0 0 #000,
        0 0 0 2px var(--highlight-light), 4px 0 0 0 var(--highlight-light), -4px 0 0 0 var(--highlight-light), 0 4px 0 0 var(--highlight-light), 0 -4px 0 0 var(--highlight-dark),
        0 0 0 4px #000, -4px 0 0 2px #000, 4px 0 0 2px #000, 0 4px 0 2px #000, 0 -4px 0 2px #000;
    }

    @media screen and (max-height: 1024px) {

    }
</style>