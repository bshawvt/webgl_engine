(function() {
	// Canvas draw things i guess
	function Animator() {
		var self = this;
		//this.aspectRatio = window.innerWidth/window.innerHeight;
		this.animating = false; // toggle state
		//this.canvas = document.createElement("canvas");
		//this.canvas.className = "fullscreen";
		//this.context = null;
		this.overlay = null; // tools overlay
		this.parent = parent;
		// loop timing
		this.frame = {
			elapsed: 0, // start of frame
			stepTime: 0, // incremental frame time
			timestep: 1000/30 // 33.33336
		}
		this.metrics = {
			frameRate: 0,
			elapsed: 0,
			frameCount: 0,
			framesPerSecond: 0
		}
		//var profile = {average: 0, min: 0, max: 0};
		//document.body.appendChild(this.canvas);
		
		/*window.addEventListener("resize", function() {
			self.aspectRatio = window.innerWidth/window.innerHeight;
			self.canvas.width = window.innerWidth;
			self.canvas.height = window.innerHeight;
		});*/

	};
	Animator.prototype.overlayUpdate = function(elapsed) {
		var str = [`clock: ${elapsed}`,
				  `${performance.now()}`,
				  `framesPerSecond: ${this.metrics.framesPerSecond}`,
				  `frameTime: ${this.metrics.elapsed}`,
				  `frameCount: ${this.metrics.frameCount}`,
				  `stepTime: ${this.frame.stepTime}`,
				  `frameRate: ${this.metrics.frameRate}`];
		this.overlayDiv.innerText = str.join("\n");
	};
	Animator.prototype.showOverlay = function() {
		var self = this;
		if (this.overlay)
			this.overlay.remove();
		this.overlayed = true;
		this.overlay = document.createElement("div");
		this.overlay.setAttribute("id", "overlay");
		this.overlay.className = "absolute";

		// overlay things
		var metrics = document.createElement("div");
		this.overlayDiv = document.createElement("div");
		
		var btnAnimate = document.createElement("button");
		btnAnimate.appendChild(document.createTextNode("animator"));
		btnAnimate.onclick = function() {
			self.animating = !self.animating;
			if (self.animating) {
				self.animate(0);
				btnAnimate.innerText = "animator stop";
			}
			else {
				btnAnimate.innerText = "animator start";
			}

		};
		metrics.appendChild(this.overlayDiv);
		this.overlay.appendChild(btnAnimate);
		this.overlay.appendChild(metrics);

		//
		document.body.appendChild(this.overlay);
	};
	Animator.prototype.update = function(renderer, dt) {
		return false;
	};
	Animator.prototype.render = function(renderer, dt) {
		return false;
	};
	Animator.prototype.onUpdate = function(fnUpdate) {
		this.update = fnUpdate;
	};
	Animator.prototype.onRender = function(fnRender) {
		this.render = fnRender;
	};
	Animator.prototype.animate = function(elapsed) {
		var self = this;

		while(this.frame.stepTime < elapsed) {
			this.update(this, elapsed);
			this.frame.stepTime += this.frame.timestep;
		}
		this.render(this, elapsed);
		if (this.overlayed) this.overlayUpdate(elapsed);
		
		// request next frame comes after everything else
		window.requestAnimationFrame(function(elapsed) {
			if (!self.animating) return;
			if (elapsed > self.frame.stepTime + 1000) {
				console.log("skipping frame");
				self.frame.stepTime = elapsed;
			}

			self.animate(elapsed);

			// metric handling
			if (elapsed > self.metrics.elapsed + 1000) {
				self.metrics.elapsed = elapsed;
				self.metrics.framesPerSecond = self.metrics.frameCount;
				self.metrics.frameCount = 0;
			}
			self.metrics.frameCount++;
			self.metrics.frameRate = (elapsed - self.frame.elapsed);
			self.frame.elapsed = performance.now();
		});
	};

	window.export = {
		Animator
	};

})();