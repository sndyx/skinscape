<script>
    import ValueBar from "./ValueBar.svelte";
    import { tool } from "$lib/stores.js";
</script>

<span class="text">Tolerance:</span>
<ValueBar bind:value={$tool.tolerance} min={0} max={100} />