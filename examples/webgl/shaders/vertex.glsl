#version 300 es

precision highp float;

in vec4 a_position;
uniform mat4 u_modelViewProjection;

void main() {
  gl_PointSize = a_position.w;
  gl_Position = u_modelViewProjection * a_position;
}
