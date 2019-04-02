#version 300 es
uniform vec3 lightColorUniform;
uniform vec3 lightFogColor;
uniform vec3 lightDirectionUniform;
uniform float fogDensity;
uniform float kDiffuseUniform;
uniform float shininessUniform;
out vec3 norm_t;
out vec3 light_direction;
out vec3 pixelPos;
out vec3 cameraPos;

void main() {
	// TODO: PART 1E
	norm_t = normalize(normalMatrix * normal);
	vec4 transform_light = normalize(viewMatrix * vec4(lightDirectionUniform, 0.0));
	light_direction = vec3(transform_light);
	pixelPos = vec3(modelViewMatrix * vec4(position, 1.0));
	cameraPos = vec3(viewMatrix * vec4(cameraPosition, 1.0));

    gl_Position = projectionMatrix * vec4(pixelPos, 1.0);
}
