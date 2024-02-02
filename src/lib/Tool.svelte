<script>
    import { tool } from "./stores.js";

    export let icon;
    export let newTool;

    let element;

    function click() {
        tool.set(newTool);
    }
</script>

<div class="tool" on:click={click}>
    <img alt="" src={icon} width="32" height="32" />
</div>

<style>
    .tool {
        background-color: var(--main-color);
        width: 32px;
        height: 32px;
        padding: 2px;
        box-shadow: 2px 0 0 0 #000, -2px 0 0 0 #000, 0 2px 0 0 #000, 0 -2px 0 0 #000, 0 0 0 2px var(--highlight-light), 4px 0 0 0 var(--highlight-dark), -4px 0 0 0 var(--highlight-light), 0 4px 0 0 var(--highlight-light), 0 -4px 0 0 var(--highlight-light);
        margin: 4px 4px 6px;
    }

    img {
        image-rendering: pixelated;
    }
</style>