<script>
    // This is fine I think
    export let svg = undefined;
    export let text = undefined;
    export let fontSize = "22px";

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
    {#if svg}<div class="button-img" style="mask-image: url('{svg}')"></div>{/if}
    {#if text}<p class="button-text" style="font-size: {fontSize};">{text}</p>{/if}
</div>

<style>
    .button {
        margin: 2px;
        padding: 2px;
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .button:hover {
        background: var(--button-hover);
        --border-dark: var(--button-outline-hover);
    }

    .button {
        background: var(--button-color, var(--main-color));
        box-shadow: 0 2px 0 0 var(--border-dark), 0 -2px 0 0 var(--border-dark), 2px 0 0 0 var(--border-dark), -2px 0 0 0 var(--border-dark);
    }

    .button.active {
        background: var(--button-select);
        --border-dark: var(--button-outline-select);
    }

    .button.active:hover {
        --border-dark: var(--button-outline-hover);
    }

    .button-text {
        color: var(--primary-text);
        font-family: LanaPixel, serif;
        margin: 0;
    }

    .button-img {
        height: 100%;
        aspect-ratio: 1/1;
        mask-size: cover;
        mask-mode: luminance;
        background-color: var(--icon-color);
    }
</style>