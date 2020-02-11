import * as THREE from 'three'
import { EnhancedVector3 } from './EnhancedVector3';
import { IPathLine, getPathLines } from '../helpers/path';

function getBaseOffset(totalLength: number, _offset: number): number {
  if (_offset >= 0 && _offset <= totalLength)
    return _offset
  const base = _offset - Math.floor(_offset / totalLength) * totalLength
  return _offset < 0 ? totalLength - base : base
}

const getPathPoint = (pathLines: IPathLine[], totalLength: number, _offset: number): [number, number] => {
  const offset = getBaseOffset(totalLength, _offset)
  const pathLine = pathLines.find(_pathLine => _pathLine.distFrom <= offset && _pathLine.distTo >= offset)
  if (pathLine) {
    const angleBetween = Math.atan2(pathLine.p2.y - pathLine.p1.y, pathLine.p2.x - pathLine.p1.x),
      distAlongPath = offset - pathLine.distFrom,
      p1 = pathLine.p1,
      p2x = p1.x + distAlongPath * Math.cos(angleBetween),
      p2y = p1.y + distAlongPath * Math.sin(angleBetween)
    return [p2x, p2y]
  }
  return [0, 0]
}

export class PathPoint extends EnhancedVector3 {
  protected pathLines: IPathLine[]
  protected totalLength: number
  protected offset: number

  constructor(pathLines: IPathLine[], totalLength: number, offset: number) {
    super(0, 0, 0) 
    this.pathLines = pathLines
    this.totalLength = totalLength
    this.offset = offset
    
    //initialize point on path
    const [x, y] = getPathPoint(this.pathLines, this.totalLength, this.offset)
    this.setX(x)
    this.setY(y)
  }

  public setOffset(func: (offset: number) => number) {
    this.offset = func(this.offset)
    const [x, y] = getPathPoint(this.pathLines, this.totalLength, this.offset)
    // maybe try setting point itself 
    this.target.setX(x)
    this.target.setY(y)
  }
  
  public update() {
    this.seekTarget(this.target, {
      maxForce: 5,
      maxSpeed: 5
    })

    const mouse = window.MOUSE_VECTOR.clone()
    const mouseSize = 3

    mouse.setX(mouse.x + (mouseSize * 3/2))
    mouse.setY(mouse.y - (mouseSize))
    
    this.seekTarget(mouse, {
      maxForce: 1,
      maxSpeed: 1,
      avoid: true,
      maxDist: 3
    })
  }
}