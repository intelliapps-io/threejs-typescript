import * as THREE from "three"
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
      console.log('creating point ' + offset)
      this.pathPoints.push(new PathPoint(this.pathLines, this.totalLength, offset))
    }
    
    // rendering
    this.material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    this.geometry = new THREE.BufferGeometry().setFromPoints(this.pathPoints);
    this.geometry.center()
    this.line = new THREE.Line(this.geometry, this.material);
  }

  public getLine = () => this.line

  public update() {
    this.pathPoints.forEach(pathPoint => {
      pathPoint.setOffset(offset => offset + 0.005)
      pathPoint.update()
    })

    this.geometry.setFromPoints(this.pathPoints);
    this.geometry.center()
  }
}