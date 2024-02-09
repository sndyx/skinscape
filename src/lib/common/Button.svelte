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
        margin: 8px;
        box-shadow: 2px 0 0 0 #000, -2px 0 0 0 #000, 0 2px 0 0 #000, 0 -2px 0 0 #000,
    0 0 0 2px var(--highlight-light), 4px 0 0 0 var(--highlight-light), -4px 0 0 0 var(--highlight-light), 0 4px 0 0 var(--highlight-light), 0 -4px 0 0 var(--highlight-dark),
    0 0 0 4px #000, -4px 0 0 2px #000, 4px 0 0 2px #000, 0 4px 0 2px #000, 0 -4px 0 2px #000;
    }
</style>