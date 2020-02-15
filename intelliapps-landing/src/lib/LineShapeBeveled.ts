import * as THREE from 'three'
import { EnhancedVector3 } from './EnhancedVector3'
import { getVertexShader } from '../helpers/materials/getVertexShader'
import { rand } from '../helpers/helpers'
import { getLogoPath } from '../helpers/logovertices'

export interface ILineShapeOptions {
  totalPoints: number
  maxRand: number
  positioner?: (geometry: THREE.Geometry) => void
}

export class LineShape {
  vertices: THREE.Vector3[]
  options: ILineShapeOptions
  // geometry
  geometry = new THREE.BufferGeometry()
  points: EnhancedVector3[] = []
  positions = new THREE.Float32BufferAttribute([], 3)
  // material
  material = getVertexShader()
  // line
  line: THREE.Line
  // @ts-ignore
  mesh: THREE.Mesh
  // mutable vectors
  mouseVector = new THREE.Vector3()
  randVector = new THREE.Vector3()

  constructor(vertices: THREE.Vector3[], options: ILineShapeOptions) {
    this.vertices = vertices
    this.options = options
    this.setGeometry()
    this.line = new THREE.Line(this.geometry, this.material)
  }

  private getRand = (max?: number) => rand(max ? max : this.options.maxRand, (max ? max : this.options.maxRand) * -1)

  private setGeometry() {
    const spline = new THREE.CatmullRomCurve3(this.vertices, false, 'catmullrom', 0.01)
    let positions: number[] = [], { totalPoints } = this.options

    const shape = new THREE.Shape().setFromPoints(spline.getPoints(totalPoints).map(({x, y}) => new THREE.Vector2(x, y)))
    // shape.autoClose = true

    const geo = new THREE.ExtrudeBufferGeometry(shape, {
      steps: 2,
      depth: 1,
      bevelEnabled: true,
      bevelThickness: 5,
      bevelSize: 5,
      bevelSegments: 10,
    })
    geo.center()
    geo.translate(0, 400, 0)
    this.mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x00ccff }))

    // TEMP GEO
    const tempGeo = new THREE.Geometry().fromBufferGeometry(geo)
    // tempGeo.vertices = spline.getPoints(totalPoints)
    tempGeo.center()
    if (this.options.positioner)
      this.options.positioner(tempGeo)

    // get first line points
    tempGeo.vertices.forEach(({ x, y }) => positions.push(x, y, 0))
    // geo.

    // go over line again x number of times
    const repeatLines = 0
    for (let i = 0; i < (totalPoints * (repeatLines)); i += 3)
      positions.push(positions[i], positions[i + 1], rand(1000))

    // create point vertices
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i], y = positions[i + 1]
      this.points.push(new EnhancedVector3(x, y, 0))
    }

    // update position buffer
    this.positions = new THREE.Float32BufferAttribute(positions, 3)

    // apply positon attribute
    this.geometry.setAttribute('position', this.positions)

    // apply displacement attribute
    this.geometry.setAttribute('displacement', new THREE.Float32BufferAttribute(positions.length, 3))

    // generate colors
    const customColor = new THREE.Float32BufferAttribute(positions.length, 3);
    this.geometry.setAttribute('customColor', customColor);
    var color = new THREE.Color(0xffffff);
    for (var i = 0, l = customColor.count; i < l; i++) {
      color.setHSL(i / (customColor.array.length / (repeatLines + 1)), 0.8, 0.6);
      color.toArray(customColor.array, i * customColor.itemSize);
    }
  }

  update() {
    // set mouse vector
    this.mouseVector.copy(window.MOUSE_VECTOR)

    // calculate new vertice position
    let newPositions: number[] = []
    this.points.forEach((vert, i) => {
      vert.seekTarget('target', {
        maxForce: 20,
        maxSpeed: 2,
        ease: true
      })

      const randNum = rand(500)
      this.randVector.set(this.getRand(randNum) + vert.x, this.getRand(randNum) + vert.y, this.getRand(randNum) + vert.z)
      vert.seekTarget(this.randVector, {
        maxForce: 2,
        maxSpeed: 0.4,
        ease: true
      })

      vert.seekTarget(this.mouseVector.setZ(vert.z), {
        maxForce: 20,
        maxSpeed: rand(40),
        avoid: true,
        maxDist: rand(100),
        // ease: true
      })

      // update position array
      const { x, y, z } = vert
      newPositions.push(x, y, z)
    })

    // send updated array to gpu
    this.positions.copyArray(newPositions)
    this.positions.needsUpdate = true
  }

  public getLine = () => this.line

  public getMesh = (): THREE.Mesh => this.mesh
}