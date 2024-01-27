import * as THREE from 'three';
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

let layerIdx = 1;

export function createModel(type, texture) {
    let descriptor = DESCRIPTORS[type];
    const properties = Object.getOwnPropertyNames(descriptor.model)
    let group = [];
    for (let i = 0; i < properties.length; i++) {
        const part = descriptor['model'][properties[i]];
        const mapping = descriptor['mappings'][properties[i]];

        const geometry = new THREE.BoxGeometry(part['width'], part['height'], part['depth']);
        const overlayGeometry = new THREE.BoxGeometry(part['width'], part['height'], part['depth']);

        const material = new THREE.MeshLambertMaterial({ map: texture });
        const overlayMaterial = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
        material.transparent = true;
        overlayMaterial.transparent = true;

        // Properly map uvs (awful code)
        for (let type = 0; type < 2; type++) {
            let buffer = new THREE.Float32BufferAttribute(48, 2);
            for (let j = 0; j < 6; j++) {
                let face = DIRECTIONS[j];
                let uv = type === 1 ? mapping.base[face] : mapping.overlay[face];
                let ud = part[DIRECTION_MAP[face][0]] - 0.05;
                let vd = -part[DIRECTION_MAP[face][1]] + 0.05;
                uv[1] = 64 - uv[1];
                let offsets = [0.05, -0.05, ud, -0.05, 0.05, vd, ud, vd];
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
        const outline = new GridBox(part['width'], part['height'], part['depth'], 2);
        const overlayOutline = new GridBox(part['width'], part['height'], part['depth'], 3);

        overlayMesh.layers.set(1);
        outline.layers.set(2);


        let name = properties[i];

        mesh.name = name;
        outline.name = name + "_outline";
        overlayMesh.name = name + "_overlay";
        overlayOutline.name = name + "_outline_overlay";

        overlayMesh.scale.set(1.1, 1.1, 1.1);
        overlayOutline.scale.set(1.1, 1.1, 1.1);

        overlayMesh.renderOrder = 1;

        group.push(mesh);
        group.push(outline);
        group.push(overlayMesh);
        group.push(overlayOutline);

        mesh.position.set(part.x, part.y, part.z);
        outline.position.set(part.x, part.y, part.z);
        overlayMesh.position.set(part.x, part.y, part.z);
        overlayOutline.position.set(part.x, part.y, part.z);
    }
    return group;
}

class GridFace extends THREE.LineSegments {

    constructor(width, height, layer) {
        super();
        const gridGeometry = new THREE.BufferGeometry();
        const outlineGeometry = new THREE.BufferGeometry();
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
  
        gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        outlineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(outline, 3));

        const gridMaterial = new THREE.LineBasicMaterial({ color: 0x555555 });
        gridMaterial.transparent = true;
        const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);

        const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa, linewidth: 2 });
        outlineMaterial.transparent = true;
        const outlineLines = new THREE.LineSegments(outlineGeometry, outlineMaterial);

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