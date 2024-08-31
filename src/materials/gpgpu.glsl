uniform vec2 u_Mouse;
uniform vec2 u_DeltaMouse;
uniform float u_MouseMove;

#define RELAXATION 0.965

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 color = texture(t_Grid, uv);

  color.r = 1.0;

  float dist = distance(uv, u_Mouse);
  dist = 1.0 - smoothstep(0.0, 0.22, dist);
  color.rg += u_DeltaMouse * dist;

  color.rg *= RELAXATION;
  color.rg = floor(color.rg * vec2(256.)) / vec2(256.);

  gl_FragColor = color;
}
