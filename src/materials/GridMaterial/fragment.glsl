varying vec2 vUv;

uniform sampler2D t_Texture;
uniform sampler2D t_Grid;
uniform vec2 u_ContainerResolution;
uniform float u_Time;

vec2 coverUvs(vec2 imageRes, vec2 containerRes) {
  float imageAspectX = imageRes.x/imageRes.y;
  float imageAspectY = imageRes.y/imageRes.x;

  float containerAspectX = containerRes.x/containerRes.y;
  float containerAspectY = containerRes.y/containerRes.x;

  vec2 ratio = vec2(
      min(containerAspectX / imageAspectX, 1.0),
      min(containerAspectY / imageAspectY, 1.0)
  );

  vec2 newUvs = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  return newUvs;
}

void main() {
  ivec2 tex0Size = textureSize(t_Texture, 0);
  vec2 coverUV = coverUvs(vec2(float(tex0Size.x), float(tex0Size.y)), u_ContainerResolution);
  vec2 squareUV = coverUvs(vec2(1.0), u_ContainerResolution);

  vec4 displacement = texture2D(t_Grid, squareUV);
  displacement.a = 1.0;

  vec2 finalUV = coverUV - displacement.rg * 0.01;
  vec4 finalImage = texture2D(t_Texture, finalUV);

  gl_FragColor = finalImage;
  // gl_FragColor = displacement;
}
