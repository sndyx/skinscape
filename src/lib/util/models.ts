import * as THREE from 'three';
import steve64 from '../../models/steve64.json';
import alex64 from '../../models/alex64.json';

const DIRECTIONS: any = ['right', 'left', 'top', 'bottom', 'front', 'back'];
const DIRECTION_MAP: any = {
    'right': ['depth', 'height'],
    'left': ['depth', 'height'],
    'top': ['width', 'depth'],
    'bottom': ['width', 'depth'],
    'front': ['width', 'height'],
    'back': ['width', 'height']
};
const DESCRIPTORS: any = {
    'steve': steve64,
    'alex': alex64
}

export function createModel(type: string, texture: THREE.DataTexture): THREE.Mesh[] {
    let descriptor = DESCRIPTORS[type];
    const properties = Object.getOwnPropertyNames(descriptor['model'])
    let meshes = new Array<THREE.Mesh>()
    for (let i = 0; i < properties.length; i++) {
        const part = descriptor['model'][properties[i]];
        const mapping = descriptor['mappings'][properties[i]];

        const geometry = new THREE.BoxGeometry(part['width'], part['height'], part['depth'])
        const overlayGeometry = new THREE.BoxGeometry(part['width'], part['height'], part['depth'])

        const material = new THREE.MeshLambertMaterial({ map: texture })
        const overlayMaterial = new THREE.MeshLambertMaterial({ map: texture })
        overlayMaterial.transparent = true

        // Properly map uvs (awful code)
        for (let type = 0; type < 2; type++) {
            let uvs = new Float32Array(48)
            for (let j = 0; j < 6; j++) {
                let face = DIRECTIONS[j]
                let uv
                if (type === 1) { uv = mapping['base'][face] }
                else { uv = mapping['overlay'][face] }
                let ud = part[DIRECTION_MAP[face][0]]
                let vd = -part[DIRECTION_MAP[face][1]]
                uv[1] = 64 - uv[1]
                let offsets = [0, 0, 0, 0, 0, 0, 0, 0]
                switch (face) {
                    case 'front':
                    case 'top':
                    case 'back':
                        offsets[2] = ud
                        offsets[5] = vd
                        offsets[6] = ud
                        offsets[7] = vd
                        break
                    case 'right':
                    case 'left':
                        offsets[4] = ud
                        offsets[5] = vd
                        offsets[0] = ud
                        offsets[7] = vd
                        break
                    case 'bottom':
                        offsets[6] = ud
                        offsets[1] = vd
                        offsets[2] = ud
                        offsets[3] = vd
                        break
                }
                uvs[j * 8] = (uv[0] + offsets[0]) / 64
                uvs[j * 8 + 1] = (uv[1] + offsets[1]) / 64
                uvs[j * 8 + 2] = (uv[0] + offsets[2]) / 64
                uvs[j * 8 + 3] = (uv[1] + offsets[3]) / 64
                uvs[j * 8 + 4] = (uv[0] + offsets[4]) / 64
                uvs[j * 8 + 5] = (uv[1] + offsets[5]) / 64
                uvs[j * 8 + 6] = (uv[0] + offsets[6]) / 64
                uvs[j * 8 + 7] = (uv[1] + offsets[7]) / 64
            }
            if (type === 1) {
                geometry.attributes.uv.array.set(uvs)
            } else {
                overlayGeometry.attributes.uv.array.set(uvs)
            }
        }

        const mesh = new THREE.Mesh(geometry, material)
        const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial)

        mesh.name = properties[i]
        overlayMesh.name = properties[i] + "_overlay"

        overlayMesh.scale.set(1.1, 1.1, 1.1)
        // overlayMesh.rotateX(0.01)

        meshes.push(mesh)
        meshes.push(overlayMesh)

        mesh.position.set(part.x, part.y, part.z)
        overlayMesh.position.set(part.x, part.y, part.z)
    }
    return meshes;
}