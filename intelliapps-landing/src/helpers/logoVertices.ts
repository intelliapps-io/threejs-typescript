import * as THREE from 'three'

interface ILogoVerticeOptions {
  scale?: number,
}

const getArray2DVertices = (scale: number): [number, number][] => [
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
].map(([x, y]) => [x * scale, -1 * y * scale])

export const getLogoVertices = (options: ILogoVerticeOptions): THREE.Vector3[] => 
  getArray2DVertices(options.scale ? options.scale : 1).map(([x, y]) => new THREE.Vector3(x, y, 0))

export const getLogoPath = (options: ILogoVerticeOptions): THREE.Path => {
  const path = new THREE.Path(), { scale } = options
  getArray2DVertices(scale ? scale : 1).forEach(([x, y], i, points) => {
    if (i === points.length - 1) {
      path.lineTo(x, y)
      path.closePath()
      // path.c
    } else {
      path.lineTo(x, y)
    }
  })

  return path
}