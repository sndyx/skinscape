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
        height: 26px;
        padding: 0 16px;
        display: flex;
        background-color: var(--status-color, var(--secondary-color));
        margin-top: 4px;
        box-shadow: 0 -2px 0 var(--border-dark), 0 -4px 0 var(--border-light);
    }

    .status-bar-left {
        flex: 1;
        display: flex;
        justify-content: left;
        align-items: center;
        gap: 20px;
    }

    .status-bar-right {
        flex: 1;
        display: flex;
        justify-content: right;
        align-items: center;
        gap: 20px;
    }

    .status-text {
        padding: 4px 0;
        font-family: LanaPixel, serif;
        font-size: 18px;
        margin: 0;
        color: var(--primary-text);
    }
</style>