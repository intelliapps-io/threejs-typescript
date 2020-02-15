import * as THREE from 'three'
import { EnhancedVector3 } from './EnhancedVector3';
import { IPathLine, getPathLines, getPathPoint } from '../helpers/path';

export class PathPoint extends EnhancedVector3 {
  protected pathLines: IPathLine[]
  protected totalLength: number
  protected offset: number

  constructor(pathLines: IPathLine[], totalLength: number, offset: number) {
    super(0, 0, 0) 
    this.pathLines = pathLines
    this.totalLength = totalLength
    this.offset = offset
    
    // initialize point on path
    const [x, y] = getPathPoint(this.pathLines, this.totalLength, this.offset)
    this.setX(x)
    this.setY(y)
    this.setTarget(x, y, 0)
  }

  public setOffset(func: (offset: number) => number) {
    this.offset = func(this.offset)
    const [x, y] = getPathPoint(this.pathLines, this.totalLength, this.offset)
    this.target.setX(x)
    this.target.setY(y)
  }
  
  public update() {
    this.seekTarget(this.target, {
      maxForce: 3,
      maxSpeed: 5,
      ease: true 
    })

    const mouse = window.MOUSE_VECTOR.clone()
    const mouseSize = 2

    mouse.setX(mouse.x + (mouseSize * 2))
    mouse.setY(mouse.y - (mouseSize))
    
    this.seekTarget(mouse, {
      maxForce: 0.5,
      maxSpeed: 0.02,
      avoid: true,
      maxDist: mouseSize,
      ease: true 
    })
    
    this.seekTarget(mouse.clone().setZ(5), {
      maxForce: 0.5,
      maxSpeed: 0.02,
      avoid: true,
      maxDist: mouseSize,
      ease: true 
    })
  }
}