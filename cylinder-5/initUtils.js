
function initializeWebGL(canvas) {
			var gl = canvas.getContext("webgl");
			if(!gl) {
				console.log("WebGL not available");
				return null;
			}
			else 
				return gl;
		}
	
		function initializeShader(gl,id) {
			var script = document.getElementById(id);
			var src = script.textContent;
			
			
			var shader;
			
			if(script.type == "x-shader/x-vertex")
				shader = gl.createShader(gl.VERTEX_SHADER);
			else if(script.type == "x-shader/x-fragment") {
				shader = gl.createShader(gl.FRAGMENT_SHADER);
			}
			else {
				console.log("script.type may not be existent or unrecognized type");
				return null;
			}
			
			gl.shaderSource(shader,src);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.log(gl.getShaderInfoLog(shader));
            return null;
			}
			
			return shader;
		}
		
		function initializeProgram(gl,vertexShader,fragmentShader) {
			var program = gl.createProgram();
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);
			
			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				console.log("Shaders cannot be initialized");
				return null;
			}
			
			return program;
		}