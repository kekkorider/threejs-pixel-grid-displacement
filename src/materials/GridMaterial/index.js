import { ShaderMaterial, Uniform, Vector2, Vector4 } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const GridMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: false,
  uniforms: {
    t_Texture: new Uniform(new Vector4()),

    u_ContainerResolution: new Uniform(new Vector2(window.innerWidth, window.innerHeight)),
    u_Time: new Uniform(0),
    t_Grid: new Uniform(new Vector4()),
  }
})
