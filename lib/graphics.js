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
			xrCompatible: true,
			*/
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

		// some webgl settings
		this.setClearColor(0x3a, 0x54, 0x93);
		
		// 
		window.addEventListener("resize", function() {
			self.aspectRatio = window.innerWidth/window.innerHeight;
			self.canvas.width = window.innerWidth;
			self.canvas.height = window.innerHeight;
		});
		console.log("Graphics.js created new canvas with %s context", opts.useGl2 ? "WebGL2" : "WebGL");
	};
	
	Graphics.prototype.addLostContextListener = function(fnOnContextLost) {
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