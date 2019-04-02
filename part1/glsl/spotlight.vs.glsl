#version 300 es
uniform vec3 spotlightPosition;
uniform vec3 lightColorUniform;
uniform vec3 spotlightDirectionUniform;

out vec3 w_position;

void main() {

 	// TODO: PART 1D
  w_position = vec3(modelMatrix * vec4(position, 1.0));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
