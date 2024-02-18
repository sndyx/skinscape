<script>
    import Indicator from './Indicator.svelte';
    import { colord } from 'colord';
    import { noSelect } from '$lib/util/select';

    export let hsva;

    let element;

    let rect;
    let contentRect;
    $: if (contentRect !== undefined) {
        // This is stupid, this is dumb, this is awful. I hate JavaScript!!!!
        rect = element.getBoundingClientRect();
        pos.y = rect.height / 2;
    }

    let button = -1;
    let pos = { x: 0, y: 0 }

    $: hex = colord({ h: hsva.h, s: hsva.s, v: hsva.v, a: 1 }).toHex();
    $: if (rect !== undefined) {
        pos.x = rect.width * hsva.a;
    }

    function mousedown(event) {
        button = event.button;
        if (button !== -1) {
            document.getElementById("cursor-overlay").style.display = "block";
            updateAlpha(event.clientX);
        }
    }

    function mouseup(event) {
        if (button === event.button) {
            document.getElementById("cursor-overlay").style.display = "none";
            button = -1;
        }
    }

    function mousemove(event) {
        if (button !== -1) updateAlpha(event.clientX);
    }

    function updateAlpha(clientX) {
        hsva.a = Math.min(1, Math.max(0,
            (clientX - rect.left) / rect.width
        ));
    }

    function contextmenu(event) {
        event.preventDefault();
    }
</script>

<svelte:window
    on:mouseup={mouseup}
    on:mousemove={mousemove}
/>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="slider"
    tabindex="0"
    bind:this={element}
    bind:contentRect={contentRect}
    on:mousedown={mousedown}
    on:contextmenu={contextmenu}
    use:noSelect
    style="--color: {hex};"
>
    <Indicator bind:pos={pos}/>
</div>

<style>
    .slider {
        position: relative;
        flex: 1;
        background: repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px;
        cursor: url('/icons/eyedropper@2x.png') 0 24, auto;
    }

    .slider:before {
        content: "";
        position: absolute;
		inset: 0;
        background: linear-gradient(to right, #ffffff00, var(--color));
    }
</style>