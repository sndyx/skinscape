<script>
import Button from "$lib/common/Button.svelte";
import {tool, tools} from "../stores.js";
import {get} from "svelte/store";
</script>

<div class="toolbar">
    <Button svg="/icons/pencil.svg" isActive={() => $tool === tools.pencil} on:mousedown={() => tool.set(tools.pencil)} />
    <Button svg="/icons/eyedropper.svg" isActive={() => $tool === tools.eyedropper} on:mousedown={() => {tools.eyedropper.previous = get(tool); tool.set(tools.eyedropper)}} />
    <Button svg="/icons/paint_bucket.svg" isActive={() => $tool === tools.fill} on:mousedown={() => tool.set(tools.fill)} />
</div>

<style>
    .toolbar {
        width: 40px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
</style>