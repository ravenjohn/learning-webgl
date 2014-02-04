;(function (root) {
    var main = function () {
            var gl,
                temp = 0,
                buffer,
                program,
                modelMatrix,
                c = document.getElementById("c"),
                normals = function (v) {
                    var normalize = function (a) {
                            var d = Math.sqrt((a[0]*a[0])+(a[1]*a[1])+(a[2]*a[2]));
                            return [a[0]/d, a[1]/d, a[2]/d];
                        },
                        minus = function (a, b) {
                            return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
                        },
                        cross = function (a, b) {
                            return [(a[1] * b[2]) - (a[2] * b[1]), -((a[0] * b[2]) - (a[2] * b[0])), (a[0] * b[1]) - (a[1] * b[0])];
                        },
                        b,
                        i,
                        temp,
                        ret = [];
                    for (i = 0; i < 18 * sides; i+=18) {
                        // ret = ret.concat(0,0,1, 0,0,1, 0,0,1);
                        b = v.slice(i+3, i+6);
                        temp = normalize(cross(minus(b, v.slice(i,i+3)), minus(b, v.slice(i+6, i+9))));
                        ret = ret.concat(
                            temp, temp.slice(), temp.slice(),
                            temp.slice(), temp.slice(), temp.slice()
                        );
                    }
                    for (; i < v.length; i+=9) {
                        // ret = ret.concat(0,0,1, 0,0,1, 0,0,1);
                        b = v.slice(i+3, i+6);
                        temp = normalize(cross(minus(b, v.slice(i,i+3)), minus(b, v.slice(i+6, i+9))));
                        ret = ret.concat(temp, temp.slice(), temp.slice());
                    }
                    return ret;
                },
                sides = 200,
                vertices = [];

            for (temp = 0; temp < sides;  temp += 1) {
                vertices.push( Math.cos(temp * 2 * Math.PI / sides), Math.sin(temp * 2 * Math.PI / sides), 0,
                               Math.cos(temp * 2 * Math.PI / sides), Math.sin(temp * 2 * Math.PI / sides), 2,
                               Math.cos((temp + 1) * 2 * Math.PI / sides), Math.sin((temp + 1) * 2 * Math.PI / sides), 2,
                               
                               Math.cos((temp + 1) * 2 * Math.PI / sides), Math.sin((temp + 1) * 2 * Math.PI / sides), 2,
                               Math.cos(temp * 2 * Math.PI / sides), Math.sin(temp * 2 * Math.PI / sides), 0,
                               Math.cos((temp + 1) * 2 * Math.PI / sides), Math.sin((temp + 1) * 2 * Math.PI / sides), 0);
            }
            for (temp = 0; temp < sides;  temp += 1) {
                vertices.push( Math.cos(temp * 2 * Math.PI / sides), Math.sin(temp * 2 * Math.PI / sides), 0,
                               0, 0, 0,
                               Math.cos((temp + 1) * 2 * Math.PI / sides), Math.sin((temp + 1) * 2 * Math.PI / sides), 0);
            }
            for (temp = 0; temp < sides;  temp += 1) {
                vertices.push( Math.cos(temp * 2 * Math.PI / sides), Math.sin(temp * 2 * Math.PI / sides), 2,
                               0, 0, 2,
                               Math.cos((temp + 1) * 2 * Math.PI / sides), Math.sin((temp + 1) * 2 * Math.PI / sides), 2);
            }

            c.width = root.innerWidth;
            c.height = root.innerHeight;
            program = initializeProgram(gl = initializeWebGL(c), initializeShader(gl, "vshader"), initializeShader(gl, "fshader"));
            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            gl.vertexAttribPointer(temp = gl.getAttribLocation(program, "aPosition"), 3, gl.FLOAT, !1, 0, 0);
            gl.enableVertexAttribArray(temp);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals(vertices)), gl.STATIC_DRAW);

            gl.vertexAttribPointer(temp = gl.getAttribLocation(program, "aNormal"), 3, gl.FLOAT, !1, 0, 0);
            gl.enableVertexAttribArray(temp);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            temp = -1;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer = gl.createBuffer());
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(Array.apply(0, Array(vertices.length / 3)).map(function () {return temp+=1;})), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            mat4.rotateY(modelMatrix = mat4.create(), modelMatrix, glMatrix.toRadian(angle));
            mat4.rotateX(modelMatrix, modelMatrix, glMatrix.toRadian(90));
            gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), !1, modelMatrix);

            mat4.invert(temp = mat4.create(), modelMatrix);
            mat4.transpose(temp, temp);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, "uNormal"), !1, temp);

            mat4.lookAt(temp = mat4.create(), [3, 2, 8], [0, -1, 0], [0, 1, 0]);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, "uView"), !1, temp);

            mat4.perspective(temp = mat4.create(), glMatrix.toRadian(zoom == 30 ? zoom : zoom--), c.width / c.height, 1, 100);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjection"), !1, temp);

			gl.uniform3f(gl.getUniformLocation(program,"uLightDirection"), -1, -2.5, -5);
			gl.uniform3f(gl.getUniformLocation(program,"uEyePosition"), 3 ,3 ,7);
            gl.uniform3f(gl.getUniformLocation(program, "uMaterialDiffuse"), (Math.sin(2 * Math.PI / 2550 * counter) * 127 + 128) / 255, (Math.sin(2 * Math.PI / 2550 * counter + 2) * 127 + 128) / 255, (Math.sin(2 * Math.PI / 2550 * counter + 4) * 127 + 128) / 255);
		  	// gl.uniform3f(gl.getUniformLocation(program,"uMaterialDiffuse"), 0.2, 0.7, 0.2);
			gl.uniform3f(gl.getUniformLocation(program,"uLightDiffuse"), 1, 1, 1);
		  	gl.uniform3f(gl.getUniformLocation(program,"uMaterialAmbient"), 0.2, 0.2, 0.2);
			gl.uniform3f(gl.getUniformLocation(program,"uLightAmbient"), 0.3, 0.3, 0.3);
		  	gl.uniform3f(gl.getUniformLocation(program,"uMaterialSpecular"), 0.9, 1, 0.9);
			gl.uniform3f(gl.getUniformLocation(program,"uLightSpecular"), 1, 1, 1);
			gl.uniform1f(gl.getUniformLocation(program,"uShininess"), 1);
			gl.uniform1i(gl.getUniformLocation(program,"uEnableAmbient"), !0);
			gl.uniform1i(gl.getUniformLocation(program,"uEnableDiffuse"), !0);
			gl.uniform1i(gl.getUniformLocation(program,"uEnableSpecular"), !0);

		  	//draw scene
			gl.clearColor(0, 0, 0, 1);
			gl.enable(gl.DEPTH_TEST);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
			gl.drawElements(gl.TRIANGLES, vertices.length / 3, gl.UNSIGNED_SHORT, 0);   
        },
        easing = function (t, b, c, d) {
            t /= d/2;
            if (t < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
            t -= 2;
            return c/2 * (Math.sqrt(1 - t*t) + 1) + b;
        },
        zoom = 30,
        angle = 0,
        counter = 0,
        interval = setInterval(function () {
            angle = easing((counter++%200), angle % 360, 360, 3000);
            main();
        }, 10);

    jarvis.learn([
        ["rotate", function () {
            interval = setInterval(function () {
                angle = easing((counter%200), angle % 360, 360, 3000);
                main();
            }, 10);
        }],
        ["stop", function () {
            clearInterval(interval);
        }]
    ]);
    jarvis.debug = true;
    jarvis.start();

} (this) );
