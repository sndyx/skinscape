import {rgba, tool, tools} from "./stores.js";
import steve64 from '../models/steve64.json';
import alex64 from '../models/alex64.json';

import PencilConfig from "$lib/editor/config/PencilConfig.svelte";
import FillConfig from "$lib/editor/config/FillConfig.svelte";

const DIRECTIONS = ['right', 'left', 'top', 'bottom', 'front', 'back'];
const DIRECTION_MAP = {
    'right': ['depth', 'height'],
    'left': ['depth', 'height'],
    'top': ['width', 'depth'],
    'bottom': ['width', 'depth'],
    'front': ['width', 'height'],
    'back': ['width', 'height']
};
const DESCRIPTORS = {
    'steve': steve64,
    'alex': alex64
};

export class Tool {

    hover(scene, x, y, color) {}

    down(scene, x, y, color) {}

    drag(scene, x, y, color) {}

    up(scene, color) {}

}

function getFaceBounds(scene, x, y) {
    const model = scene.model;
    const descriptor = DESCRIPTORS[model];

    const properties = Object.getOwnPropertyNames(descriptor.model);

    for (let i = 0; i < properties.length; i++) {
        const part = descriptor['model'][properties[i]];
        const mapping = descriptor['mappings'][properties[i]];

        for (let type = 0; type < 2; type++) {
            for (let j = 0; j < 6; j++) {
                const face = DIRECTIONS[j];
                const uv = (type === 1 ? mapping.base[face] : mapping.overlay[face]).slice();
                const ud = part[DIRECTION_MAP[face][0]];
                const vd = part[DIRECTION_MAP[face][1]];

                if (x > uv[0] && x <= uv[0] + ud && y >= uv[1] && y < uv[1] + vd) {
                    return {
                        top: uv[1], bottom: uv[1] + vd,
                        left: uv[0], right: uv[0] + ud
                    }
                }
            }
        }
    }

    console.log("Face bounds unknown!")
    return {
        top: 0, bottom: 0,
        left: 0, right: 0,
    }
}

export class Pencil extends Tool {

    constructor() {
        super();
        this.configComponent = PencilConfig;
        this.visited = new Set();
        this.size = 1;
    }

    hover(scene, x, y, color) {
        let layer = scene.tempLayer();
        layer.setPixel(x, y, color);
    }

    down(scene, x, y, color) {
        if (this.visited.has([x, y].toString())) return;
        let layer = scene.activeLayer();
        layer.setPixel(x, y, color);
        this.visited.add([x, y].toString());
    }

    drag(scene, x, y, color) {
        if (this.visited.has([x, y].toString())) return;
        let layer = scene.activeLayer();
        layer.setPixel(x, y, color);
        this.visited.add([x, y].toString());
    }

    up(scene, color) {
        this.visited.clear();
    }

}

export class Eyedropper extends Tool {

    constructor() {
        super();
        this.visited = new Set();
    }

    down(scene, x, y, color) {
        let c = scene.activeLayer().getPixel(x, y);
        c.a /= 255;
        rgba.set(c);
        tool.set(this.previous); // Return to previously used tool
    }

}

export class Fill extends Tool {

    constructor() {
        super();
        this.configComponent = FillConfig;
        this.tolerance = 0;
    }

    down(scene, x, y, color) {
        let layer = scene.activeLayer();
        let visited = new Set([[x, y].toString()]);
        let queue = [[x, y]];

        let base = layer.getPixel(x, y);
        let bounds = getFaceBounds(scene, x, y);
        console.log(bounds);

        // dfs
        while (queue.length > 0) {
            const pos = queue.pop();

            const col = layer.getPixel(pos[0], pos[1]);
            // console.log(pos, base, col);
            if (col.r === base.r && col.g === base.g && col.b === base.b && col.a === base.a) {
                layer.setPixel(pos[0], pos[1], color);
                const neighbors = [];
                for (let i = -1; i < 2; i += 2) neighbors.push([pos[0] + i, pos[1]]);
                for (let i = -1; i < 2; i += 2) neighbors.push([pos[0], pos[1] + i]);

                // console.log(neighbors);

                for (let i = 0; i < 4; i++) {
                    const n = neighbors[i];
                    if (visited.has(n.toString())) continue;
                    if (n[0] >= bounds.left + 1 && n[0] <= bounds.right && n[1] >= bounds.top && n[1] < bounds.bottom) {
                        visited.add(n.toString());
                        queue.push(n);
                    }
                }
            }
        }


        layer.setPixel(x, y, color);
    }

}