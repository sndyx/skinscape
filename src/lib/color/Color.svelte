<script>
    import { colord } from "colord";

    export let rgba;
    export let color;

    function click() {
        rgba = Object.assign({}, color)
    }
    
    // This seems like a bad way to do this...
    $: isSelected = rgba.r === color.r && rgba.g === color.g && rgba.b === color.b && rgba.a === color.a;
    $: type = isSelected ? "selected" : "";
</script>

<!-- Gahh!! I HATE blind people!!!! -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="{type}"
    on:click={click}
    style="--color: {colord(color).toHex()}"
>

</div>

<style>
    div {
        position: relative;
        width: 25px;
        height: 25px;
        margin: 2px 0 0 2px;
        background: repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 25px 25px;
        box-shadow: 0 0 0 2px var(--highlight-dark);
    }

    div:before {
        content: "";
        position: relative;
		inset: 0;
        background: var(--color);
    }

    .selected {
        z-index: 1;
        width: 21px;
        height: 21px;
        margin: 4px 2px 2px 4px;
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000;
    }
</style>