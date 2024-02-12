import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createModel } from "./util/models.js";
import { rgbaBlendNormal } from "./util/blending.js";

const CAMERA_POSITION = new THREE.Vector3(0, 0, 30);
const CONTROLS_TARGET = new THREE.Vector3(0, 0, 0);
const MAX_FPS = 60;

export class Scene {

    constructor(renderer, element) {
        this.renderer = renderer;
        this.element = element;
        this.scene = new THREE.Scene();
        this.objects = new THREE.Group();

        this.camera = new THREE.PerspectiveCamera(70, 2, 1, 10000);
        this.camera.position.add(CAMERA_POSITION);
        this.camera.lookAt(0, 10, 30);
        this.camera.layers.enable(1);

        this.controls = new OrbitControls(this.camera, element);
        this.controls.target.set(CONTROLS_TARGET.x, CONTROLS_TARGET.y, CONTROLS_TARGET.z);
        this.controls.rotateSpeed = 2;
        this.controls.maxDistance = 200;
        this.controls.minDistance = 10;

        this.layers = [new Layer(this, 'default')];
        this.layer = 0;

        this.data = new Uint8Array(64 * 64 * 4);
        this.texture = new THREE.DataTexture(this.data, 64, 64);
        this.texture.flipY = true;

        this.camera.add(new THREE.DirectionalLight(0xFFFFFF, 1.7));
        this.scene.add(new THREE.AmbientLight(0xFFFFFF, 1));
        this.scene.add(this.camera);
        this.scene.add(this.objects);

        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.toggleGridlines(false);
        this.toggleOverlay(false);
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

        this.texture.needsUpdate = true; // Wah wah
    }

    updatePointer(x, y) {
        this.pointer.x = x;
        this.pointer.y = y;
    }

    toggleOverlay(enabled) {
        let gridlines = this.gridlines; // save gridlines toggle
        this.toggleGridlines(false); // disable currently active gridlines
        this.overlay = enabled;
        if (enabled) {
            this.camera.layers.enable(1);
            this.raycaster.layers.enable(1);
        } else {
            this.camera.layers.disable(1);
            this.raycaster.layers.disable(1);
        }
        this.toggleGridlines(gridlines); // push gridlines back to old state
    }

    toggleGridlines(enabled) {
        this.gridlines = enabled;
        let layer = 2;
        if (this.overlay) {layer = 3; }
        if (enabled) {
            this.camera.layers.enable(layer);
        } else {
            this.camera.layers.disable(layer);
        }
    }

    setModel(name) {
        this.objects.clear();
        const models = createModel(name, this.texture);
        models.forEach((it) => { this.objects.add(it) });
        this.model = name;
    }

    setTexture(data) {
        this.data.set(data);
        this.activeLayer().data.set(data);
        this.texture.needsUpdate = true;
    }

    activeLayer() {
        return this.layers[this.layer];
    }

    updatePixel(pos) {
        let color = this.layers[0].getPixelByPos(pos);
        for (let i = 1; i < this.layers.length; i++) {
            const l = this.layers[i];
            const c = l.getPixelByPos(pos);
            if (c.a === 255) { // Alpha already transformed to 0-255 by layer
                color = c;
            } else {
                color = rgbaBlendNormal(color, c);
            }
        }
        this.data.set([color.r, color.g, color.b, color.a], pos);
        this.texture.needsUpdate = true;
    }

}

export class Layer {

    constructor(scene, name) {
        this.data = new Uint8Array(64 * 64 * 4);
        this.scene = scene;
        this.name = name;
        this.isActive = true;
    }

    getPixel(x, y) {
        const pos = (x * 4) + ((y * 64 - 1) * 4);
        return this.getPixelByPos(pos);
    }

    getPixelByPos(pos) {
        return {
            r: this.data[pos], g: this.data[pos + 1],
            b: this.data[pos + 2], a: this.data[pos + 3],
        };
    }

    setPixel(x, y, color) {
        let c = { r: color.r, g: color.g, b: color.b, a: Math.floor(color.a * 255) };
        const pos = (x * 4) + ((y * 64 - 1) * 4);
        if (c.a !== 255) { // Mix colors if color is transparent
            const current = this.getPixelByPos(pos);
            c = rgbaBlendNormal(current, c);
        }
        this.data.set([c.r, c.g, c.b, c.a], pos);
        this.scene.updatePixel(pos);
    }

}
