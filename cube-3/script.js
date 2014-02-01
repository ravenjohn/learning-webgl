/**
    Raven John M. Lagrimas
    2010-43168
    CMSC 161 UV-2L
*/
(function (root) {
    'use strict';

    /*jslint browser: true */

    var a  =  document.getElementsByTagName('input'),
        e  =  a.length,
        gl,
        program,
        aPosition,
        aColor,

        drawOrthoVolume = function (l, t, n, b, r, f) {
            var viewVolume = new Float32Array([l, t, -n, 1, 1, 0, l, b, -n, 1, 1, 0, r, t, -n, 1, 1, 0, r, b, -n, 1, 1, 0, l, t, -f, 1, 1, 0, l, b, -f, 1, 1, 0, r, t, -f, 1, 1, 0, r, b, -f, 1, 1, 0]),
                indicesVolume = [0, 1, 0, 2, 1, 3, 2, 3, 4, 5, 4, 6, 5, 7, 6, 7, 0, 4, 1, 5, 2, 6, 3, 7],
                FSIZE = viewVolume.BYTES_PER_ELEMENT;

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, viewVolume, gl.STATIC_DRAW);
            gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, !1, FSIZE * 6, 0);
            gl.vertexAttribPointer(aColor, 3, gl.FLOAT, !1, FSIZE * 6, FSIZE * 3);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indicesVolume), gl.STATIC_DRAW);
            gl.drawElements(gl.LINES, indicesVolume.length, gl.UNSIGNED_BYTE, 0);
        },

        drawPerspVolume = function (l, t, n, b, r, f) {
            var fn = f / n,
                viewVolume = new Float32Array([l, t, -n, 1, 1, 0, l, b, -n, 1, 1, 0, r, t, -n, 1, 1, 0, r, b, -n, 1, 1, 0, fn * l, fn * t, -f, 1, 1, 0, fn * l, fn * b, -f, 1, 1, 0, fn * r, fn * t, -f, 1, 1, 0, fn * r, fn * b, -f, 1, 1, 0, 0, 0, 0, 0.3, 0.3, 0]),
                indicesVolume = [0, 1, 0, 2, 1, 3, 2, 3, 4, 5, 4, 6, 5, 7, 6, 7, 0, 4, 1, 5, 2, 6, 3, 7, 4, 8, 5, 8, 6, 8, 7, 8],
                FSIZE = viewVolume.BYTES_PER_ELEMENT;

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, viewVolume, gl.STATIC_DRAW);
            gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, !1, FSIZE * 6, 0);
            gl.vertexAttribPointer(aColor, 3, gl.FLOAT, !1, FSIZE * 6, FSIZE * 3);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indicesVolume), gl.STATIC_DRAW);
            gl.drawElements(gl.LINES, indicesVolume.length, gl.UNSIGNED_BYTE, 0);
        },

        setModelMatrix = function (tX, tY, tZ, rX, rY, rZ, sX, sY, sZ) {
            var matrix = mat4.create();
            mat4.scale(matrix, matrix, [sX, sY, sZ]);
            mat4.translate(matrix, matrix, [tX, tY, tZ]);
            mat4.rotateZ(matrix, matrix, glMatrix.toRadian(rZ));
            mat4.rotateY(matrix, matrix, glMatrix.toRadian(rY));
            mat4.rotateX(matrix, matrix, glMatrix.toRadian(rX));
            gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModelMatrix'), !1, matrix);
        },

        drawCube = function (c) {
            var verticesColors = new Float32Array([c, c, c, 1, 1, 1, -c, c, c, 1, 0, 1, -c, -c, c, 1, 0, 0, c, -c, c, 1, 1, 0, c, -c, -c, 0, 1, 0, c, c, -c, 0, 1, 1, -c, c, -c, 0, 0, 1, -c, -c, -c, 0, 0, 0]),
                indices = new Uint8Array([0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1, 1, 6, 7, 1, 7, 2, 7, 4, 3, 7, 3, 2, 4, 7, 6, 4, 6, 5]),
                FSIZE = verticesColors.BYTES_PER_ELEMENT;

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
            gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, !1, FSIZE * 6, 0);
            gl.vertexAttribPointer(aColor, 3, gl.FLOAT, !1, FSIZE * 6, FSIZE * 3);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
        },

        setViewMatrix = function (e, c, u) {
            var matrix = mat4.create();
            mat4.lookAt(matrix, e, c, u);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uViewMatrix'), !1, matrix);
        },

        drawAxes = function (length) {
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, length, 0, 0, 0, 0, 0, 0, length, 0, 0, 0, 0, 0, 0, length]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, !1, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(aColor, 4, gl.FLOAT, !1, 0, 0);
            gl.drawArrays(gl.LINES, 0, 6);
        },

        drawGrid = function (viewVolume) {
            var gridArray = [],
                gridColor = [],
                i,
                j = 4;
            for (i = -viewVolume; i <= viewVolume; i += 0.25, j = 4) {
                gridArray.splice.apply(gridArray, [0, 0, i, 0, viewVolume, i, 0, -viewVolume, viewVolume, 0, i, -viewVolume, 0, i]);
                while (j--)
                    gridColor.splice.apply(gridColor, i%1 ? [gridColor.length, 0, 0.2, 0.2, 0.2, 1] : [gridColor.length, 0, 0.6, 0.6, 0.6, 1]);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridColor), gl.STATIC_DRAW);
            gl.vertexAttribPointer(aColor, 4, gl.FLOAT, !1, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridArray), gl.STATIC_DRAW);
            gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, !1, 0, 0);

            gl.drawArrays(gl.LINES, 0, gridArray.length / 3);
        },

        drawCam = function (e, cc) {
            var c = 0.1,
                verticesColors = new Float32Array([c / 2, c / 2, c, 1, 1, 1, -c / 2, c / 2, c, 1, 1, 1, -c / 2, -c / 2, c, 1, 1, 1, c / 2, -c / 2, c, 1, 1, 1, c / 2, -c / 2, -c, 1, 0, 0, c / 2, c / 2, -c, 1, 0, 0, -c / 2, c / 2, -c, 1, 0, 0, -c / 2, -c / 2, -c, 1, 0, 0]),
                indices = new Uint8Array([0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1, 1, 6, 7, 1, 7, 2, 7, 4, 3, 7, 3, 2, 4, 7, 6, 4, 6, 5]),
                FSIZE = verticesColors.BYTES_PER_ELEMENT;

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
            gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, !1, FSIZE * 6, 0);
            gl.vertexAttribPointer(aColor, 3, gl.FLOAT, !1, FSIZE * 6, FSIZE * 3);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, -vec3.distance(e, cc)]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, !1, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(aColor, 4, gl.FLOAT, !1, 0, 0);
            gl.drawArrays(gl.LINES, 0, 4);
        },

        init = function (id) {
            var canvas = document.getElementById(id);
            gl = initializeWebGL(canvas);
            program = initializeProgram(gl, initializeShader(gl, 'vshader'), initializeShader(gl, 'fshader'));
            gl.useProgram(program);
            aPosition = gl.getAttribLocation(program, 'aPosition');
            gl.enableVertexAttribArray(aPosition);
            aColor = gl.getAttribLocation(program, 'aColor');
            gl.enableVertexAttribArray(aColor);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            if (id === 'd') {
              gl.depthFunc(gl.LEQUAL);
            }
            gl.clear(gl.DEPTH_BUFFER_BIT);
        },

        render = function () {
            var orthogonal = document.getElementById('type1').checked,
                vars = {},
                vV = 3,
                temp1 = document.getElementsByTagName('input'),
                temp2 = temp1.length;

            while (temp2--) {
              if (temp1[temp2].type === 'number') {
                   vars[temp1[temp2].id] = +temp1[temp2].value;
                }
            }

            vars.fovy = glMatrix.toRadian(vars.fovy);

            if (!orthogonal) {
                vars.n = +document.getElementById('np').value;
                vars.f = +document.getElementById('fp').value;
                vars.l = -(vars.r = (vars.t = vars.n * Math.tan(vars.fovy / 2)) * vars.aspect);
                vars.b = -vars.t;
            }

            init('c');

            temp2 = mat4.create();
            if (orthogonal)
                mat4.ortho(temp2, vars.l, vars.r, vars.b, vars.t, vars.n, vars.f);
            else
                mat4.perspective(temp2, vars.fovy, vars.aspect, vars.n, vars.f);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uPerspectiveMatrix'), !1, temp2);

            setViewMatrix([vars.ex, vars.ey, vars.ez], [vars.cx, vars.cy, vars.cz], [vars.ux, vars.uy, vars.uz]);
            setModelMatrix(vars.tx, vars.ty, vars.tz, vars.rx, vars.ry, vars.rz, vars.sx, vars.sy, vars.sz);
            drawCube(0.5);

            init('d');
            mat4.ortho((temp1 = mat4.create()), -vV, vV, -vV, vV, -vV - 5, vV + 5);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uPerspectiveMatrix'), !1, temp1);
            setViewMatrix([Math.sqrt(1 / 3), Math.sqrt(1 / 3), Math.sqrt(1 / 3)], [0, 0, 0], [0, 1, 0]);
            setModelMatrix(0, 0, 0, 0, 0, 0, 1, 1, 1);
            drawAxes(vV);
            drawGrid(vV);
            setModelMatrix(vars.tx, vars.ty, vars.tz, vars.rx, vars.ry, vars.rz, vars.sx, vars.sy, vars.sz);
            drawAxes(1);
            drawCube(0.5);

            mat4.lookAt((temp1 = mat4.create()), [vars.ex, vars.ey, vars.ez], [vars.cx, vars.cy, vars.cz], [vars.ux, vars.uy, vars.uz]);
            mat4.invert((temp2 = mat4.create()), temp1);
            gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModelMatrix'), !1, temp2);
            drawCam([vars.ex, vars.ey, vars.ez], [vars.cx, vars.cy, vars.cz]);
            if (orthogonal)
                drawOrthoVolume(vars.l, vars.t, vars.n, vars.b, vars.r, vars.f);
            else
                drawPerspVolume(vars.l, vars.t, vars.n, vars.b, vars.r, vars.f);
        },

        _render = function () {
            render();
        };

    render();

    while (e--) a[e].onchange = _render;

    root.onresize = function () {
        var b = document.getElementsByTagName('canvas'),
            i = b.length,
            c = 'px';
        while (i--) {
            if (root.innerHeight < root.innerWidth - 200) {
                b[i].style.width = b[i].style.height = (root.innerWidth - 200) / 2 - 3 + c;
                b[i].style.marginTop = (root.innerHeight - parseFloat(b[i].style.height)) / 2 + c;
            } else {
                b[i].style.width = b[i].style.height = root.innerHeight / 2 - 3 + c;
            }
        }
        document.getElementById('config_section').style.height = root.innerHeight + c;
        document.getElementById('canvas_section').style.width = root.innerWidth - 200 + c;
    };
  
    root.onresize();
} (this) );
