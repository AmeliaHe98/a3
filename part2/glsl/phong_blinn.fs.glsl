#version 300 es
uniform vec3 light;
in vec3 light_direction;
in vec3 norm_t;
uniform vec3 ambient;
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular;
uniform float shininess;
in vec3 pixelPos;
in vec3 cameraPos;

out vec4 out_FragColor;

void main() {

	//TODO: PART 1B

	//AMBIENT
  vec3 light_AMB = ambient * kAmbient;
	float l_dot_n = dot(light_direction, norm_t);

	//DIFFUSE
	vec3 light_DFF = vec3(max(0.0, l_dot_n)) * light * kDiffuse;

	//SPECULAR
	vec3 bounce = normalize(-light_direction + (2.0 * l_dot_n * norm_t));
	vec3 view = normalize(cameraPos - pixelPos);
  float intensity_SPC = max(0.0, dot(bounce, view));
  vec3 light_SPC = vec3(pow(intensity_SPC, shininess)) * light * kSpecular;

	//TOTAL
	vec3 TOTAL = light_AMB + light_DFF + light_SPC;
	out_FragColor = vec4(TOTAL, 1.0);
	}
