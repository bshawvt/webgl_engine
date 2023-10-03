(function() {
	var gfx = null;
	// template application
	function MainApplication(loader) {
		var self = this;
		this.loader = new Loader(loader);
		this.animator = null;
		this.graphics = null;

		this.loader.load(["lib/vertext.shader", "lib/fragment.shader", 
						  "lib/animator.js", "lib/graphics.js"], 
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
		try {

			var {Animator, Graphics} = this.loader.import;
			this.graphics = new Graphics(this);
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
		}
		catch (e) {
			console.error("application.js error: %s", e);
		}
	};
	
	MainApplication.prototype.update = function(context, elapsed) {
		//
		
	};

	MainApplication.prototype.render = function(context, elapsed) {
		this.graphics.clear();
	};

	window.export = {
		MainApplication
	};
})();
