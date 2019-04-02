#version 300 es
uniform vec3 lightColorUniform;
uniform vec3 lightDirectionUniform;
uniform vec3 ambientColorUniform;
uniform float kAmbientUniform;
uniform float kDiffuseUniform;
uniform float shininessUniform;
uniform float kSpecularUniform;
in vec3 pixelPos;
in vec3 cameraPos;
in vec3 light_direction;
in vec3 norm_t;

out vec4 out_FragColor;

void main() {
		//AMBIENT
		vec3 light_AMB = ambientColorUniform * kAmbientUniform;

		float l_dot_n = dot(normalize(light_direction), normalize(norm_t));

		//DIFFUSE
		vec3 light_DFF = vec3(max(0.0, l_dot_n)) * lightColorUniform* kDiffuseUniform;

		//SPECULAR
		vec3 bounce = reflect(normalize(-light_direction), normalize(norm_t));
		vec3 view = normalize(vec3(0.0)-pixelPos);
		float intensity_SPC = max(0.0, dot(bounce, view));
		vec3 light_SPC = vec3(pow(intensity_SPC, shininessUniform)) * lightColorUniform* kSpecularUniform;;


		//TOTAL
		vec3 TOTAL = light_AMB + light_DFF + light_SPC;

	//TOTAL INTENSITY
	//TODO PART 1E: calculate light intensity (ambient+diffuse+speculars' intensity term)
	float lightIntensity = length(TOTAL);

   	vec4 resultingColor = vec4(0.0,0.0,0.0,0.0);

   	//TODO PART 1E: change resultingColor based on lightIntensity (toon shading)

   	//TODO PART 1E: change resultingColor to silhouette objects
		// quantize
	  if(lightIntensity > 2.7) {
	    resultingColor = vec4(1.0, 1.0, 1.0, 1.0);
	  } else if(lightIntensity > 2.5){
	    resultingColor = vec4(0.7, 0.5, 0.9, 1.0);
	  } else if(lightIntensity > 2.3){
	    resultingColor = vec4(0.4, 0.3, 0.6, 1.0);
	  } else if(lightIntensity > 2.0){
	    resultingColor = vec4(0.2, 0.0, 0.4, 1.0);
	  } else {
	    resultingColor = vec4(0.1, 0.0, 0.3, 1.0);
	  }

		// silhouette objects

float n_dot_v = dot(norm_t, view);
if(n_dot_v > -0.1 && n_dot_v < 0.1) {
	resultingColor = vec4(0.05, 0.0, 0.05, 0.0);
}

	out_FragColor = resultingColor;
}
