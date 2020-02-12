import * as THREE from 'three'
import { jsonfont } from '../helpers/jsonfont'
import { EnhancedVector3 } from './EnhancedVector3'


export interface ITextOptions {
  hight: number
  size: number
  curveSegments: number
}

export class LineText {
  text: string = ''
  options: ITextOptions
  textGeometry = new THREE.TextGeometry(this.text, { font: new THREE.Font(jsonfont) })
  // lines
  vertices: EnhancedVector3[] = []
  positions: number[] = []
  colors: number[] = []
  lineGeometry = new THREE.BufferGeometry()
  lineMaterial = new THREE.LineBasicMaterial()
  line = new THREE.Line()

  constructor(text: string, options: ITextOptions) {
    this.options = options
    this.setText(text)
  }

  private setText(text: string) {
    this.text = text
    this.textGeometry = new THREE.TextGeometry(this.text, {
      ...this.options,
      font: new THREE.Font(jsonfont),
      bevelThickness: 5,
      bevelSize: 1.5,
      bevelEnabled: true,
      bevelSegments: 10,
    })
    this.textGeometry.computeBoundingBox()
    this.textGeometry.computeVertexNormals()

    const triangle = new THREE.Triangle(),
      triangleArea = 0.1 * this.options.hight * this.options.size

    this.textGeometry.faces.forEach((face, i) => {
      var va = this.textGeometry.vertices[face.a];
      var vb = this.textGeometry.vertices[face.b];
      var vc = this.textGeometry.vertices[face.c];

      // create vertices
      this.vertices.push(
        new EnhancedVector3().copy(va),
        new EnhancedVector3().copy(vb),
        new EnhancedVector3().copy(vc),
      )
    })

    // create positions & colors
    this.positions = []; this.colors = []
    const color = new THREE.Color()
    this.vertices.forEach(({ x, y, z }, i) => {
      this.positions.push(x, y, z)
      color.setHSL(i / (this.vertices.length), 1.0, 0.5);
      this.colors.push(color.r, color.g, color.b)
    })

    // set line geometry
    this.lineGeometry.setFromPoints(this.vertices);
    this.lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    this.lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3));
    this.lineGeometry.center()

    // set line material
    this.lineMaterial = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors })

    // set line mesh
    this.line = new THREE.Line(this.lineGeometry, this.lineMaterial)
  }

  getMesh = () => this.line
}