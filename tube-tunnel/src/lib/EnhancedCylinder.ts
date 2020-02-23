import * as THREE from 'three'

export class EnhancedCylinder {
  private geometry: THREE.CylinderBufferGeometry
  private material: THREE.MeshBasicMaterial
  private mesh: THREE.Mesh
  private line: THREE.Line

  constructor() {
    this.geometry = new THREE.CylinderBufferGeometry(5, 5, 20, 32);
    this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.line = new THREE.Line(this.geometry, new THREE.LineBasicMaterial({ color: 0xffff00 }))
  }

  public getMesh = () => this.mesh

  public getLine = () => this.line
}