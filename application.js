(function() {
	// template application
	function MainApplication(loader) {
		var self = this;
		this.loader = new Loader(loader);
		this.animator = null;
		// load additional files
		this.loader.load(["lib/animator.js"], function(loader) {
			var {Animator} = loader.import;
			self.animator = new Animator(self.update, self.render);
			self.animator.animate();
			self.animator.showOverlay();
		});
	};
	
	MainApplication.prototype.update = function(context, elapsed) {
		//console.log("step...", context, dt);
	};

	MainApplication.prototype.render = function(context, elapsed) {
		//console.log("render...", context, dt);
	};

	window.export = {
		MainApplication
	};
})();
