out vec3 norm_t;
out vec3 pixelPos;
out vec3 light_direction;

uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
uniform vec3 lightDirectionUniform;


void main() {
	norm_t = normalize(normalMatrix * normal);
	pixelPos = vec3(modelViewMatrix * vec4(position, 1.0));
	vec4 transform_light = normalize(viewMatrix * vec4(lightDirectionUniform, 0.0));
	light_direction = vec3(transform_light);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
