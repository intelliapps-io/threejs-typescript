import * as THREE from 'three'
import { initializeEnviorment } from './helpers/initializeEnviorment';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { jsonfont } from './helpers/jsonfont'


const { scene, camera, renderer } = initializeEnviorment()
camera.position.set(20, 300, 400)
const controls = new OrbitControls(camera, renderer.domElement)


scene.add(new THREE.AmbientLight(0x222222));
var light = new THREE.PointLight(0xffffff);
light.position.copy(camera.position);
scene.add(light);

//////// LINES

var textMesh1, textMesh2, textGeo, textGeo;
const materials = [
  new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
  new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
]

const group = new THREE.Group()

function createText() {
  const font = new THREE.Font(jsonfont),
    height = 20,
    size = 70,
    curveSegments = 4

  textGeo = new THREE.TextGeometry("INTELLIAPPS.IO", {
    font,
    size,
    height,
    curveSegments
  });

  textGeo.computeBoundingBox();
  textGeo.computeVertexNormals();

  var triangle = new THREE.Triangle();

  // "fix" side normals by removing z-component of normals for side faces
  // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

  var triangleAreaHeuristics = 0.1 * (height * size);

  for (var i = 0; i < textGeo.faces.length; i++) {

    var face = textGeo.faces[i];

    if (face.materialIndex == 1) {

      for (var j = 0; j < face.vertexNormals.length; j++) {

        face.vertexNormals[j].z = 0;
        face.vertexNormals[j].normalize();

      }

      var va = textGeo.vertices[face.a];
      var vb = textGeo.vertices[face.b];
      var vc = textGeo.vertices[face.c];

      var s = triangle.set(va, vb, vc).getArea();

      if (s > triangleAreaHeuristics) {

        for (var j = 0; j < face.vertexNormals.length; j++) {

          face.vertexNormals[j].copy(face.normal);

        }

      }

    }

  }

  var centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

  textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);

  textMesh1 = new THREE.Mesh(textGeo, materials);

  textMesh1.position.x = centerOffset;
  // textMesh1.position.y = hover;
  textMesh1.position.z = 0;

  textMesh1.rotation.x = 0;
  // textMesh1.rotation.y = Math.PI * 2;

  group.add(textMesh1);
}

createText()

scene.add( group );

//////////////////
// Drawing Loop //
//////////////////
const animate = () => {
  requestAnimationFrame(animate);

  // line.rotation.x += 0.01
  // line.rotation.y += 0.01


  renderer.render(scene, camera);
};

animate();