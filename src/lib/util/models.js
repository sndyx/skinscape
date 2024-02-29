import * as THREE from 'three';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import steve64 from '../../models/steve64.json';
import alex64 from '../../models/alex64.json';

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
const Y_OFFSET = 1.5; // Moves model to center of camera (moving camera instead centers model weirdly)

export function createModel(type, texture, gridlines) {
    const descriptor = DESCRIPTORS[type];
    const properties = Object.getOwnPropertyNames(descriptor.model);
    const group = [];
    for (let i = 0; i < properties.length; i++) {
        const part = descriptor['model'][properties[i]];
        const mapping = descriptor['mappings'][properties[i]];

        const geometry = new THREE.BoxGeometry(part['width'], part['height'], part['depth']);
        const overlayGeometry = new THREE.BoxGeometry(part['width'], part['height'], part['depth']);

        const material = new THREE.MeshLambertMaterial({ map: texture });
        const overlayMaterial = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide, depthWrite: false });
        material.transparent = true;
        overlayMaterial.transparent = true;

        // Properly map uvs (awful code)
        for (let type = 0; type < 2; type++) {
            const buffer = new THREE.Float32BufferAttribute(48, 2);
            for (let j = 0; j < 6; j++) {
                const face = DIRECTIONS[j];
                const uv = (type === 1 ? mapping.base[face] : mapping.overlay[face]).slice();
                const ud = part[DIRECTION_MAP[face][0]] - 0.05;
                const vd = -part[DIRECTION_MAP[face][1]] + 0.05;
                uv[1] = 64 - uv[1];
                const offsets = [
                    0.05, -0.05,
                    ud, -0.05,
                    0.05, vd,
                    ud, vd
                ];
                if (face === 'bottom') offsets.unshift(...offsets.splice(4));
                for (let i = 0; i < 8; i++) buffer.array[j * 8 + i] = (uv[i % 2] + offsets[i]) / 64;
            }
            if (type === 1) {
                geometry.setAttribute('uv', buffer);
            } else {
                overlayGeometry.setAttribute('uv', buffer);
            }
        }

        const mesh = new THREE.Mesh(geometry, material);
        const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);

        const name = properties[i];

        mesh.name = name;
        overlayMesh.name = name + "_overlay";

        overlayMesh.scale.set(1.1, 1.05, 1.1);

        overlayMesh.renderOrder = 1;

        group.push(mesh);
        group.push(overlayMesh);

        mesh.position.set(part.x, part.y + Y_OFFSET, part.z);
        overlayMesh.position.set(part.x, part.y + Y_OFFSET, part.z);

        if (gridlines) {
            const outline = new GridBox(part['width'], part['height'], part['depth'], 2);
            const overlayOutline = new GridBox(part['width'], part['height'], part['depth'], 3);

            overlayMesh.layers.set(1);
            outline.layers.set(2);

            outline.name = name + "_outline";
            overlayOutline.name = name + "_outline_overlay";

            overlayOutline.scale.set(1.1, 1.05, 1.1);

            group.push(outline);
            group.push(overlayOutline);
            outline.position.set(part.x, part.y + Y_OFFSET, part.z);
            overlayOutline.position.set(part.x, part.y + Y_OFFSET, part.z);
        }
    }
    return group;
}

class GridFace extends THREE.Group {

    constructor(width, height, layer) {
        super();
        const vertices = [];
        const outline = [];
  
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        for (let x = -halfWidth; x <= halfWidth; x++) {
            if (x === -halfWidth || x === halfWidth) {
                outline.push(x, -halfHeight, 0);
                outline.push(x, halfHeight, 0);
            } else {
                vertices.push(x, -halfHeight, 0);
                vertices.push(x, halfHeight, 0);
            }
        }
  
        for (let y = -halfHeight; y <= halfHeight; y++) {
            if (y === -halfHeight || y === halfHeight) {
                outline.push(-halfWidth, y, 0);
                outline.push(halfWidth, y, 0);
            } else {
                vertices.push(-halfWidth, y, 0);
                vertices.push(halfWidth, y, 0);
            }
        }

        const gridLineGeometry = new LineSegmentsGeometry().setPositions(vertices);
        const outlineLineGeometry = new LineSegmentsGeometry().setPositions(outline);

        const gridMaterial = new LineMaterial({ color: 0x000000, linewidth: 0.0005 });
        gridMaterial.transparent = true;
        const gridLines = new LineSegments2(gridLineGeometry, gridMaterial);

        const outlineMaterial = new LineMaterial({ color: 0xffffff, linewidth: 0.002 });
        outlineMaterial.transparent = true;
        const outlineLines = new LineSegments2(outlineLineGeometry, outlineMaterial);

        gridLines.layers.set(layer);
        outlineLines.layers.set(layer);

        this.add(gridLines);
        this.add(outlineLines);
    
        const planeGeometry = new THREE.PlaneGeometry(width, height);
        const planeMaterial = new THREE.MeshBasicMaterial({ side: THREE.BackSide });
        planeMaterial.transparent = true;
        planeMaterial.opacity = 0;
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.z = -0.15;
        plane.renderOrder = -1;

        plane.layers.set(layer);

        this.add(plane);
    }

  }

export class GridBox extends THREE.Group {

    constructor(width, height, depth, layer) {
        super();

        let faces = [
            { position: new THREE.Vector3(0, 0, depth / 2),   rotation: new THREE.Euler(0, 0, 0),            width: width, height: height }, // Front
            { position: new THREE.Vector3(0, 0, -depth / 2),  rotation: new THREE.Euler(0, Math.PI, 0),      width: width, height: height }, // Back
            { position: new THREE.Vector3(0, height / 2, 0),  rotation: new THREE.Euler(-Math.PI / 2, 0, 0), width: width, height: depth },  // Top
            { position: new THREE.Vector3(0, -height / 2, 0), rotation: new THREE.Euler(Math.PI / 2, 0, 0),  width: width, height: depth },  // Bottom
            { position: new THREE.Vector3(width / 2, 0, 0),   rotation: new THREE.Euler(0, Math.PI / 2, 0), width: depth, height: height }, // Left
            { position: new THREE.Vector3(-width / 2, 0, 0),  rotation: new THREE.Euler(0, -Math.PI / 2, 0), width: depth, height: height }  // Right
        ]

        for (let face of faces) {
            let grid = new GridFace(face.width, face.height, layer);
            grid.position.copy(face.position);
            grid.rotation.copy(face.rotation);
            this.add(grid);
        }

        this.scale.set(1.01, 1.01, 1.01);
    }

}