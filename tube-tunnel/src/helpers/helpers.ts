
import * as THREE from "three"

export const map = (value: number, x1: number, y1: number, x2: number, y2: number) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
export const rand = (max: number, min?: number) => Math.random() * (max - (min ? min : 0)) + (min ? min : 0)

// Mouse Vector (source: https://stackoverflow.com/questions/13055214/mouse-canvas-x-y-to-three-js-world-x-y-z)
var vec = new THREE.Vector3(); // create once and reuse
var pos = new THREE.Vector3(); // create once and reuse
export const computeMouseVector = (mouse: [number, number], camera: THREE.Camera) => {
  vec.set(
    (mouse[0] / window.innerWidth) * 2 - 1,
    - (mouse[1] / window.innerHeight) * 2 + 1,
    0.5);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  var distance = - camera.position.z / vec.z;
  pos.copy(camera.position).add(vec.multiplyScalar(distance));
  return pos
}