(function() {
	// template application
	function MainApplication(loader) {
		var self = this;
		this.loader = new Loader(loader);
		this.animator = null;
		this.graphics = null;

		this.loader.load(["lib/animator.js", "lib/graphics.js"], function(loader) {
			self.init();
		});
	};
	
	MainApplication.prototype.init = function() {
		var self = this;
		var {Animator, Graphics} = this.loader.import;
		this.graphics = new Graphics(this);
		this.animator = new Animator(function(animator, elapsed) {
			self.update(animator, elapsed);
		}, function(animator, elapsed) {
			self.render(animator, elapsed);
		});
		// todo: this overlay is messy
		this.animator.showOverlay();

		// webgl setup
		
		// begin
		this.animator.animate();
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
