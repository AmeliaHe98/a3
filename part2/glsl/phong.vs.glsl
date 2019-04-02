#version 300 es
uniform vec3 light_d;
out vec3 norm_t;
out vec3 light_direction;
out vec3 pixelPos;
//out vec3 cameraPos;

void main() {

    // TODO: PART 1A
    norm_t = normalize(normalMatrix * normal);
    vec4 transform_light = normalize(viewMatrix * vec4(light_d, 0.0));
    light_direction = vec3(transform_light);

    pixelPos = vec3(modelViewMatrix * vec4(position, 1.0));
    //cameraPos = vec3(viewMatrix * vec4(cameraPosition, 1.0));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
