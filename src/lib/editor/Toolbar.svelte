<script>
import Button from "$lib/common/Button.svelte";
import {tool, tools} from "../stores.js";
import {get} from "svelte/store";
</script>

<div class="toolbar">
    <div class="button-container">
        <Button svg="/icons/pencil.svg" isActive={() => $tool === tools.pencil} on:mousedown={() => tool.set(tools.pencil)} />
    </div>
    <div class="button-container">
        <Button svg="/icons/eyedropper.svg" isActive={() => $tool === tools.eyedropper} on:mousedown={() => {tools.eyedropper.previous = get(tool); tool.set(tools.eyedropper)}} />
    </div>
    <div class="button-container">
        <Button svg="/icons/paint_bucket.svg" isActive={() => $tool === tools.fill} on:mousedown={() => tool.set(tools.fill)} />
    </div>
</div>

<style>
    .toolbar {
        width: 40px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .button-container {
        width: 100%;
        aspect-ratio: 1/1.2;
    }
</style>