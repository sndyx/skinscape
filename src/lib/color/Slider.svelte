<script>
    import Indicator from './Indicator.svelte';
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

    $: if (rect !== undefined) {
        pos.x = rect.width * hsva.h / 360;
    }

    function mousedown(event) {
        button = event.button;
        if (button !== -1) updateHue(event.clientX);
    }

    function mouseup(event) {
        if (button === event.button) button = -1;
    }

    function mousemove(event) {
        if (button !== -1) updateHue(event.clientX);
    }

    function updateHue(clientX) {
        hsva.h = Math.min(360, Math.max(0, 
            (clientX - rect.left) / rect.width * 360
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
>
    <Indicator bind:pos={pos} />
</div>

<style>
    .slider {
        position: relative;
        flex: 1;
        background: linear-gradient(to right, #ff0000, #ffff00 17.2%, #ffff00 18.2%, #00ff00 33.3%, #00ffff 49.5%, #00ffff 51.5%,
        #0000ff 67.7%, #ff00ff 83.3%, #ff0000);
    }

    .slider:before {
        content: "";
        position: absolute;
		inset: 0;
        background: repeating-linear-gradient(to right, #ffffff0f, #ffffff0f 2px, #00000000 2px, #00000000 4px);
    }
</style>