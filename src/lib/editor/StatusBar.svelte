<script>
    import { _ } from "svelte-i18n";
</script>

<div class="status-bar">
    <div class="status-bar-left">
        <p class="status-text text">
            {$_('editor.untitled-skin')}
        </p>
        <p class="status-text text">
            {$_('editor.layer')} 1
        </p>
    </div>
    <div class="status-bar-right">
        <p class="status-text text">
            {$_('editor.models.slim')}
        </p>
        <p class="status-text text">
            64x64
        </p>
    </div>
</div>

<style>
    .status-bar {
        height: 22px;
        padding: 2px 16px;
        display: flex;
        background-color: var(--secondary-color);
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

    .status-text {
        font-family: LanaPixel, serif;
        font-size: 18px;
        margin: 0;
        color: var(--primary-text);
    }
</style>