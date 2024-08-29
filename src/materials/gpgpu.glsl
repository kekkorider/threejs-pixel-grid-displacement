void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 color = texture(t_Grid, uv);

  color.r = 1.0;
  color.rg = uv;

  gl_FragColor = color;
}
