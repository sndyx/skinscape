<script>
    import ValueBar from "./ValueBar.svelte";
    import { tool } from "$lib/stores.js";
</script>

<ValueBar bind:value={$tool.size} min={1} max={10} suffix="px" />