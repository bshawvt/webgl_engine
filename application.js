(function() {
	var gfx = null;
	// template application
	function MainApplication(loader) {
		var self = this;
		this.loader = new Loader(loader);
		this.animator = null;
		this.graphics = null;
		this.loader.load(["lib/vertex.shader", "lib/fragment.shader", 
						  "lib/animator.js", "lib/graphics.js", 
						  "data/sulphur.ovo", "data/test.ovo", 
						  "lib/ovo_importer.js"],
		function(loader) {
			console.log("ondone");
			self.initialize(loader);
		});/*,
		function(filename) {
			console.log("onload", filename);
		},
		function(filename) {
			console.log("error", filename); 
		});*/
		console.log(this);
	};
	
	MainApplication.prototype.initialize = function(loader) {
		var self = this;
		//try {
		var {Animator, Graphics, OvoLoader} = loader.import;
		var importer = new OvoLoader();
		//console.log(ovoimporter.load(this.loader.get("sulphur.ovo").data));
		this.graphics = gfx = new Graphics({loader: loader});
		
		// import meshes and convert to models 
		loader.resources.forEach(function(resource) {
			var ext = resource.extension.toLowerCase();
			if (ext == "ovo") {
				var mesh = importer.parse(resource.data);
				if (mesh.metadata && mesh.metadata.ovo_version == "1")
					gfx.createModel(importer.parse(resource.data), resource);
				else
					console.warn("bad ovo mesh");
			}
		});


		this.animator = new Animator(function(animator, elapsed) {
			self.update(animator, elapsed);
		}, function(animator, elapsed) {
			self.render(animator, elapsed);
		});
		// todo: this overlay is messy
		this.animator.showOverlay();

		// webgl setup
		//console.log(this.graphics);


		// begin
		this.animator.animate();
		//}
	//	catch (e) {
//			console.trace("application.js error: %s", e);
		//}
	};
	
	MainApplication.prototype.update = function(context, elapsed) {
		//
		
	};

	MainApplication.prototype.render = function(context, elapsed) {
		this.graphics.clear();
		//this.graphics.drawModel(this.loader.get("triangles"));
	};

	window.export = {
		MainApplication
	};
})();
