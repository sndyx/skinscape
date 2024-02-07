<script>
    import { _ } from "svelte-i18n";
</script>

<div class="status-bar">
    <div class="status-bar-left">
        <p class="status-item">
            {$_('editor.untitled-skin')}
        </p>
        <p class="status-item">
            {$_('editor.layer')} 1
        </p>
    </div>
    <div class="status-bar-right">
        <p class="status-item">
            64x64
        </p>
    </div>
</div>

<style>
    .status-bar {
        height: 36px;
        width: 100%;
    }
</style>