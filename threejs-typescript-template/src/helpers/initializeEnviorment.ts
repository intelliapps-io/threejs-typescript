import * as THREE from 'three'
import { computeMouseVector } from './helpers';

export function initializeEnviorment() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0x000000, 0.0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  window.ZERO_VECTOR = new THREE.Vector3()
  window.MOUSE_VECTOR = new THREE.Vector3(0, 0, 100)
  window.addEventListener('mousemove', event => {
    window.MOUSE_VECTOR = computeMouseVector(event, camera)
    // console.log(window.MOUSE_VECTOR)
  })

  return ({
    scene,
    camera,
    renderer
  })
}

