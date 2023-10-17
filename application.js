(function() {
	var gfx = null;
	// template application
	function MainApplication(loader) {
		var self = this;
		this.loader = new Loader(loader);
		this.animator = null;
		this.graphics = null;
		this.loader.load(["lib/vertex.shader", "lib/fragment.shader", 
						  "lib/animator.js", "lib/graphics.js", "data/test.ovo", "lib/ovo_importer.js"],
		function(loader) {
			console.log(loader);
			self.init();
		},
		function(filename) {
			console.log("onload", filename);
			
		},
		function(filename) {
			console.log("error", filename); 
		});
	};
	
	MainApplication.prototype.init = function() {
		var self = this;
		//try {
			var {Animator, Graphics, OvoLoader} = this.loader.import;
			var ovoimporter = new OvoLoader();
			console.log(ovoimporter.load(this.loader.get("test.ovo").data));
			this.graphics = new Graphics({loader: this.loader});
			gfx = this.graphics.gl;
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
		this.graphics.drawModel(this.loader.get("triangles"));
	};

	window.export = {
		MainApplication
	};
})();
