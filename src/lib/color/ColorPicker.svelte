<script lang="ts">
    import ColorButton from "./ColorButton.svelte";
    import Slider from "./Slider.svelte";
    import Picker from "./Picker.svelte";
    import Alpha from "./Alpha.svelte";
    import { colord, type HsvaColor, type RgbaColor } from "colord";

	export let rgba: RgbaColor = { r: 255, g: 0, b: 0, a: 1 };
	export let hsva: HsvaColor = { h: 0, s: 100, v: 100, a: 1 };

	let _rgba: RgbaColor = { r: 255, g: 0, b: 0, a: 1 };
	let _hsva: HsvaColor = { h: 0, s: 100, v: 100, a: 1 };

    function sync() {
        if (hsva.h !== _hsva.h || hsva.s !== _hsva.s || hsva.v !== _hsva.v || hsva.a !== _hsva.a) {
            rgba = colord(hsva).toRgb();
            _hsva = Object.assign({}, hsva);
            _rgba = Object.assign({}, rgba);
        } else if (rgba.r !== _rgba.r || rgba.g !== _rgba.g || rgba.b !== _rgba.b || rgba.a !== _rgba.a) {
            hsva = colord(rgba).toHsv();
            _rgba = Object.assign({}, rgba);
            _hsva = Object.assign({}, hsva);
        }
    }

    $: if (rgba || hsva || true) { 
        sync();
    }
</script>

<div
    class="color-picker"
>
<!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="container"
    >
        <Picker bind:hsva />
        <Slider bind:hsva />
        <Alpha  bind:hsva />
    </div>

    <ColorButton bind:rgba />
</div>

<style>
    .color-picker {
        position: relative;
        display: flex;
        flex-direction: column;
        
        width: 100%;
        height: 100%;
    }
    .container {
        flex: 5;
        display: flex;
        flex-direction: column;
        position: relative;
        margin: 4px 4px 8px;

        box-shadow: 2px 0 0 0 #000, -2px 0 0 0 #000, 0 2px 0 0 #000, 0 -2px 0 0 #000, 0 0 0 2px var(--highlight-light), 4px 0 0 0 var(--highlight-light), -4px 0 0 0 var(--highlight-light), 0 4px 0 0 var(--highlight-light), 0 -4px 0 0 var(--highlight-dark);
    }
</style>