import {
    Scene as TScene,
    Group, WebGLRenderer,
    PerspectiveCamera,
    DataTexture,
    Vector3, Clock, Raycaster, Vector2, AmbientLight, DirectionalLight
} from "three";
// @ts-ignore
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import {create, type Model, Models} from "./model";
import type {Layer, MutableSkin, Skin, TempLayer} from "./skin";

const CAMERA_POSITION = new Vector3(0, 0, 30);
const CONTROLS_TARGET = new Vector3(0, 0, 0);
const MAX_FPS = 60;
const LERP_ALPHA = 0.87;

export class Scene {

    protected readonly renderer: WebGLRenderer;
    protected element: HTMLElement;
    readonly skin: Skin;

    readonly camera: PerspectiveCamera;
    readonly scene: TScene;
    readonly texture: DataTexture;
    objects: Group;
    controls: OrbitControls;

    constructor(
        renderer: WebGLRenderer,
        element: HTMLElement,
        skin: Skin
    ) {
        this.renderer = renderer;
        this.element = element;
        this.skin = skin;

        this.scene = new TScene();
        this.objects = new Group();

        this.camera = new PerspectiveCamera(70, 2, 1, 10000);
        this.camera.position.add(CAMERA_POSITION);
        this.camera.lookAt(0, 10, 30);
        this.camera.layers.enable(1);

        this.controls = new OrbitControls(this.camera, element);
        this.controls.target.set(CONTROLS_TARGET.x, CONTROLS_TARGET.y, CONTROLS_TARGET.z);
        this.controls.rotateSpeed = 2;
        this.controls.maxDistance = 200;
        this.controls.minDistance = 10;

        this.texture = new DataTexture(this.skin.data, 64, 64);
        this.texture.flipY = true;

        this.camera.add(new DirectionalLight(0xFFFFFF, 1.7));
        this.scene.add(new AmbientLight(0xFFFFFF, 1));
        this.scene.add(this.camera);
        this.scene.add(this.objects);

        this.setModel(Models.test);
    }

    render() {
        const rect = this.element.getBoundingClientRect();
        // Use window.innerHeight - rect.bottom because y is px from bottom
        this.renderer.setViewport(rect.x, window.innerHeight - rect.bottom, rect.width, rect.height);
        this.renderer.setScissor(rect.x, window.innerHeight - rect.bottom, rect.width, rect.height);
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();

        this.renderer.render(this.scene, this.camera);

        this.texture.needsUpdate = true;
    }

    protected setModel(model: Model) {
        this.objects.clear();
        this.objects.add(create(model, this.texture, false));
    }

}

export class EditorScene extends Scene {

    private readonly skinMut: MutableSkin;

    clock: Clock;
    raycaster: Raycaster;
    pointer: Vector2;

    private deltaTime: number;
    private elapsedTime: number;
    private smoothReset: boolean;

    overlay: boolean = false;
    gridlines: boolean = false;

    private currentLayer: number;

    constructor(
        renderer: WebGLRenderer,
        element: HTMLElement,
        skin: MutableSkin
    ) {
        super(renderer, element, skin);
        this.skinMut = skin;

        this.clock = new Clock();
        this.raycaster = new Raycaster();
        this.pointer = new Vector2();

        this.raycaster.layers.disable(2);
        this.raycaster.layers.disable(3);

        this.toggleGridlines(false);
        this.toggleOverlay(false);
    }

    override render() {
        // Lock animations at 60fps
        this.deltaTime = this.clock.getDelta();
        this.elapsedTime += this.deltaTime;
        if (this.elapsedTime > 1 / MAX_FPS) {
            if (this.smoothReset) this.doSmoothReset()
            this.controls.update(); // Update state
            this.elapsedTime %= 1 / MAX_FPS;
        }

        super.render();

        this.texture.needsUpdate = true;
    }

    protected override setModel(model: Model) {
        this.objects.clear();
        this.objects.add(create(model, this.texture, true));
    }

    resetCameraPosition() {
        this.smoothReset = true;
    }

    resetControls() {
        this.controls.minAzimuthAngle = -Infinity;
        this.controls.maxAzimuthAngle = Infinity;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI;
        this.controls.minDistance = 10;
        this.controls.maxDistance = 200;
        this.controls.enablePan = true;
        this.controls.enabled = true;
        this.smoothReset = false;
    }

    doSmoothReset() {
        let azimuthalAngle = this.controls.getAzimuthalAngle();
        let polarAngle = this.controls.getPolarAngle() - Math.PI / 2;
        let distance = this.controls.getDistance() - 30;
        let movement = this.controls.target.clone();

        // Round to 0
        if (Math.abs(azimuthalAngle) < 0.001) azimuthalAngle = 0
        if (Math.abs(polarAngle) < 0.001) polarAngle = 0
        if (Math.abs(distance) < 0.001 && Math.abs(distance) > -0.001) distance = 0
        if (movement.distanceTo(CONTROLS_TARGET) < 0.05) movement = CONTROLS_TARGET

        const lerpDelta = LERP_ALPHA ** (1 + this.deltaTime * 60)

        // Change values
        this.controls.minAzimuthAngle = lerpDelta * azimuthalAngle
        this.controls.maxAzimuthAngle = this.controls.minAzimuthAngle

        this.controls.minPolarAngle = Math.PI/2 + lerpDelta * polarAngle
        this.controls.maxPolarAngle = this.controls.minPolarAngle

        this.controls.minDistance = lerpDelta * distance + 30
        this.controls.maxDistance = this.controls.minDistance

        movement.lerp(CONTROLS_TARGET, 1.0 - lerpDelta)
        this.controls.target.set(movement.x, movement.y, movement.z)

        // End smooth reset if all values are 0
        if(azimuthalAngle === 0
            && polarAngle === 0
            && distance === 0
            && movement.equals(CONTROLS_TARGET)
        ) this.resetControls()
    }

    updatePointer(x: number, y: number) {
        this.pointer.x = x;
        this.pointer.y = y;
    }

    toggleOverlay(enabled: boolean) {
        let gridlines = this.gridlines; // save gridlines state
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

    toggleGridlines(enabled: boolean) {
        this.gridlines = enabled;
        let layer = 2;
        if (this.overlay) { layer = 3; }
        if (enabled) {
            this.camera.layers.enable(layer);
        } else {
            this.camera.layers.disable(layer);
        }
    }

    setTexture(data: Uint8ClampedArray) {
        this.skin.data.set(data);
        this.activeLayer().data = data;
        this.texture.needsUpdate = true;
    }

    activeLayer(): Layer {
        return this.skinMut.layers[this.currentLayer];
    }

    tempLayer(): TempLayer {
        return this.skinMut.tempLayer;
    }

}