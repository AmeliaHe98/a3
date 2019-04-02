#version 300 es

precision highp float;
precision highp int;
out vec4 out_FragColor;
uniform vec3 spotlightPosition;
uniform vec3 lightColorUniform;
uniform vec3 spotDirectPosition;
in vec3 w_position;

void main() {

	// TODO: PART 1D

   float spotExponent = 5.0;

   vec3 SpotColor = vec3(0.0, 0.0, 0.0);
	 vec3 pixel_direction = w_position-spotlightPosition;
	 vec3 spot_direction = spotDirectPosition-spotlightPosition;
	 float theta = -0.5;
	 float c = dot(normalize(spot_direction),normalize(pixel_direction));
	 if(c>0.9){
	 		SpotColor = vec3(1.0,1.0,0.0)*pow(c,spotExponent);
	 }


   out_FragColor = vec4(SpotColor , 1.0);
}
