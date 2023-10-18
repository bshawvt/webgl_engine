(function() {
	/* depends on glMatrix library for matrix transformations */
	function Graphics(params) {
		var params = params || {};
		var self = this;
		var attrs = {
			/*alpha: true,
			depth: true,
			stencil: false,
			antialias: true,
			desynchronized: false,
			premultipliedAlpha: true,
			preserveDrawingBuffer: true, // default: false,
			failIfMajorPerformanceCaveat: false,
			xrCompatible: true,*/
			powerPreference: "high-performance"
		};
		//this.loader = params.loader;
		this.aspectRatio = window.innerWidth/window.innerHeight;
		this.shaderPrograms = new Map();//Object.create(null); // associative list of shader programs
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		document.body.appendChild(this.canvas);
		this.canvas.className = "fullscreen";
		if (params.useGl2)
			this.gl = this.canvas.getContext('webgl2', attrs);
		else
			this.gl = this.canvas.getContext('webgl', attrs) || this.canvas.getContext('experimental-webgl', attrs);

		/*// shader boiler plate
		var gl = this.gl;
		
		// create empty shader objects
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

		// set shader objects source code
		var textDecoder = new TextDecoder();
		gl.shaderSource(vertexShader, textDecoder.decode(params.loader.get("vertex.shader").data));
		gl.shaderSource(fragmentShader, textDecoder.decode(params.loader.get("fragment.shader").data));

		// create shader object
		gl.compileShader(vertexShader);
		gl.compileShader(fragmentShader);

		// 1st layer of error catching
		// shader object compile errors
		var vertexError = gl.getShaderInfoLog(vertexShader);
		var fragmentError = gl.getShaderInfoLog(fragmentShader);
		if (vertexError.length > 0)
			throw("vertex shader error: %s", vertexError);
		if (fragmentError.length > 0)
			throw("fragment shader error: %s", fragmentError);

		// create and link shader program
		this.shaderPrograms["test"] = gl.createProgram();
		var shaderProgram = this.shaderPrograms["test"];
		console.log(this.shaderPrograms, shaderProgram);
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		// 2nd layer of error catching
		// program linking errors
		var programError = gl.getProgramInfoLog(shaderProgram);
		if (programError.length > 0)
			throw("shader program linking error: %s", programError); 
		
		// shader object build stage cleanup
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);*/

		// generate buffer names
		this.vboStatic = this.gl.createBuffer();
		this.vboDynamic = this.gl.createBuffer();
		this.vboStream = this.gl.createBuffer();

		// shader boiler plate done
		// more gl setup now :(
		this.gl.viewport(0, 0, 800, 600);		
		
		/*// debug
		var verts = new Float32Array([1.0, 1.0, 0.0,
					 				  0.0, 1.0, 0.0,
					 				  1.0, 0.0, 0.0]);
		var color = new Float32Array([1.0, 1.0, 0.0,
					 				  0.0, 1.0, 0.0,
					 				  1.0, 0.0, 0.0]);
		var data = {
			vertices: verts,
			texture: color
		};
		this.loader.add("triangles", data);
		//**
		this.buildShaderProgram("default");*/

		this.setClearColor(0x3a, 0x54, 0x93);
		this.addLostContextListener(function(lostContext) {
			console.log("raw");
		});
		
		// 
		window.addEventListener("resize", function() {
			self.aspectRatio = window.innerWidth / window.innerHeight;
			self.canvas.width = window.innerWidth;
			self.canvas.height = window.innerHeight;
			
			self.gl.viewport(0, 0, 800, 600);//, self.canvas.width, self.canvas.height);//self.gl.drawingBufferWidth, self.gl.drawingBufferHeight);
		});
		console.log("Graphics.js created new canvas with %s context", params.useGl2 ? "WebGL2" : "WebGL");
		console.log("Graphics instance: ", this);
	};
	
	Graphics.prototype.buildShaderProgram = function(programName, vertexShaderSource, fragmentShaderSource) {
		if (!vertexShaderSource || vertexShaderSource.length == 0) {
			console.warn("todo: vertex shader source unset! using default for now");
			vertexShaderSource = "#version 100\nattribute vec4 pos;\nvoid main() {\ngl_Position = vec4(pos.x, pos.y, pos.z, pos.w);\n}";
		};
		if (!fragmentShaderSource || fragmentShaderSource.length == 0) {
			console.warn("todo: fragment shader source unset! using default for now");
			fragmentShaderSource = "#version 100\nvoid main() {\ngl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n}";
		};
		// shader boiler plate
		var gl = this.gl;
		
		// create empty shader objects
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

		// set shader objects source code
		//var textDecoder = new TextDecoder();
		gl.shaderSource(vertexShader, vertexShaderSource); //textDecoder.decode(params.loader.get("vertex.shader").data));
		gl.shaderSource(fragmentShader, fragmentShaderSource); //textDecoder.decode(params.loader.get("fragment.shader").data));

		// create shader object
		gl.compileShader(vertexShader);
		gl.compileShader(fragmentShader);

		// 1st layer of error catching
		// shader object compile errors
		var vertexError = gl.getShaderInfoLog(vertexShader);
		var fragmentError = gl.getShaderInfoLog(fragmentShader);
		if (vertexError.length > 0)
			console.error("vertex shader error: %s", vertexError);
		if (fragmentError.length > 0)
			console.error("fragment shader error: %s", fragmentError);

		// create and link shader program
		var shaderProgram = gl.createProgram();
		this.shaderPrograms.set(programName, shaderProgram);
		//var shaderProgram = this.shaderPrograms[programName];
		//console.log(this.shaderPrograms, shaderProgram//this.shaderPrograms[programName]);
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		// 2nd layer of error catching
		// program linking errors
		var programError = gl.getProgramInfoLog(shaderProgram);
		if (programError.length > 0)
			throw("shader program linking error: %s", programError); 
		
		// shader object build stage cleanup
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
	};
	/*
		meshResource => 
	*/
	Graphics.prototype.drawModel = function(model) {
		var gl = this.gl;
		if (!model || !model.buffers || !model.vertices) 
			return console.warn("Graphics.drawModel called with bad model object");
		// initialize drawing state
		// bind buffer name
		gl.bindBuffer(gl.ARRAY_BUFFER, model.buffer);
		// initialize bound buffer name
		gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
		
		// set and enable vertex attributes
		gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 12 /* 4 bytes * 3 elements */, 0);
		gl.enableVertexAttribArray(0);
		
		// send shader program to rendering state
		gl.useProgram(this.shaderPrograms["default"]);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		
		// final layer of error catching??
		//if (gl.getError() != 0)
		//	console.log("glGetError(): ", gl.getError());
	};
	
	Graphics.prototype.addLostContextListener = function(fnOnContextLost) {
		console.log("Added LostContextListener");
		this.canvas.addEventListener("webglcontextlost", function(lostContext) {
			console.warn("Webgl Context lost: ", lostContext);
			if (typeof fnOnContextLost == "function")
				fnOnContextLost(lostContext, this);
		});
	};

	Graphics.prototype.setClearColor = function(r, g, b, a) {
		a = a ?? 0xff;
		if (typeof r == "string") {
			var offset = 16;
			if (r.length > 8) {
				offset = 8;
				a = (r >>> 0) & 0xff;
			}
			b = (r >>> 16 - offset) & 0xff;
			g = (r >>> 24 - offset) & 0xff;
			r = (r >>> 32 - offset) & 0xff;
		}
		this.gl.clearColor(r/0xff, g/0xff, b/0xff, a/0xff);
	};
	Graphics.prototype.clear = function() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	};
	// 
	//Graphics.prototype.loadOvo = function(resource) {
		// todo
	//	this.model = new Model(resource);
	//};
	// data = 
	function Model(resource) {
		this.shaderProgram = null;
		this.textures = []; //
		this.usage = gl.STATIC_DRAW; // gl.DYNAMIC_DRAW // gl.STREAM_DRAW
		this.vertices = [];
		this.uniforms = [];
		this.attributes = [];
	};
	window.export = {Graphics};

})();