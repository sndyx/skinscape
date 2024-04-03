<script lang="ts">
    import {onMount} from "svelte";
    import {Scene} from "$lib/util/scene";
    import type {WebGLRenderer} from "three";
    import type {Skin} from "$lib/util/skin";

    export let renderer: WebGLRenderer;
    export let skin: Skin;

    let scene: Scene;

    let element: HTMLDivElement;

    function render() {
        scene.render();
        requestAnimationFrame(render);
    }

    onMount(() => {
        scene = new Scene(renderer, element, skin)
        requestAnimationFrame(render);
    });
</script>

<div bind:this={element}></div>

<style>
    div {
        width: 100%;
        height: 100%;
    }
</style>