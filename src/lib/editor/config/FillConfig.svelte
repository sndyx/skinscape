<script>
    import ValueBar from "./ValueBar.svelte";
    import { tool } from "$lib/stores.js";
    import { _ } from "svelte-i18n";
    import Label from "$lib/editor/config/Label.svelte";
</script>

<Label label={$_("editor.tools.fill.tolerance")} />
<ValueBar bind:value={$tool.tolerance} min={0} max={100} />