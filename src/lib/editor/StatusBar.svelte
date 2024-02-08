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
        height: 22px;
        padding: 2px 20px;
        display: flex;
    }

    .status-bar-left {
        flex: 1;
        display: flex;
        justify-content: left;
        gap: 20px;
    }

    .status-bar-right {
        flex: 1;
        display: flex;
        justify-content: right;
        gap: 20px;
    }

    .status-item {
        font-family: LanaPixel, serif;
        font-size: 22px;
        margin: 0;
    }
</style>