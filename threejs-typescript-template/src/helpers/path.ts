import * as THREE from "three"
import { EnhancedVector3 } from "../lib/EnhancedVector3"

export interface IPathLine {
  p1: THREE.Vector3
  p2: THREE.Vector3
  distFrom: number
  distTo: number
}

export const getPathLength = (vertices: THREE.Vector3[]) => {
  let length = 0
  vertices.forEach((p1, i) => {
    const p2 = vertices[i === vertices.length - 1 ? 0 : i + 1]
    length += p1.distanceTo(p2)
  })
  return length
}

export const getPathLines = (vertices: THREE.Vector3[]) => {
  let pathLines: IPathLine[] = []
  for (let i = 0; i < vertices.length; i++) {
    const lastDistTo = i !== 0 ? pathLines[i - 1].distTo : 0,
      p1 = vertices[i],
      p2 = vertices[i === vertices.length - 1 ? 0 : i + 1],
      distFrom = lastDistTo,
      distTo = distFrom + p1.distanceTo(p2)
    pathLines.push({ p1, p2, distFrom, distTo })
  }
  return pathLines
}

export const getPathSize = (vertices: THREE.Vector3[]): { width: number, height: number } => {
  let minX = vertices[0], maxX = vertices[0],
    minY = vertices[0], maxY = vertices[0]
  
  for (let i = 0; i < vertices.length; i++) {
    const vert = vertices[i], { x, y } = vert  
    // min x
    if (x < minX.x) minX = vert
    // max x
    if (x > maxX.x) maxX = vert
    // min y
    if (y < minY.y) minY = vert
    // max y
    if (y > maxY.y) maxY = vert
  }

  return ({
    width: maxX.x - minX.x,
    height: maxY.y - minY.y
  })
}


//////////////////////////////////////////
/////////////// LOGO VERTS ///////////////
//////////////////////////////////////////

export const getVertices = (options: {
  zAxis?: number,
  scale?: number,
}): THREE.Vector3[] => {
  let vertices: THREE.Vector3[] = []
  let { zAxis, scale } = options
  if (!zAxis) zAxis = 0
  if (!scale) scale = 1
  const numberArray: [number, number][] = [
    [165, 0],
    [213, 0],
    [72, 246],
    [116, 246],
    [261, 0],
    [423, 287],
    [283, 287],
    [236, 204],
    [261, 163],
    [308, 246],
    [352, 246],
    [261, 82],
    [140, 287],
    [0, 287],
    [165, 0],
  ]
  for (let i = 0; i < numberArray.length; i++) {
    const x = numberArray[i][0] * scale!,
      y = -1 * numberArray[i][1] * scale!,
      // z = zAxis! + (-1 * scale! * i * 10)
      z = 0 
    vertices.push(new THREE.Vector3(x, y, z))
  }
  return vertices
}