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
    }

    let button = -1;
    let pos = { x: 0, y: 0 };

    $: hex = colord({ h: hsva.h, s: 100, v: 100, a: 1 }).toHex();
    $: if (rect !== undefined) {
        pos.x = hsva.s / 100 * rect.width;
        pos.y = rect.height - hsva.v / 100 * rect.height;
    }

    function mousedown(event) {
        button = event.button;
        if (button !== -1) updateHue(event.clientX, event.clientY);
    }

    function mouseup(event) {
        if (button === event.button) document.getElementsByTagName("body")[0].style.cursor = "";
    }

    function mousemove(event) {
        if (button !== -1) updateHue(event.clientX, event.clientY);
    }

    function updateHue(clientX, clientY) {
        hsva.s = Math.min(100, Math.max(0, 
            (clientX - rect.left) / rect.width * 100
        ));
        hsva.v = Math.min(100, Math.max(0, 
            100 - (clientY - rect.top) / rect.height * 100
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
    class="picker"
    tabindex="0"
    bind:this={element}
    bind:contentRect={contentRect}
    on:mousedown={mousedown}
    on:contextmenu={contextmenu}
    use:noSelect
    style="--color: {hex};"
>
    <Indicator bind:pos={pos} />
</div>

<style>
    .picker {
        flex: 7;
		position: relative;
		background: linear-gradient(#ffffff00, #000000ff), 
                    linear-gradient(0.25turn, #ffffffff, #00000000), var(--color);
		outline: none;
		user-select: none;
	}

    .picker:before {
        content: "";
        position: absolute;
        left: 0; right: 0;
        top: 0; bottom: 0;
        background: repeating-linear-gradient(#ffffff05, #ffffff05 2px, #00000000 2px, #00000000 4px),
                    repeating-linear-gradient(to right, #ffffff05, #ffffff05 2px, #00000000 2px, #00000000 4px);
    }
</style>