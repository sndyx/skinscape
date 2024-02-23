<script>
    // This is fine I think
    export let svg = undefined;
    export let text = undefined;

    export let autoSelect = false;

    export let isActive = () => {return false};

    function mousedown() {
        if (autoSelect) isActive = () => {return true};
    }

    function mouseup() {
        if (autoSelect) isActive = () => {return false};
    }
</script>

<svelte:window on:mouseup={mouseup} />

<div class="button" class:active={isActive()} on:mousedown={mousedown} on:mousedown>
    {#if svg}<img src={svg}  alt="tool"/>{/if}
    {#if text}<p class="button-text">{text}</p>{/if}
</div>

<style>
    .button {
        margin: 6px 6px 10px;
        width: calc(100% - 12px);
        height: calc(100% - 20px);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button:hover {
        --border-dark: var(--button-hover);
    }

    .button {
        background: var(--button-color);
        box-shadow: 2px 0 0 0 var(--button-color), -2px 0 0 0 var(--button-color), 0 2px 0 0 var(--button-color), -2px -2px 0 0 var(--button-color), 2px -2px 0 0 var(--button-color), 0 0 0 2px var(--button-light, var(--border-light)), 4px 0 0 0 var(--button-color), -4px 0 0 0 var(--button-color), 0 4px 0 0 var(--button-light, var(--border-light)), 0 -4px 0 0 var(--button-color),
        2px 0 0 2px var(--button-dark, var(--border-color)), -2px 0 0 2px var(--button-dark, var(--border-color)), 0 2px 0 2px var(--button-dark, var(--border-color)), 0 -2px 0 2px var(--button-dark, var(--border-color)), 0 6px 0 2px var(--button-dark, var(--border-color)), 0 2px 0 4px var(--button-dark, var(--border-color)),
        4px -4px 0 0 var(--border-dark), -4px -4px 0 0 var(--border-dark), 0 -4px 0 2px var(--border-dark), 2px 2px 0 4px var(--border-dark), -2px 2px 0 4px var(--border-dark), -4px 8px 0 0 var(--border-dark), 4px 8px 0 0 var(--border-dark), 0 8px 0 2px var(--border-dark);
    }

    .button.active {
        margin-top: 10px;
        margin-bottom: 6px;
        background: var(--button-selected);
        box-shadow: 2px 0 0 2px var(--button-selected), -2px 0 0 2px var(--button-selected), 0 2px 0 2px var(--button-selected), 0 -2px 0 2px var(--button-selected),
        0 0 0 4px var(--border-dark), 4px 0 0 2px var(--border-dark), -4px 0 0 2px var(--border-dark), 0 4px 0 2px var(--border-dark), 0 -4px 0 2px var(--border-dark);
    }

    .button-text {
        color: var(--primary-text);
        font-family: LanaPixel, serif;
        font-size: 22px;
        margin: 0;
    }

    img {
        height: 100%;
        aspect-ratio: 1/1;
    }
</style>