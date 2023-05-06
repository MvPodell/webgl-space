#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec3 a_position; // the position of each vertex
attribute vec3 a_normal;   // the surface normal of each vertex

//TODO: Add a_texcoord attribute
attribute vec2 a_texcoord;

uniform mat4 u_matrixM; // the model matrix of this object
uniform mat4 u_matrixV; // the view matrix of the camera
uniform mat4 u_matrixP; // the projection matrix of the camera
uniform mat3 u_matrixInvTransM;
varying vec3 v_normal;    // normal to forward to the fragment shader

//TODO: Add v_texcoord varying
varying vec2 v_texcoord;

// added from pointlighting shader
uniform vec3 u_viewPos;
varying vec3 v_worldPos;

void main() {
    // v_normal = normalize(u_matrixInvTransM * a_normal); // set normal data for fragment shader
    v_normal = u_matrixInvTransM * a_normal;
    // added from pointlighting shader
    vec3 worldPosition = (u_matrixM * vec4 (a_position, 1)).xyz;
    v_worldPos = worldPosition;

    //TODO: Transfer texCoord attribute value to varying
    v_texcoord = a_texcoord;
    gl_Position = u_matrixP * u_matrixV * u_matrixM * vec4 (a_position, 1);
}

#endif
#ifdef FRAGMENT_SHADER
// ------------------------------------------------------//
// ----------------- Fragment SHADER --------------------//
// ------------------------------------------------------//

precision highp float; //float precision settings
uniform vec3 u_tint;            // the tint color of this object
// uniform vec3 u_directionalLight;// directional light in world space
varying vec3 v_normal;  // normal from the vertex shader

// added from pointlighting shader
uniform vec3 u_lightColor;
uniform vec3 u_lightPosition;
uniform vec3 u_viewPos;
varying vec3 v_worldPos; //recieving varying 
uniform float u_shininess;

//TODO: Add v_texcoord varying
varying vec2 v_texcoord;
//TODO: Add u_mainTex sampler (main texture)
uniform sampler2D u_mainTex;
uniform samplerCube u_cubeMap;



void main(void){
    // calculate basic directional lighting
    vec3 normal = normalize(v_normal);
    // float diffuse = max(0.0, dot(normal, -u_directionalLight));

    // added from pointLightingShader
    vec3 lightDirection = normalize(u_lightPosition - v_worldPos);
    float diffuse = max(0.0, dot(lightDirection, normal));

    // added from pointLighting shader
    float ambient = 0.22;
    vec3 surfaceToView = normalize(u_viewPos - v_worldPos);
    vec3 H = normalize(lightDirection + surfaceToView);
    float specular = pow(max(dot(H, normal), 0.0), u_shininess);
    // float linear = 0.09;
    // float quadratic = 0.032;
    // float attenuation = 1.0 /(1.0 + linear * distance + quadratic * (distance * distance));


    //TODO: Add texture color sampling
    // vec3 textureColor = texture2D(u_mainTex, vec2(0.0, 1.0)).rgb;
    vec3 textureColor = texture2D(u_mainTex, v_texcoord).rgb;

    //TODO: Blend texture color with tint color for new baseColor
    vec3 baseColor = u_tint * textureColor;
    
    // changed this to match pointlight shader
    // vec3 finalColor = ambientDiffuse * baseColor; // apply lighting to color
    vec3 finalColor = baseColor * u_lightColor * (diffuse + ambient + specular);


    // gl_FragColor = vec4(v_texcoord, 0, 1);
    // gl_FragColor = vec4(textureColor, 1);
    gl_FragColor = vec4(finalColor, 1);
}

#endif
