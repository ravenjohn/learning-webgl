(function(root){
	
	var HERALD = Function.prototype,
		GL;
	
	HERALD.initWebGL = function (canvas) {
		var gl;
		if(gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))) {
			gl.setProgram = function(p){
				this.program = p;
				this.useProgram(p);
				return this;
			};
			gl.attr = function(a){	//shorthand
				return this.getAttribLocation(this.program, a);
			};
			gl.uniform = function(u){	//shorthand
				return this.getUniformLocation(this.program, u);
			};
			return (GL = gl);
		}
		throw new Error("WebGL not available");
	};

	HERALD.initShader = function (id) {
		var script = document.getElementById(id),
			shader;
		
		if(script.type == "x-shader/x-vertex"){
			shader = GL.createShader(GL.VERTEX_SHADER);
		}
		else if(script.type == "x-shader/x-fragment"){
			shader = GL.createShader(GL.FRAGMENT_SHADER);
		}
		else {
			throw new Error("script.type may not be existent or unrecognized type");
		}
		
		GL.shaderSource(shader,script.textContent);
		GL.compileShader(shader);

		if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
			throw new Error(GL.getShaderInfoLog(shader));
		}

		return shader;
	};
	
	HERALD.initProgram = function (vertexShader, fragmentShader) {
		var program = GL.createProgram();
		
		GL.attachShader(program, vertexShader);
		GL.attachShader(program, fragmentShader);
		GL.linkProgram(program);
		
		if (!GL.getProgramParameter(program, GL.LINK_STATUS)) {
			throw new Error("Shaders cannot be initialized");
		}
		
		return program;
	};
	
	HERALD.getGL = function(){
		return GL;
	};

	root.HERALD = HERALD;
	
})(this);
