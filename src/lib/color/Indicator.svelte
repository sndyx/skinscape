<script lang="ts">
    export let pos: { x: number; y: number };
</script>

<div
    class="picker-indicator"
    style={`left: calc(${pos.x}px - 2px); top: calc(${pos.y}px - 2px);`}
/>

<style>
    div {
        position: absolute;
        width: 4px;
        height: 4px;

        pointer-events: none;
        z-index: 1;

        box-shadow: 2px 0 #000, -2px 0 #000, 0 2px #000, 0 -2px #000,
                    2px 2px #00000060, -2px 2px #00000060, 2px -2px #00000060, -2px -2px #00000060;
        filter: invert(1);
        mix-blend-mode: difference;
    }
</style>