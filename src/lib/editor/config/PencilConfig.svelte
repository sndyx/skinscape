<script>
    import ValueBar from "./ValueBar.svelte";
    import { tool } from "$lib/stores.js";
</script>

<ValueBar bind:value={$tool.size}/>