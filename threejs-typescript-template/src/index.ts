import * as THREE from 'three'
import { initializeEnviorment } from './helpers/initializeEnviorment';
import { rand } from './helpers/helpers';
import { Logo } from './lib/Logo';

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

const logo = new Logo(600)

scene.add(logo.getLine())

//////////////////
// Drawing Loop //
//////////////////
const animate = () => {
  requestAnimationFrame(animate);

  // line.rotation.x += 0.01
  // line.rotation.y += 0.01
  logo.getLine()

  logo.update()

  renderer.render(scene, camera);
};

animate();