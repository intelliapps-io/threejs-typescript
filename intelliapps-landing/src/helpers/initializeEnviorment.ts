import * as THREE from 'three'
import { computeMouseVector } from './helpers';

export function initializeEnviorment() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 1, 100000)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setClearColor(0x000000, 0.0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  window.ZERO_VECTOR = new THREE.Vector3()
  window.MOUSE_VECTOR = new THREE.Vector3(0, 0, 100)
  window.mouseX = 0; window.mouseY = 0;
  window.addEventListener('mousemove', event => {
    const { clientX, clientY } = event
    window.mouseX = clientX; window.mouseY = clientY
    window.MOUSE_VECTOR = computeMouseVector(event, camera)
  })

  return ({
    scene,
    camera,
    renderer
  })
}

