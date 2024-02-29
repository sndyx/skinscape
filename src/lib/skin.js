import {rgbaBlendNormal} from "./util/blending.js";
import {updateSkins} from "$lib/stores.js";

export class Skin {

    constructor() {
        this.data = new Uint8ClampedArray(64 * 64 * 4);
        this.layers = [new Layer(this, "default")];
        this.layer = 0;
        this.name = "Untitled Skin";

        this.temp = new TempLayer(this);
    }

    static fromJSON(json) {
        const skin = new Skin();
        skin.layers = json.layers.map((layer) => Layer.fromJSON(layer, skin));
        skin.name = json.name;
        skin.layer = json.layer;

        for (let pos = 0; pos < skin.data.length; pos += 4) {
            skin.updatePixel(pos);
        }

        return skin;
    }

    toJSON() {
        return {
            name: this.name,
            layers: this.layers,
            layer: this.layer,
        }
    }

    updatePixel(pos) {
        let color = { r: 0, g: 0, b: 0, a: 0 };
        for (let i = 0; i < this.layers.length + 1; i++) {
            let l;
            if (i === this.layers.length) {
                l = this.temp; // Use temp layer as last layer
            } else {
                l = this.layers[i];
            }
            if (!l.isActive) continue; // Skip hidden layers
            const c = l.getPixelByPos(pos);
            if (c.a === 255) { // Alpha already transformed to 0-255 by layer
                color = c;
            } else {
                color = rgbaBlendNormal(color, c);
            }
        }
        this.data.set([color.r, color.g, color.b, color.a], pos);
    }

}

export class Layer {

    constructor(skin, name) {
        this.data = new Uint8ClampedArray(64 * 64 * 4);
        this.skin = skin;
        this.name = name;
        this.isActive = true;
    }

    static fromJSON(json, skin) {
        const layer = new Layer(skin, json.name);
        layer.data.set(json.data);
        layer.isActive = json.isActive;
        return layer;
    }

    toJSON() {
        return {
            data: Array.from(this.data),
            name: this.name,
            isActive: this.isActive,
        }
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

    setPixel(x, y, color, blend = true, update = true) {
        let c = { r: color.r, g: color.g, b: color.b, a: Math.floor(color.a * 255) };
        const pos = (x * 4) + ((y * 64 - 1) * 4);
        if (blend) {
            if (c.a !== 255) { // Mix colors if color is transparent
                const current = this.getPixelByPos(pos);
                c = rgbaBlendNormal(current, c);
            }
        }
        this.data.set([c.r, c.g, c.b, c.a], pos);
        this.skin.updatePixel(pos);
        if (update) updateSkins();
    }

}

// Layer impl optimizing fast removal of all pixels
export class TempLayer extends Layer {

    constructor(skin) {
        super(skin, 'temp');
        this.set = new Set();
    }

    setPixel(x, y, color, blend = true, update = false) {
        this.set.add([x, y])
        super.setPixel(x, y, color, blend, update);
    }

    clear() {
        this.set.forEach((pos) => {
            super.setPixel(pos[0], pos[1], {r: 0, g: 0, b: 0, a: 0}, false, false);
        });
        this.set.clear();
    }

}