<script>
    import {onMount} from "svelte";
    import * as THREE from "three";
    import {createModel} from "../util/models.js";

    const CAMERA_POSITION = new THREE.Vector3(0, 0, 30);

    export let src;
    export let renderer;

    console.log(src);

    let element;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, 2, 1, 10000);
    camera.position.add(CAMERA_POSITION);
    camera.lookAt(0, 10, 30);
    camera.layers.enable(1);

    const objects = new THREE.Group();

    const texture = new THREE.DataTexture(src, 64, 64);
    texture.flipY = true;

    const model = createModel("alex", texture, false);
    model.forEach((obj) => { objects.add(obj); });
    scene.add(objects);
    scene.add(camera);

    function render() {
        const rect = element.getBoundingClientRect();
        renderer.setViewport(rect.x, window.innerHeight - rect.bottom, rect.width, rect.height);
        renderer.setScissor(rect.x, window.innerHeight - rect.bottom, rect.width, rect.height);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);

        texture.needsUpdate = true;

        requestAnimationFrame(render);
    }

     onMount(() => {
        requestAnimationFrame(render);
    })
</script>

<div bind:this={element}></div>

<style>
    div {
        width: 100%;
        height: 100%;
    }
</style>