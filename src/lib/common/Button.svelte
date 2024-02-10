<script>
    export let svg;
</script>

<div class="button">
    <img src={svg} />
</div>

<style>
    .button {
        aspect-ratio: 1;
        background: var(--main-color);
        margin: 6px;
        box-shadow: 2px 0 0 0 var(--border-dark), -2px 0 0 0 var(--border-dark), 0 2px 0 0 var(--border-dark), 0 -2px 0 0 var(--border-dark),
    0 0 0 2px var(--border-light), 4px 0 0 0 var(--border-light), -4px 0 0 0 var(--border-light), 0 4px 0 0 var(--border-light), 0 -4px 0 0 var(--border-color),
    0 0 0 4px var(--border-dark), -4px 0 0 2px var(--border-dark), 4px 0 0 2px var(--border-dark), 0 4px 0 2px var(--border-dark), 0 -4px 0 2px var(--border-dark);
    }

    img {
        width: 100%;
        height: 100%;
    }
</style>