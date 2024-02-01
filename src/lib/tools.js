export class Tool {
    hover(scene, x, y, rgba, face) {}

    down(scene, x, y, rgba, face) {}

    drag(scene, x, y, rgba, face) {}

    up(scene, rgba) {}

}

export class Pencil extends Tool {

    constructor() {
        super();
        this.visited = new Set()
    }

    hover(scene, x, y, rgba, face) {
        // let layer = scene.tempLayer();
        // layer.setPixel(x, y, primary);
    }

    down(scene, x, y, rgba, face) {
        if (this.visited.has([x, y].toString())) return;
        let layer = scene.activeLayer();
        layer.setPixel(x, y, rgba);
        this.visited.add([x, y].toString())
    }

    drag(scene, x, y, rgba, face) {
        if (this.visited.has([x, y].toString())) return;
        let layer = scene.activeLayer();
        layer.setPixel(x, y, rgba);
        this.visited.add([x, y].toString());
    }

    up(scene, rgba) {
        this.visited.clear();
    }

}

export class Paint extends Tool {

    constructor() {
        super();
        this.visited = new Set()
    }

    hover(scene, x, y, rgba, face) {
        // let layer = scene.tempLayer();
        // layer.setPixel(x, y, primary);
    }

    down(scene, x, y, rgba, face) {
        if (this.visited.has([x, y].toString())) return;
        let layer = scene.activeLayer();
        layer.setPixel(x, y, rgba);
        this.visited.add([x, y].toString())
    }

    drag(scene, x, y, rgba, face) {
        if (this.visited.has([x, y].toString())) return;
        let layer = scene.activeLayer();
        layer.setPixel(x, y, rgba);
        this.visited.add([x, y].toString());
    }

    up(scene, rgba) {
        this.visited.clear();
    }

}

export class Fill extends Tool {

    constructor() {
        super();
        this.tolerance = 0;
    }

    down(scene, x, y, rgba, face) {
        console.log(Object.getOwnPropertyNames(face));
        console.log(face);
        let layer = scene.activeLayer();
        let visited = new Set([[x, y].toString()]);
        let queue = [[x, y]];

        let base = layer.getPixel(x, y);

        // dfs
        while (queue.length > 0) {
            const pos = queue.pop();

            const col = layer.getPixel(x, y);
            if (col.r === base.r && col.g === base.g && col.b === base.b && col.a === base.a) {
                layer.setPixel(x, y, rgba);
                const neighbors = [];
                for (let i = -1; i < 2; i += 2) neighbors.push([pos[0] + i, pos[1]]);
                for (let i = -1; i < 2; i += 2) neighbors.push([pos[0], pos[1] + i]);

                console.log(neighbors);

                for (let i = 0; i < 4; i++) {
                    const n = neighbors[i];
                    if (visited.has(n.toString())) continue;
                    if (n[0] > 0 && n[0] < 65 && n[1] > 0 && n[1] < 65) {
                        visited.add(n.toString());
                        queue.push(n);
                    }
                }
            }
        }


        layer.setPixel(x, y, rgba);
    }

    check() {

    }

}