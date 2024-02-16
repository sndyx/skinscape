<script>
    import ColorButton from "./ColorButton.svelte";
    import Slider from "./Slider.svelte";
    import Picker from "./Picker.svelte";
    import Alpha from "./Alpha.svelte";
    import { colord } from "colord";

	export let rgba = { r: 255, g: 0, b: 0, a: 1 };
	export let hsva = { h: 0, s: 100, v: 100, a: 1 };

	let _rgba = { r: 255, g: 0, b: 0, a: 1 };
	let _hsva = { h: 0, s: 100, v: 100, a: 1 };

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
        class="container border-small"
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
        gap: 4px;
        
        width: 100%;
        height: 100%;
    }
    .container {
        flex: 5;
        display: flex;
        flex-direction: column;
        position: relative;
    }
</style>