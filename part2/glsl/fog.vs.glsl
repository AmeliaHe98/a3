#version 300 es
uniform vec3 lightColorUniform;
uniform vec3 lightFogColor;
uniform vec3 lightDirectionUniform;
uniform float fogDensity;
uniform float kDiffuseUniform;
uniform float shininessUniform;

out vec3 norm_t;
out vec3 pixelPos;
out vec3 cameraPos;

void main() {

	// TODO: PART 1C
		norm_t = normalize(normalMatrix * normal);
		pixelPos = vec3(modelViewMatrix * vec4(position, 1.0));
		cameraPos = vec3(viewMatrix * vec4(cameraPosition, 1.0));

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
}
