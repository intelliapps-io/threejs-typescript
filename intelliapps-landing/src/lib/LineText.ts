import * as THREE from 'three'
import { jsonfont } from '../helpers/jsonfont'
import { EnhancedVector3 } from './EnhancedVector3'
import { rand } from '../helpers/helpers'


export interface ITextOptions {
  hight: number
  size: number
  curveSegments: number
}

export class LineText {
  text: string = ''
  options: ITextOptions
  // geometry
  geometry = new THREE.TextBufferGeometry(this.text, { font: new THREE.Font(jsonfont) })
  material = new THREE.ShaderMaterial()
  vertices: EnhancedVector3[] = []
  positions: number[] = []
  colors: number[] = []
  line = new THREE.Line()
  maxRand: number = 5
  // material
  uniforms: any

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

    this.uniforms = {
      amplitude: { value: 5.0 },
      opacity: { value: 0.3 },
      color: { value: new THREE.Color(0xffffff) }
    }

    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        uniform float amplitude;
        attribute vec3 displacement;
        attribute vec3 customColor;
        varying vec3 vColor;
        void main() {
          vec3 newPosition = position + amplitude * displacement;
          vColor = customColor;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vColor;
        void main() {
          gl_FragColor = vec4( vColor * color, opacity );
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    })

    const count = this.geometry.attributes.position.count;

    const displacement = new THREE.Float32BufferAttribute(count * 3, 3);
    this.geometry.setAttribute('displacement', displacement);

    const customColor = new THREE.Float32BufferAttribute(count * 3, 3);
    this.geometry.setAttribute('customColor', customColor);

    this.geometry.center()

    // create vertices
    this.positions = this.geometry.attributes.position.array as number[]
    for (let i = 0; i < this.positions.length; i += 3) {
      const vertice = new EnhancedVector3(this.positions[i], this.positions[i + 1], this.positions[i + 2])
      const maxStart = 10
      vertice.setX(this.getRand(maxStart) + vertice.x); vertice.setY(this.getRand(maxStart) + vertice.y); vertice.setZ(this.getRand(maxStart) + vertice.z)
      this.vertices.push(vertice)
    }

    var color = new THREE.Color(0xffffff);

    for (var i = 0, l = customColor.count; i < l; i++) {
      color.setHSL(i / l, 0.5, 0.5);
      color.toArray(customColor.array, i * customColor.itemSize);
    }

    this.line = new THREE.Line(this.geometry, this.material);
  }

  update() {
    // this.uniforms.color.value.offsetHSL(1, 1, 1);

    this.material.uniforms = this.uniforms

    const mouse = window.MOUSE_VECTOR.clone()

    this.vertices.forEach(vert => {
      vert.seekTarget('target', {
        maxForce: 20,
        maxSpeed: 2,
        ease: true
      })

      const randNum = rand(1000)
      vert.seekTarget(new THREE.Vector3(this.getRand(randNum) + vert.x, this.getRand(randNum) + vert.y, this.getRand(randNum) + vert.z), {
        maxForce: 2,
        maxSpeed: 0.5,
        // ease: true
      })

      vert.seekTarget(mouse.setZ(vert.z), {
        maxForce: 20,
        maxSpeed: rand(20),
        avoid: true,
        maxDist: 100,
        // ease: true
      })
    })

    this.positions = []
    this.vertices.forEach(({ x, y, z }) =>
      this.positions.push(x, y, z))

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3))

  }

  getMesh = () => this.line
}