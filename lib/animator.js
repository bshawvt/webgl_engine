(function() {
	// Canvas draw things i guess
	function Animator(fnOnUpdate, fnOnRender) {
		var self = this;
		this.animating = false; // toggle state
		this.overlay = null;
		this.gatherMetrics = false;
		this.frame = {
			timestep: 1000/30, // 33.333336
			stepTime: 0, // incremental time from previous frame
		}
		this.metrics = {
			elapsed: 0, //
			next: 0, // now + ms
			framerate: 0, // 1000 / frameTime
			frameTime: 0, // now - elapsed
			steps: 0, // number of update iterations per second
			avg: 0 // average framerate
		}

		if (fnOnUpdate)
			self.onUpdate(fnOnUpdate);
		if (fnOnRender)
			self.onRender(fnOnRender);
	};
	Animator.prototype.overlayUpdate = function(elapsed) {
		var str = ["[metrics]",
					`performance.now: ${performance.now()}`];
		for(var name in this.metrics) {
			str.push(`${name}: ${this.metrics[name]}`);
		}
		str.push("[frame]");
		for(name in this.frame) {
			str.push(`${name}: ${this.frame[name]}`);
		}
		this.overlayDiv.innerText = str.join("\n");
	};
	Animator.prototype.showOverlay = function() {
		var self = this;
		if (this.overlay)
			this.overlay.remove();
		this.gatherMetrics = true;
		this.overlayed = true;
		this.overlay = document.createElement("div");
		this.overlay.style.position = "absolute";
		this.overlay.style.top = "0px";
		this.overlay.style.left = "0px";
		this.overlay.style.minWidth = "50px";
		this.overlay.style.minHeight = "50px";
		this.overlay.style.width = "300px";
		this.overlay.style.overflow = "scroll";
		this.overlay.style.resize = "both";
		this.overlay.style.backgroundColor = "#a0a0a9";
		this.overlay.style.border = "1px solid #000";
		this.overlay.style.zIndex = "10";

		var btnAnimate = document.createElement("button");
		var btnStates = ["animator start", "animator stop"];

		btnAnimate.appendChild(document.createTextNode(btnStates[self.animating % btnStates.length]));
		btnAnimate.onclick = function() {
			self.animating = !self.animating;
			btnAnimate.innerText = btnStates[self.animating % btnStates.length];
			if (self.animating) {
				self.animate(0);
			}
		};
		this.overlayDiv = document.createElement("div");
		this.overlay.appendChild(btnAnimate);
		this.overlay.appendChild(this.overlayDiv);
		document.body.appendChild(this.overlay);
	};
	// update & render 
	Animator.prototype.update = function(animator, dt) {
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
	Animator.prototype.getMetrics = function() {
		return this.metrics;
	};

	Animator.prototype.animate = function(now) {
		var self = this;

		while(this.frame.stepTime < now) {
			this.update(this, now);
			this.frame.stepTime += this.frame.timestep;
			this.metrics.steps++;
		}
		this.render(this, now);

		// nothing comes after the next frame request
		window.requestAnimationFrame(function(now) {
			if (!self.animating) return;
			if (now > self.frame.stepTime + 1000)
				self.frame.stepTime = now;
			self.animate(now);
			
			// todo: this is probably terrible metric handling
			if (self.gatherMetrics) {
				if (now > self.metrics.next) {
					self.metrics.next = now + 1000;
					self.metrics.avg = self.metrics.avg / self.metrics.frames;
					if (self.overlayed) self.overlayUpdate();
					// resets
					self.metrics.frames = 0;
					self.metrics.steps = 0;
					self.metrics.avg = 0;
				}
				self.metrics.frameTime = now - self.metrics.elapsed;
				self.metrics.framerate = 1000 / self.metrics.frameTime;
				self.metrics.frames++;
				self.metrics.avg += self.metrics.framerate;
				self.metrics.elapsed = now;
			}
		});
	};

	window.export = {
		Animator
	};

})();