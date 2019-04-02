#version 300 es
in vec3 norm_t;
in vec3 pixelPos;
in vec3 cameraPos;
uniform vec3 lightColorUniform;
uniform vec3 lightFogColor;
uniform vec3 lightDirectionUniform;
uniform float fogDensity;
uniform float kDiffuseUniform;
uniform float shininessUniform;

out vec4 out_FragColor;

void main() {

	// TODO: PART 1C
	//fog
	float dist = distance(cameraPos,pixelPos);
	float fog_level = 1.0/exp(dist*fogDensity);
	vec3 light_FOG = (1.0-fog_level)*lightFogColor;

	//diffuse
	vec3 norm = normalize(norm_t);
	vec3 n_lightDir = normalize(vec3(viewMatrix*vec4(lightDirectionUniform,0.0)));
	float diff = max(0.0, dot(norm, n_lightDir));
	vec3 light_DFF = fog_level*kDiffuseUniform*diff*lightColorUniform;

	vec3 TOTAL = light_FOG + light_DFF ;
  out_FragColor = vec4(TOTAL, 1.0);
}
