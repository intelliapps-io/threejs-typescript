import * as THREE from 'three'
import { initializeEnviorment } from './helpers/initializeEnviorment';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { jsonfont } from './helpers/jsonfont'
import { Text } from './lib/Text'
import { LineText } from './lib/LineText';

const { scene, camera, renderer } = initializeEnviorment()
camera.position.set(0, 0, 22000)
const controls = new OrbitControls(camera, renderer.domElement)


scene.add(new THREE.AmbientLight(0x222222));
var light = new THREE.PointLight(0xffffff);
light.position.copy(camera.position);
scene.add(light);

//////// LINES

const lineText = new LineText('INTELLIAPPS.IO', {
  curveSegments: 4,
  hight: 1,
  size: 300
})

scene.add(lineText.getMesh())

// text.getShapes().forEach(shape => {
//   scene.add(shape)
// })

//////////////////
// Drawing Loop //
//////////////////
const animate = () => {
  requestAnimationFrame(animate);

  // line.rotation.x += 0.01
  // line.rotation.y += 0.01
  lineText.update()

  renderer.render(scene, camera);
};

animate();