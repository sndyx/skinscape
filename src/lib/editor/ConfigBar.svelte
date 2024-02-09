<script>
    import { tool } from "../stores.js";
    import { get } from "svelte/store";
    import Button from "$lib/common/Button.svelte";
</script>

<div class="config-bar">
    <Button />
    <svelte:component this={get(tool).configComponent} />
</div>

<style>
    .config-bar {
        height: 28px;
        width: 100%;
        padding-left: 12px;
        display: flex;
        gap: 6px;
    }
</style>