import {
    Box3,
    BoxGeometry,
    DataTexture,
    Float32BufferAttribute,
    Group,
    Material,
    Mesh,
    MeshLambertMaterial
} from "three";
import * as THREE from "three";
import {LineSegmentsGeometry} from "three/examples/jsm/lines/LineSegmentsGeometry";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {LineSegments2} from "three/examples/jsm/lines/LineSegments2";

const DIRECTIONS = ["up", "down", "east", "west", "north", "south"];

// Can't use tuples because of JSON incompatibility.

type Model = {
    texture_size: number[]; // [width, height]
    elements: ModelElement[];
};

type ModelElement = {
    name?: string;
    from: number[]; // [x, y, z]
    to: number[]; // [x, y, z]
    faces: {
        [direction in Direction]?: ModelFace;
    };
}

type ModelFace = {
    uv: number[]; // [x1, y1, x2, y2]
    texture: string;
}

type Direction = "up" | "down" | "north" | "south" | "east" | "west";

export function create(model: Model, texture: DataTexture, gridlines: boolean): Group {
    const group = new Group();

    for (const element of model.elements) {
        const whd = element.from.map(
            (val, idx) => Math.abs(element.to[idx] - val)
        );
        const xyz = element.from.map(
            (val, idx) => (val + element.to[idx]) / 2
        );

        const geometry = new BoxGeometry(whd[0], whd[1], whd[2]);
        const material = new MeshLambertMaterial(
            { map: texture, transparent: true }
        );

        const buffer = new Float32BufferAttribute(48, 2);
        for (let i = 0; i < 6; i++) { // Map uvs and textures for each face
            const face = element.faces[DIRECTIONS[i]];

            buffer.set([ //
                face.uv[0] / 64, (64 - face.uv[1]) / 64, // x1, y1
                face.uv[2] / 64, (64 - face.uv[1]) / 64, // x1, y2
                face.uv[0] / 64, (64 - face.uv[3]) / 64, // x2, y1
                face.uv[2] / 64, (64 - face.uv[3]) / 64, // x2, y2
            ], i * 8);
        }

        console.log(buffer);

        // geometry.setAttribute("uv", buffer);


        const mesh = new Mesh(geometry, material);
        mesh.position.set(xyz[0], xyz[1], xyz[2]);

        // Check if element is an overlay
        const overlay = /^overlay:/.test(element.name);
        if (overlay) {
            mesh.name = element.name.substring(8);
            mesh.layers.set(1);
            mesh.renderOrder = 1;
        }
        else {
            mesh.name = element.name;
        }

        group.add(mesh);

        if (gridlines) {
            // Create normal gridlines on layer 2, overlay gridlines on layer 3
            const grid = createGridlines(whd[0], whd[1], whd[2], overlay ? 3 : 2);
            grid.position.set(xyz[0], xyz[1], xyz[2]);
            grid.scale.set(1.01, 1.01, 1.01);
            group.add(grid);
        }
    }

    // This is good me thinks...
    const box = new Box3().setFromObject(group);
    const center = box.getCenter(group.position);
    group.position.set(-center.x, -center.y, -center.z);

    group.children.forEach((obj) => {
        console.log(obj);
    })

    return group;
}

function createGridlines(width: number, height: number, depth: number, layer: number): Group {
    const group = new Group();

    // Define faces
    const faces = [
        { position: new THREE.Vector3(0, 0, depth / 2),   rotation: new THREE.Euler(0, 0, 0),            width: width, height: height }, // Front
        { position: new THREE.Vector3(0, 0, -depth / 2),  rotation: new THREE.Euler(0, Math.PI, 0),         width: width, height: height }, // Back
        { position: new THREE.Vector3(0, height / 2, 0),  rotation: new THREE.Euler(-Math.PI / 2, 0, 0), width: width, height: depth },  // Top
        { position: new THREE.Vector3(0, -height / 2, 0), rotation: new THREE.Euler(Math.PI / 2, 0, 0),  width: width, height: depth },  // Bottom
        { position: new THREE.Vector3(width / 2, 0, 0),   rotation: new THREE.Euler(0, Math.PI / 2, 0),  width: depth, height: height }, // Left
        { position: new THREE.Vector3(-width / 2, 0, 0),  rotation: new THREE.Euler(0, -Math.PI / 2, 0), width: depth, height: height }  // Right
    ]

    for (const face of faces) {
        const gridFace = new Group();

        const gridVtxBuf = new Array<number>();
        const outlineVtxBuf = new Array<number>();

        // Make vertices
        const halfWidth = face.width / 2;
        const halfHeight = face.height / 2;
        for (let x = -halfWidth; x <= halfWidth; x++) {
            if (x === -halfWidth || x === halfWidth) {
                outlineVtxBuf.push(x, -halfHeight, 0);
                outlineVtxBuf.push(x, halfHeight, 0);
            } else {
                gridVtxBuf.push(x, -halfHeight, 0);
                gridVtxBuf.push(x, halfHeight, 0);
            }
        }
        for (let y = -halfHeight; y <= halfHeight; y++) {
            if (y === -halfHeight || y === halfHeight) {
                outlineVtxBuf.push(-halfWidth, y, 0);
                outlineVtxBuf.push(halfWidth, y, 0);
            } else {
                gridVtxBuf.push(-halfWidth, y, 0);
                gridVtxBuf.push(halfWidth, y, 0);
            }
        }

        const gridLineGeometry = new LineSegmentsGeometry().setPositions(gridVtxBuf);
        const outlineLineGeometry = new LineSegmentsGeometry().setPositions(outlineVtxBuf);

        const gridMaterial = new LineMaterial({ color: 0x000000, linewidth: 0.0005 });
        gridMaterial.transparent = true;
        const gridLines = new LineSegments2(gridLineGeometry, gridMaterial);

        const outlineMaterial = new LineMaterial({ color: 0xffffff, linewidth: 0.002 });
        outlineMaterial.transparent = true;
        const outlineLines = new LineSegments2(outlineLineGeometry, outlineMaterial);

        gridLines.layers.set(layer);
        outlineLines.layers.set(layer);

        const planeGeometry = new THREE.PlaneGeometry(face.width, face.height);
        const planeMaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide });
        planeMaterial.transparent = true;
        planeMaterial.opacity = 0;
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.z = -0.15;
        plane.renderOrder = -1;

        plane.layers.set(layer);

        gridFace.add(gridLines);
        gridFace.add(outlineLines);
        gridFace.add(plane);

        gridFace.position.copy(face.position);
        gridFace.rotation.copy(face.rotation);
        group.add(gridFace);
    }

    return group;
}