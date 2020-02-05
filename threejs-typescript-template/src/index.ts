import * as THREE from 'three'
import { initializeEnviorment } from './helpers/initializeEnviorment';
import { rand } from './helpers/helpers';

const { scene, camera, renderer } = initializeEnviorment()
camera.position.z = 10;

// scene.background = new THREE.Color(0xff0000)

// const light = new THREE.PointLight(0xfffff, 1, 20, 10)
// light.distance = 0
// light.position.z = 9
// scene.add(light)

// var sphereSize = 1;
// var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
// scene.add( pointLightHelper );

////////////////
// LOGO LINES //
////////////////
const getVertices = (options: {
  zAxis?: number,
  scale?: number,
}): THREE.Vector3[] => {
  let vertices: THREE.Vector3[] = []
  let { zAxis, scale } = options
  if (!zAxis) zAxis = 0
  if (!scale) scale = 1
  const numberArray: [number, number][] = [
    [165, 0],
    [213, 0],
    [72, 246],
    [116, 246],
    [261, 0],
    [423, 287],
    [283, 287],
    [236, 204],
    [261, 163],
    [308, 246],
    [352, 246],
    [261, 82],
    [140, 287],
    [0, 287],
    [165, 0],
  ]
  for (let i = 0; i < numberArray.length; i++) {
    const x = numberArray[i][0] * scale!,
      y = -1 * numberArray[i][1] * scale!,
      z = zAxis! + (-1 * scale! * i * 10)
    vertices.push(new THREE.Vector3(x, y, z))
  }
  vertices.forEach(vertice => {
    vertice.multiply(window.MOUSE_VECTOR.clone().setZ(vertice.z))
  })
  return vertices
}

const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

const geometry = new THREE.BufferGeometry().setFromPoints(getVertices({ scale: 1 / 50 }));

geometry.center()

const line = new THREE.Line(geometry, material);

scene.add(line)

//////////////////
// Drawing Loop //
//////////////////
const animate = () => {
  requestAnimationFrame(animate);

  // line.rotation.x += 0.01
  // line.rotation.y += 0.01

  geometry.setFromPoints(getVertices({ scale: 1 / 50}))
  geometry.center()

  renderer.render(scene, camera);
};

animate();