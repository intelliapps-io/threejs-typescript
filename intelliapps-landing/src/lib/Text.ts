import * as THREE from 'three'
import { jsonfont } from '../helpers/jsonfont'


export interface ITextOptions {
  hight: number
  size: number
  curveSegments: number
}

export class Text {
  text: string = ''
  options: ITextOptions
  textGeometry = new THREE.TextGeometry(this.text, { font: new THREE.Font(jsonfont) })
  shapeGeometry = new THREE.BufferGeometry()
  textMesh = new THREE.Mesh()
  group = new THREE.Group()
  shapes: THREE.Mesh[] = []

  constructor(text: string, options: ITextOptions) {
    this.options = options
    this.setText(text)
  }

  public setText(text: string) {
    this.text = text
    this.shapes = []
    this.textGeometry = new THREE.TextGeometry(this.text, { ...this.options, font: new THREE.Font(jsonfont) })
    this.textGeometry.computeBoundingBox()
    this.textGeometry.computeVertexNormals()

    const triangle = new THREE.Triangle(),
      triangleArea = 0.1 * this.options.hight * this.options.size


    this.textGeometry.faces.forEach(face => {
      var va = this.textGeometry.vertices[face.a];
      var vb = this.textGeometry.vertices[face.b];
      var vc = this.textGeometry.vertices[face.c];

      if (face.materialIndex == 1) {
        for (var j = 0; j < face.vertexNormals.length; j++) {
          face.vertexNormals[j].z = 0;
          face.vertexNormals[j].normalize();
        }

        var s = triangle.set(va, vb, vc).getArea();

        if (s > triangleArea) {
          for (var j = 0; j < face.vertexNormals.length; j++) {
            face.vertexNormals[j].copy(face.normal);
          }
        }
      }

      // CREATE TRIANGLES
      const triGeo = new THREE.BufferGeometry()
      const triMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      let vertices = new Float32Array([
        va.x, va.y, va.z,
        vb.x, vb.y, vb.z,
        vc.x, vc.y, vc.z,
      ])
      triGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      this.shapes.push(new THREE.Mesh(triGeo, triMat))
    })

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
    ]

    var centerOffset = - 0.5 * (this.textGeometry.boundingBox.max.x - this.textGeometry.boundingBox.min.x);

    this.shapeGeometry = new THREE.BufferGeometry().fromGeometry(this.textGeometry);

    this.textMesh = new THREE.Mesh(this.shapeGeometry, materials);

    this.textMesh.position.x = centerOffset;
    // textMesh1.position.y = hover;
    this.textMesh.position.z = 0;

    this.textMesh.rotation.x = 0;
    // textMesh1.rotation.y = Math.PI * 2;

    this.group.add(this.textMesh);
  }

  public getGroup = () => this.group

  public getShapeGeometry = () => this.shapeGeometry

  public getShapes = () => this.shapes
}