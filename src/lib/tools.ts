import {rgba, tool} from "$lib/stores";
import type {EditorScene} from "$lib/util/scene";
import type {RgbaColor} from "colord";

export class Tool {

    hover(scene: EditorScene, x: number, y: number, color: RgbaColor) {}

    down(scene: EditorScene, x: number, y: number, color: RgbaColor) {}

    drag(scene: EditorScene, x: number, y: number, color: RgbaColor) {}

    up(scene: EditorScene, color: RgbaColor) {}

}

export class Pencil extends Tool {

    private visited: Set<string>;
    size: number;

    constructor() {
        super();
        this.visited = new Set();
        this.size = 1;
    }

    hover(scene: EditorScene, x: number, y: number, color: RgbaColor) {
        const layer = scene.tempLayer();
        layer.setPixel(x, y, color);
    }

    down(scene: EditorScene, x: number, y: number, color: RgbaColor) {
        if (this.visited.has([x, y].toString())) return;
        const layer = scene.activeLayer();
        layer.setPixel(x, y, color);
        this.visited.add([x, y].toString());
    }

    drag(scene: EditorScene, x: number, y: number, color: RgbaColor) {
        if (this.visited.has([x, y].toString())) return;
        const layer = scene.activeLayer();
        layer.setPixel(x, y, color);
        this.visited.add([x, y].toString());
    }

    up(scene: EditorScene, color: RgbaColor) {
        this.visited.clear();
    }

}

export class Eraser extends Tool {

    constructor() {
        super();
    }

    hover(scene: EditorScene, x: number, y: number, color: RgbaColor) {
        const layer = scene.tempLayer();
        layer.setPixel(x, y, { r: 0, g: 0, b: 0, a: 0.5 });
    }

    down(scene: EditorScene, x: number, y: number, color: RgbaColor) {
        const layer = scene.activeLayer();
        layer.setPixel(x, y, { r: 0, g: 0, b: 0, a: 0 }, false);
    }

    drag(scene: EditorScene, x: number, y: number, color: RgbaColor) {
        const layer = scene.activeLayer();
        layer.setPixel(x, y, { r: 0, g: 0, b: 0, a: 0 }, false);
    }

}

export class Eyedropper extends Tool {

    previous: Tool

    constructor() {
        super();
    }

    down(scene: EditorScene, x: number, y: number, _: RgbaColor) {
        let c = scene.activeLayer().getPixel(x, y);
        c.a /= 255;
        rgba.set(c);
        tool.set(this.previous); // Return to previously used tool
    }

}

export class Fill extends Tool {

    tolerance: number;

    constructor() {
        super();
        this.tolerance = 0;
    }

}

export class Marquee extends Tool {

    constructor() {
        super();
    }

}

export class Shape extends Tool {

    constructor() {
        super();
    }

}