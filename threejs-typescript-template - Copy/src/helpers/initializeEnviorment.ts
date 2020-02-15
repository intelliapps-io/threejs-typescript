import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { computeMouseVector } from './helpers';

export function initializeEnviorment() {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setClearColor(0x000000, 0.0)
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 5
  controls.maxDistance = 15

  window.ZERO_VECTOR = new THREE.Vector3()
  window.MOUSE_VECTOR = new THREE.Vector3(0, 0, 100)
  window.addEventListener('mousemove', event => {
    window.MOUSE_VECTOR = computeMouseVector([event.clientX, event.clientY], camera)
    // console.log(window.MOUSE_VECTOR)
  })
  window.addEventListener('touchmove', event => {
    const x = event.touches[event.touches.length - 1].clientX,
      y = event.touches[event.touches.length - 1].clientY
    window.MOUSE_VECTOR = computeMouseVector([x, y], camera)
  })

  return ({
    scene,
    camera,
    renderer
  })
}

