import * as THREE from 'three'
import { initializeEnviorment } from './helpers/initializeEnviorment';
import { EnhancedVector3 } from './lib/EnhancedVector3';
import { rand } from './helpers/helpers';

const { scene, camera, renderer } = initializeEnviorment()
const cameraVector = new EnhancedVector3()
camera.position.z = 40;
cameraVector.copy(camera.position)

scene.add(new THREE.AmbientLight(0x222222));

var light = new THREE.PointLight(0xffffff);
light.position.copy(camera.position);
scene.add(light);
////////////////////////////////////////////////////////
function getNextPoint(lastPoint: THREE.Vector3 | [number, number, number], _pointDistance?: number) {
  let x = 0, y = 0, z = 0, pointDistance = _pointDistance ? _pointDistance : 1
  if (lastPoint instanceof THREE.Vector3) { x = lastPoint.x; y = lastPoint.y; z = lastPoint.z; }
  else { x = lastPoint[0]; y = lastPoint[1]; z = lastPoint[2] }
  const maxRand = 10
  return new THREE.Vector3(x + rand(maxRand), rand(maxRand), z + pointDistance)
}

const totalPoints = 3000
function createPoints() {
  const pointDistance = 100
  let points: THREE.Vector3[] = [new THREE.Vector3(0, 0, 0)]
  for (let i = 1; i < totalPoints; i++) {
    points.push(getNextPoint(points[i - 1], pointDistance))
  }
  return points
}
const points = createPoints()
const path = new THREE.CatmullRomCurve3(createPoints(), false, '')
const geometry = new THREE.TubeGeometry(path, 20, 2, 8, false);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh)

const lineGeo = new THREE.BufferGeometry()
lineGeo.setFromPoints(points)
const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: 0x00ccff }))
scene.add(line)

//////////////////
// Drawing Loop //
//////////////////

let seekPointNum = 1
const animate = () => {
  requestAnimationFrame(animate);
  camera.lookAt(points[seekPointNum + 1])
  cameraVector.seekTarget(points[seekPointNum], {
    maxForce: 1,
    maxSpeed: 10,
    // ease: true 
  })

  if (
    Math.round(cameraVector.x) === Math.round(points[seekPointNum].x) &&
    Math.round(cameraVector.y) === Math.round(points[seekPointNum].y) &&
    Math.round(cameraVector.z) === Math.round(points[seekPointNum].z)
  ) {
    if (seekPointNum < totalPoints - 1) {
      seekPointNum++
      
    } else {
      seekPointNum = 0
    }
  }

  // camera.position.copy(cameraVector)

  renderer.render(scene, camera);
};

animate();