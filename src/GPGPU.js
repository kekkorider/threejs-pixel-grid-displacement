import { Uniform, Vector2 } from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'

import fragmentShader from './materials/gpgpu.glsl'

export class GPGPU {
  constructor(opts = {}) {
    this.size = opts.size || 27
    this.renderer = opts.renderer

    this.createGPGPURenderer()
    this.createDataTexture()
    this.createVariable()
    this.setRendererDependencies()
    this.init()
  }

  init() {
    this.gpgpuRenderer.init()
  }

  createGPGPURenderer() {
    this.gpgpuRenderer = new GPUComputationRenderer(this.size, this.size, this.renderer)
  }

  createDataTexture() {
    this.dataTexture = this.gpgpuRenderer.createTexture()
  }

  createVariable() {
    this.variable = this.gpgpuRenderer.addVariable('t_Grid', fragmentShader, this.dataTexture)
    this.variable.material.uniforms.u_GridSize = new Uniform(this.size)
    this.variable.material.uniforms.u_Mouse = new Uniform(new Vector2())
    this.variable.material.uniforms.u_DeltaMouse = new Uniform(new Vector2())
  }

  setRendererDependencies() {
    this.gpgpuRenderer.setVariableDependencies(this.variable, [this.variable])
  }

  getTexture() {
    return this.gpgpuRenderer.getCurrentRenderTarget(this.variable).textures[0]
  }

  render() {
    this.gpgpuRenderer.compute()
  }
}
