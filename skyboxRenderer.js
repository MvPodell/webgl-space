"use strict";
// import { rotationMatrixY } from './math.js';
class SkyboxRenderer {
    /** Creates a new instance of Skybox. A skybox needs a shader
    * and the cubemap that should be used for the sky texturing.
    * @param {string} shaderName the name of the shader
    * @param {string} cubemap name of the cubemap for this skybox.
    */
    constructor(shaderName, cubeMap) {
        this.program = GLUtils.createShaderProgram(shaderName);
        this.cubeMap = cubeMap;
        // make the position buffer for the skybox mesh
        this.positionBuffer = gl.createBuffer();
        // TODO: add vertex data and assign it to the positionBuffer
        // skybox vertex data
        let vertices = [
            // 36 positions for cube with 2x2x2 dimensions (no index buffer needed)
            -1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0
        ];
        // TODO: assign vertexCount (how many vertices to render)
        this.vertexCount = vertices.length/3 ;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        
        
    }
    /** Draw this skybox.
    * @param {Camera} camera the camera to use to draw the skybox.
    */
    draw(camera, deltaTime) {
        // TODO: set up viewMatrix and projectionMatrix
        let viewMatrix = camera.viewMatrix.clone();
        viewMatrix[12] = 0;
        viewMatrix[13] = 0;
        viewMatrix[14] = 0;
        let projectionMatrix = camera.projectionMatrix;
        // get camera (view) position
        let cameraPosition = camera.getPosition();

        // compute the model matrix with a rotation around the y-axis
        let angle = deltaTime * 1; // rotation angle
        let rotationMatrix = rotate(angle, [0, 1, 0]); // rotation matrix around the y-axis
        // let modelMatrix = M4.translation(cameraPosition).times(rotationMatrix);

        gl.useProgram(this.program);
        //disable depth before drawing (drawn as background)
        gl.depthMask(false);

        function rotate(angle) {
            let rad = angle * Math.deg2rad;
            let result = M4.IDENTITY; // Make new identity matrix for the result
    
            let s = Math.sin(rad),
                c = Math.cos(rad);
    
            result[ 5] = c;
            result[ 6] = s;
            result[ 9] =-s;
            result[10] = c;
            return result;
        }

        // TODO: set up attribute pointer for position attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        let posAttribLoc = gl.getAttribLocation(this.program, "a_position");
        gl.enableVertexAttribArray(posAttribLoc);
        // vertexAttribPointer(index, size, type, normalized, stride, offset)
        gl.vertexAttribPointer(posAttribLoc,3,gl.FLOAT,false,0,0);

        // TODO: set up uniforms - I ADDED THIS COMMENT
        let viewMatrixLoc = gl.getUniformLocation(this.program, "u_matrixV");
        gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix.toFloat32());
        let projMatrixLoc = gl.getUniformLocation(this.program, "u_matrixP");
        gl.uniformMatrix4fv(projMatrixLoc, false, projectionMatrix.toFloat32());
        // let rotationMatrixLoc = gl.getUniformLocation(this.program, "u_matrixR");
        // gl.uniformMatrix4fv(rotationMatrixLoc, false, rotationMatrix);


        // TODO: use texture unit 0 for cubemap
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, TextureCache[this.cubeMap]);
        let cubeMapLoc = gl.getUniformLocation(this.program, "u_cubeMap")
        gl.uniform1i(cubeMapLoc, 0);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);

        //enable depth after drawing
        gl.depthMask(true);
    }
}
