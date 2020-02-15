import * as THREE from 'three'
import { initializeEnviorment } from './helpers/initializeEnviorment';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { jsonfont } from './helpers/jsonfont'
import { Text } from './lib/Text'
import { LineText } from './lib/LineText';
import { LineShape } from './lib/LineShape';
import { getLogoVertices } from './helpers/logovertices';
import { EnhancedVector3 } from './lib/EnhancedVector3';

const { scene, camera, renderer } = initializeEnviorment()
const cameraVector = new EnhancedVector3(0, 0, 22000)
camera.position.copy(cameraVector)
// const controls = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0x222222));
var light = new THREE.PointLight(0xffffff);
light.position.copy(camera.position);
scene.add(light);

// TEXT
const lineText = new LineText('INTELLIAPPS.IO', {
  curveSegments: 4,
  hight: 1,
  size: 300,
  positioner: geo => {
    geo.translate(0, -400, 0)
  }
})
scene.add(lineText.getLine())

// LOGO
const lineShape = new LineShape(getLogoVertices({ scale: 3 }), {
  totalPoints: 100,
  maxRand: 100,
  positioner: geo => {
    geo.translate(0, 400, 0)
  }
})
scene.add(lineShape.getLine())

//////////////////
// Drawing Loop //
//////////////////
const mouseClone = window.MOUSE_VECTOR.clone()
const scaleX = 4, scaleY = 8
const animate = () => {
  requestAnimationFrame(animate)

  cameraVector.seekTarget('target', {
    maxForce: 20,
    maxSpeed: 2,
    ease: true
  })

  mouseClone.copy(window.MOUSE_VECTOR)
  mouseClone.setX(mouseClone.x * scaleX)
  mouseClone.setY(mouseClone.y  * scaleY)
  cameraVector.seekTarget(mouseClone.setZ(20000), {
    maxForce: 100,
    maxSpeed: 5,
    ease: true
  })

  camera.position.copy(cameraVector)
  camera.lookAt(scene.position)

  lineText.update()
  lineShape.update()

  renderer.render(scene, camera)
};

animate();