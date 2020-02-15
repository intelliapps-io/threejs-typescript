import * as THREE from 'three'
import { jsonfont } from '../helpers/jsonfont'
import { EnhancedVector3 } from './EnhancedVector3'
import { rand } from '../helpers/helpers'
import { getVertexShader } from '../helpers/materials/getVertexShader'


export interface ITextOptions {
  hight: number
  size: number
  curveSegments: number
  positioner?: (geometry: THREE.TextBufferGeometry) => void
}

export class LineText {
  text: string = ''
  options: ITextOptions
  // geometry
  geometry = new THREE.TextBufferGeometry(this.text, { font: new THREE.Font(jsonfont) })
  material = getVertexShader()
  vertices: EnhancedVector3[] = []
  positions = new THREE.Float32BufferAttribute([], 3)
  colors: number[] = []
  line = new THREE.Line()
  maxRand: number = 5
  // mutable vectors
  mouseVector = new THREE.Vector3()
  randVector = new THREE.Vector3()

  constructor(text: string, options: ITextOptions) {
    this.options = options
    this.setText(text)
  }

  private getRand = (max?: number) => rand(max ? max : this.maxRand, (max ? max : this.maxRand) * -1)

  private setText(text: string) {
    this.text = text
    this.geometry = new THREE.TextBufferGeometry(this.text, {
      ...this.options,
      font: new THREE.Font(jsonfont),
      bevelThickness: 5,
      bevelSize: 5,
      bevelEnabled: true,
      bevelSegments: 5,
    })

    const count = this.geometry.attributes.position.count;

    const displacement = new THREE.Float32BufferAttribute(count * 3, 3);
    this.geometry.setAttribute('displacement', displacement);

    const customColor = new THREE.Float32BufferAttribute(count * 3, 3);
    this.geometry.setAttribute('customColor', customColor);

    this.geometry.center()

    // custom positioner
    if (this.options.positioner)
      this.options.positioner(this.geometry)

    // get vertices
    this.positions = new THREE.BufferAttribute(this.geometry.attributes.position.array as number[], 3)
    this.geometry.setAttribute('position', this.positions)
    for (let i = 0; i < this.positions.array.length; i += 3) {
      const vertice = new EnhancedVector3(this.positions.array[i], this.positions.array[i + 1], this.positions.array[i + 2])
      const maxStart = 10
      vertice.setX(this.getRand(maxStart) + vertice.x); vertice.setY(this.getRand(maxStart) + vertice.y); vertice.setZ(this.getRand(maxStart) + vertice.z)
      this.vertices.push(vertice)
    }

    var color = new THREE.Color(0xffffff);
    for (var i = 0, l = customColor.count; i < l; i++) {
      color.setHSL(i/ l, 0.8, 0.52);
      color.toArray(customColor.array, i * customColor.itemSize);
    }

    this.line = new THREE.Line(this.geometry, this.material);
  }

  update() {
    // set mouse vector
    this.mouseVector.copy(window.MOUSE_VECTOR)
    
    // calculate new vertice position
    let newPositions: number[] = []
    this.vertices.forEach((vert, i) => {
      vert.seekTarget('target', {
        maxForce: 20,
        maxSpeed: 2,
        ease: true
      })

      const randNum = rand(1000)
      this.randVector.set(this.getRand(randNum) + vert.x, this.getRand(randNum) + vert.y, this.getRand(randNum) + vert.z)
      vert.seekTarget(this.randVector, {
        maxForce: 2,
        maxSpeed: 0.8,
        // ease: true
      })

      vert.seekTarget(this.mouseVector.setZ(vert.z), {
        maxForce: 20,
        maxSpeed: rand(40),
        avoid: true,
        maxDist: 100,
        ease: true
      })

      // update position array
      const {x, y, z} = vert
      newPositions.push(x, y, z)
    })

    // send updated array to gpu
    this.positions.copyArray(newPositions)
    this.positions.needsUpdate = true
  }

  getLine = () => this.line
}