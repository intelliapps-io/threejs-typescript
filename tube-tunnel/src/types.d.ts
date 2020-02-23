import * as THREE from 'three'

declare global {
  interface Window { 
    ZERO_VECTOR: THREE.Vector3
    MOUSE_VECTOR: THREE.Vector
    getNoize: (x: number, y: number) => number
  }
}