import * as THREE from "three"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import { IPathLine, getPathLines, getVertices, getPathLength } from "../helpers/path"
import { EnhancedVector3 } from "./EnhancedVector3"
import { PathPoint } from "./PathPoint"

export class Logo {
  protected vertices: THREE.Vector3[]
  protected pathLines: IPathLine[]
  protected totalLength: number
  protected totalPoints: number
  protected pathPoints: PathPoint[] = []
  // rendering
  protected positions: number[] = []
  protected colors: number[] = []
  protected material: THREE.LineBasicMaterial
  protected geometry: THREE.BufferGeometry
  protected line: THREE.Line

  constructor(totalPoints: number) {
    this.vertices = getVertices({ scale: 1 / 50 })
    this.pathLines = getPathLines(this.vertices)
    this.totalLength = getPathLength(this.vertices)
    this.totalPoints = totalPoints

    // create path points
    const spacing = this.totalLength / this.totalPoints
    for (let offset = 0; offset < this.totalLength; offset += spacing) {
      const pathPoint = new PathPoint(this.pathLines, this.totalLength, offset)
      pathPoint.setAttribute('colorOffset', () => offset)
      this.pathPoints.push(pathPoint)
    }

    // rendering
    this.setColors() 
    this.geometry = new THREE.BufferGeometry().setFromPoints(this.pathPoints);
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3));
    this.geometry.center()

    const lineMat = new LineMaterial({
      color: 0xffffff,
      linewidth: 5, // in pixels
      vertexColors: THREE.VertexColors,
      dashed: false
    })

    this.material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors })
    
    this.line = new THREE.Line(this.geometry, this.material);
  }

  protected setColors() {
    const color = new THREE.Color()
    this.positions = []; this.colors = []
    this.pathPoints.forEach((point, i) => {
      this.positions.push(point.x, point.y, point.z)
      color.setHSL(i / this.totalPoints, 1.0, 0.5);
      this.colors.push(color.r, color.g, color.b)
    })
  }

  public getLine = () => this.line

  public update() {
    this.pathPoints.forEach(pathPoint => {
      pathPoint.setOffset(offset => offset + 0.01)
      pathPoint.setAttribute('colorOffset', offset => offset + 1)
      pathPoint.update()
    })

    this.geometry.setFromPoints(this.pathPoints);
    this.geometry.center()
  }
}