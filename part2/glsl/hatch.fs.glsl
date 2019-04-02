#version 300 es
uniform vec3 lightColorUniform;
uniform vec3 ambientColorUniform;
in vec3 pixelPos;
in vec3 light_direction;
in vec3 norm_t;

out vec4 out_FragColor;

void main() {
vec3 color;
vec3 lightDir = normalize(light_direction - pixelPos);
vec3 viewDir = normalize(-pixelPos);
vec3 reflectDir = reflect(-lightDir, norm_t);
float diffuse = max(dot(lightDir,norm_t), 0.0);
float specular = 0.0;
float r = 72.0/ 255.0f;
float g = 72.0/ 255.0f;
float b = 164.0/ 255.0f;

if(diffuse > 0.0) {
	float specAngle = max(dot(reflectDir, viewDir), 0.0);
	specular = pow(specAngle, 32.0);
}

// float lightIntensity = clamp(diffuse + specular, 0, 1);
float lightIntensity = max((diffuse+specular),0.0);
color = vec3(1.0, 1.0, 1.0);

if (lightIntensity < 0.87){
	// hatch from left top corner to right bottom
	if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {
		color = vec3(r, g, b);
	}
}

if (lightIntensity < 0.78){
	// hatch from right top corner to left boottom
	if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0){
	color = vec3(r, g, b);
	}
}

if (lightIntensity < 0.6){
	// hatch from left top to right bottom
	if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0){
	color = vec3(r, g, b);
	}
}

if (lightIntensity < 0.25){
	// hatch from right top corner to left bottom
	if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0){
	color = vec3(r, g, b);
	}
}


out_FragColor = vec4(color,1.0);
}
