import * as THREE from 'three'
import { map } from '../helpers/helpers'

export interface ForceOptions {
  maxForce: number
  maxSpeed: number
  avoid?: boolean
  maxDist?: number
  ease?: boolean
}

type Attributes = { [key: string]: any }

export class EnhancedVector3 extends THREE.Vector3 {
  protected target: THREE.Vector3
  protected velocity: THREE.Vector3
  protected acceleration: THREE.Vector3
  protected attributes: Attributes = {}

  constructor(x?: number, y?: number, z?: number) {
    super(x, y, z)
    this.target = new THREE.Vector3(x, y, z)
    this.velocity = new THREE.Vector3()
    this.acceleration = new THREE.Vector3()
  }

  protected createForce(target: THREE.Vector3, options: ForceOptions): THREE.Vector3 {
    const { maxForce, maxSpeed, maxDist, avoid, ease } = options

    const desired = target.clone().sub(this),
      dist = desired.length()

    if (avoid) {
      desired.multiplyScalar(-1)
      desired.setLength(ease ? map(dist, 0, 100, 0, maxSpeed) : maxSpeed)
    } else
      desired.setLength(ease ? map(dist, 0, 100, 0, maxSpeed) : maxSpeed)

    const steer = desired.clone().sub(this.velocity),
      steerLimit = ease ? map(dist, 0, 100, 0, maxForce) : maxForce

    if (steer.length() > steerLimit)
      steer.setLength(steerLimit)

    if (!maxDist || dist <= maxDist)
      return steer
    else
      return window.ZERO_VECTOR
  }

  // attribute methods
  public setAttribute = (key: string, getValue: (currentValue: any) => any) => this.attributes[key] = getValue(this.attributes[key])
  public getAttribute = (key: string) => this.attributes[key]

  public setTarget = (x: number, y: number, z: number) => {
    this.target.setX(x)
    this.target.setY(y)
    this.target.setZ(z)
  }

  public seekTarget(target: THREE.Vector3 | 'target', options: ForceOptions) {
    // Get Force Vector
    const force = this.createForce(target === 'target' ? this.target : target, options)

    // Add Force
    this.acceleration.add(force)

    // Hanlde Physics Motion
    this.add(this.velocity)
    this.velocity.add(this.acceleration)
    this.acceleration.multiplyScalar(0)
  }
}