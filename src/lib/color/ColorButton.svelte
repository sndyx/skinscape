<script>
    import { colord } from "colord";

    export let rgba;
    
    let element;
    let shouldUpdate = true;

    $: hex = colord(rgba).toHex();
    $: hsva = colord(rgba).toHsv();
    $: solid = colord(rgba).alpha(1).toHex();
    $: inverted = colord(rgba).invert().alpha(1).darken(1 - hsva.a).toHex();

    let text = hex;
    $: if (shouldUpdate) text = hex.substring(1);
    
    function input() {
        text = text.replace(/[^A-Fa-f0-9]/g, "");
        shouldUpdate = false;
        let color = colord(`#${text}`);
        if (color.isValid()) rgba = color.toRgb();
    }

    function keyup(event) {
        if (event.key === "Enter") {
            // Blur element on enter
            shouldUpdate = true;
            element.blur();
        }
    }

    function focusout() {
        shouldUpdate = true;
    }

    function click() {
        element.focus();
        element.select();
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="color-button"
    style="--color: {hex}; --inverted: {inverted}; --solid: {solid};"
    on:click={click}
>
    <span>#</span><input 
        bind:this={element}
        bind:value={text}
        on:input={input} 
        on:keyup={keyup} 
        on:focusout={focusout} 
        on:click={click}
        spellcheck=false
        maxLength="8"
    />
</div>

<style>
    .color-button {
        position: relative;
        display: flex;
        align-items: center;
        width: var(--width);
		height: var(--height);
        margin: 6px;
        white-space: nowrap;
        background: repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 50% / 20px 20px;
        box-shadow: 2px 0 0 0 #000, -2px 0 0 0 #000, 0 2px 0 0 #000, 0 -2px 0 0 #000,
                    0 0 0 2px var(--highlight-light), 4px 0 0 0 var(--highlight-light), -4px 0 0 0 var(--highlight-light), 0 4px 0 0 var(--highlight-light), 0 -4px 0 0 var(--highlight-dark),
                    0 0 0 4px #000, -4px 0 0 2px #000, 4px 0 0 2px #000, 0 4px 0 2px #000, 0 -4px 0 2px #000;
    }

    .color-button:before {
        content: "";
        position: absolute;
		inset: 0;
        background: var(--color);
    }

    input, span {
        z-index: 1;
        padding: 0;
        font-family: 'Silkscreen', serif;
        font-size: 14px;
        color: var(--inverted);
        height: 100%;
    }

    span {
        user-select: none;
        display: inline-flex;
        align-items: center;
    }

    input {
        -webkit-appearance: none;
        appearance: none;
        outline: none;
        border: none;
        background: none;
        width: 85px;
    }

    input::selection {
        background: var(--inverted);
        color: var(--solid);
    }
</style>
