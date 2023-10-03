(function() {
	function Graphics(opts) {
		var opts = opts || {};
		var attrs = {
			/*
			alpha: true,
			depth: true,
			stencil: false,
			antialias: true,
			desynchronized: false,
			premultipliedAlpha: true,
			preserveDrawingBuffer: false,
			failIfMajorPerformanceCaveat: false,
			xrCompatible: true,*/
			powerPreference: "high-performance"
		};
		var self = this;
		this.aspectRatio = window.innerWidth/window.innerHeight;
		this.canvas = document.createElement("canvas");
		this.canvas.width = "200";
		this.canvas.height = "200";
		document.body.appendChild(this.canvas);
		this.canvas.className = "fullscreen";
		if (opts.useGl2)
			this.gl = this.canvas.getContext('webgl2', attrs);
		else
			this.gl = this.canvas.getContext('webgl', attrs) || this.canvas.getContext('experimental-webgl', attrs);

		// gl
		var gl = this.gl;
		var vertices = [1.0, 1.0, 0.0,
					   	0.0,1.0,0.0,
					   	1.0,0.0,0.0];
		
		this.vboStatic = gl.createBuffer();
		this.vboDynamic = gl.createBuffer();
		this.vboStream = gl.createBuffer();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vboStatic);
		gl.bufferData(gl.GL_ARRAY_BUFFER, vertices.length, vertices, gl.STATIC_DRAW);
		
		
		this.setClearColor(0x3a, 0x54, 0x93);
		this.addLostContextListener(function(lostContext) {
			console.log("raw");
		});
		
		// 
		window.addEventListener("resize", function() {
			self.aspectRatio = window.innerWidth/window.innerHeight;
			self.canvas.width = window.innerWidth;
			self.canvas.height = window.innerHeight;
		});
		console.log("Graphics.js created new canvas with %s context", opts.useGl2 ? "WebGL2" : "WebGL");
		console.log("Graphics instance: ", this);
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
		console.log(r, g, b, a);
		this.gl.clearColor(r/0xff, g/0xff, b/0xff, a/0xff);
	};

	Graphics.prototype.clear = function() {
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	};

	window.export = {Graphics};

})();