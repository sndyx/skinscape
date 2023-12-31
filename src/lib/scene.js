import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createModel } from "./util/models.js";

const CAMERA_POSITION = new THREE.Vector3(0, 0, 30);
const CONTROLS_TARGET = new THREE.Vector3(0, 0, 0);
const MAX_FPS = 60;

export class Scene {

    constructor(renderer, element) {
        this.renderer = renderer;
        this.element = element;
        this.scene = new THREE.Scene();
        this.objects = new THREE.Group();

        this.camera = new THREE.PerspectiveCamera(70, 2, 0.1, 1000);
        this.camera.position.add(CAMERA_POSITION);
        this.camera.layers.enable(1);

        this.controls = new OrbitControls(this.camera, element);
        this.controls.target.set(CONTROLS_TARGET.x, CONTROLS_TARGET.y, CONTROLS_TARGET.z);
        this.controls.rotateSpeed = 3;
        this.controls.maxDistance = 200;
        this.controls.minDistance = 10;

        this.data = new Uint8Array(64 * 64 * 4);
        this.texture = new THREE.DataTexture(this.data, 64, 64);
        this.texture.flipY = true;

        this.camera.add(new THREE.DirectionalLight(0xFFFFFF, 1.5));
        this.scene.add(new THREE.AmbientLight(0xFFFFFF, 0.3));
        this.scene.add(this.camera);
        this.scene.add(this.objects);

        this.clock = new THREE.Clock();


        this.renderer
    }

    render() {
        // Lock animations at 60fps
        this.deltaTime = this.clock.getDelta();
        this.elapsedTime += this.deltaTime;
        if (this.elapsedTime > 1 / MAX_FPS) {
            // if (smoothReset) doSmoothReset()
            this.controls.update();
            this.elapsedTime %= 1 / MAX_FPS;
        }

        const rect = this.element.getBoundingClientRect();
        this.renderer.setViewport(rect.left, rect.top, rect.width, rect.height);
        this.renderer.setScissor(rect.left, rect.top, rect.width, rect.height);
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();

        this.renderer.render(this.scene, this.camera);
    }

    model(name) {
        this.objects.clear();
        let models = createModel(name, this.texture);
        models.forEach((it) => { this.objects.add(it) });
    }

    skin(data) {
        
        //for (let i = 0; i < data.length; i += 4) {
            
        //}
        this.data.set(data);
        this.texture.needsUpdate = true;
    }

    getPixel(uv) {
        let x = Math.floor(uv.x * 64);
        let y = Math.floor((1 - uv.y) * 64);
        let pos = (x * 4) + (y * 64 * 4);
        return {
            r: this.data[pos], g: this.data[pos + 1],
            b: this.data[pos + 2], a: this.data[pos + 3]
        };
    }

    setPixel(uv, color) {
        let x = Math.floor(uv.x * 64);
        let y = Math.floor((1 - uv.y) * 64);
        let pos = (x * 4) + ((y * 64 - 1) * 4);
        this.data.set([color.r, color.g, color.b, Math.floor(color.a * 255)], pos);

        this.texture.needsUpdate = true;
    }

}