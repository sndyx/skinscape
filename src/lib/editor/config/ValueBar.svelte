<script>
    import { noSelect } from "../../util/select.js";
    import {get} from "svelte/store";

    export let value;
    export let min;
    export let max;
    export let suffix;

    let element;
    let barElement;

    let rect;
    let contentRect;
    $: if (contentRect !== undefined) {
        rect = element.getBoundingClientRect();
    }

    let button = -1;
    let width = 0;

    function mousedown(event) {
        button = event.button;
        if (button !== -1) updateValue(event.clientX);
    }

    function mouseup(event) {
        if (button === event.button) button = -1;
        width = Math.round(width / rect.width * (max - min)) / (max - min) * rect.width;
    }

    function mousemove(event) {
        if (button !== -1) updateValue(event.clientX);
    }

    function updateValue(clientX) {
        value = Math.round(width / rect.width * (max - min)) + 1;
        width = Math.floor(Math.min(rect.width, Math.max(0, clientX - rect.left)) / 2) * 2;
    }

    function contextmenu(event) {
        event.preventDefault();
    }
</script>

<svelte:window
    on:mouseup={mouseup}
    on:mousemove={mousemove}
/>

<div
    class="value-bar border"
    bind:this={element}
    bind:contentRect={contentRect}
    on:mousedown={mousedown}
    on:contextmenu={contextmenu}
    use:noSelect
>
    <div
        class="value-bar-inner"
        bind:this={barElement}
        style="width: {width}px;"
    ></div>
    <div class="value-bar-overlay">
        {value}{suffix}
    </div>
</div>

<style>
    .value-bar {
        flex: 1;
        max-width: 200px;
        background-color: var(--inlay-color);
        width: 200px;
    }

    .value-bar-inner {
        position: relative;
        background-color: var(--secondary-color);
        height: 100%;
    }

    .value-bar-overlay {
        position: relative;
        inset: 0;
        z-index: 1;
    }
</style>