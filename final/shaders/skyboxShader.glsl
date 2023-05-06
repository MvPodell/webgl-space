
#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec4 a_position;

uniform mat4 u_matrixV;
uniform mat4 u_matrixP;
varying vec3 texcoords;
uniform mat4 u_matrixR;

void main() {
    vec4 pos = u_matrixP * u_matrixV * vec4(a_position);
    // gl_Position = u_matrixR * pos;
    gl_Position =  pos;
    texcoords = vec3(a_position);
}


#endif
#ifdef FRAGMENT_SHADER
// ------------------------------------------------------//
// ----------------- Fragment SHADER --------------------//
// ------------------------------------------------------//

precision highp float;

uniform samplerCube u_cubeMap;
varying vec3 texcoords;

void main() {
    gl_FragColor = textureCube(u_cubeMap, texcoords);
}


#endif
