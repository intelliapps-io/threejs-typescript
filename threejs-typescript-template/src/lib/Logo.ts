import * as THREE from "three"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import { Line2 } from "three/examples/jsm/lines/Line2"
import { IPathLine, getPathLines, getVertices, getPathLength, getPathPoint } from "../helpers/path"
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
  protected material: LineMaterial
  protected geometry: LineGeometry
  protected line: Line2

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

    this.geometry = new LineGeometry()
    // this.geometry.setFromPoints(this.pathPoints)
    this.geometry.setPositions(this.positions)
    this.geometry.setColors(this.colors)
    this.geometry.center()

    // this.geometry = new THREE.BufferGeometry().setFromPoints(this.pathPoints);
    // this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    // this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3));
    // this.geometry.center()

    this.material = new LineMaterial({
      color: 0xffffff,
      linewidth: 5, // in pixels
      vertexColors: THREE.VertexColors,
      dashed: false
    })

    // this.material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors })

    this.line = new Line2(this.geometry, this.material);
    this.line.computeLineDistances();
    this.line.scale.set(1, 1, 1);
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

  public getMaterial = () => this.material

  public update() {
    let positions: number[] = [] 
    this.pathPoints.forEach((pathPoint, i) => {
      if (i === 0) {
        const r = this.colors[i], g = this.colors[i + 1], b = this.colors[i + 2]
        this.colors.splice(i, 3)
        this.colors.push(r, g, b)
      }
      pathPoint.update()
      positions.push(pathPoint.x, pathPoint.y, pathPoint.z)
    })
    this.positions = positions

    this.geometry.setPositions(this.positions)
    this.geometry.setColors(this.colors)
    this.geometry.center()
    // this.geometry.setFromPoints(this.pathPoints);
    // this.geometry.center()
  }
}