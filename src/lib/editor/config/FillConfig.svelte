<script>
    import { _ } from "svelte-i18n";
    import { tool } from "$lib/stores.js";
    import ValueBar from "./ValueBar.svelte";
    import Label from "$lib/editor/config/Label.svelte";
</script>

<Label label={$_("editor.tools.fill.tolerance")} />
<ValueBar bind:value={$tool.tolerance} min={1} max={100} suffix="%" />