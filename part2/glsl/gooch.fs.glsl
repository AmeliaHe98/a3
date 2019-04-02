in vec3 norm_t;
in vec3 pixelPos;
in vec3 light_direction;

uniform vec3 lightDirectionUniform;
uniform vec3 coolColor;
uniform vec3 warmColor;

void main() {


vec3 light_DFF = vec3(max(0.0, dot(light_direction, norm_t)));

//TOTAL
vec3 TOTAL = mix(coolColor, warmColor, light_DFF);
gl_FragColor = vec4(TOTAL, 1.0);


}
