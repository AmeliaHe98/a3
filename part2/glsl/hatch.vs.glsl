#version 300 es
uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform vec3 lightDirectionUniform;
uniform vec3 catPosition;
uniform float rot_angle;
out vec3 norm_t;
out vec3 light_direction;
out vec3 pixelPos;


void main() {
	// TODO: PART 1E
	norm_t = normalize(normalMatrix * normal);
	vec4 transform_light = normalize(viewMatrix * vec4(lightDirectionUniform, 0.0));
	light_direction = vec3(transform_light);
	pixelPos = vec3(modelViewMatrix * vec4(position, 1.0));

	vec4 newVector = modelMatrix*vec4(position,1.0);
	newVector.x += catPosition.x;
	newVector.y += catPosition.y;
	newVector.z += catPosition.z;
	gl_Position = projectionMatrix * viewMatrix * newVector;

}
