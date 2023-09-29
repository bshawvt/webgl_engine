(function() {
	// Canvas draw things i guess
	function Animator(fnOnUpdate, fnOnRender) {
		var self = this;
		this.animating = false; // toggle state
		this.overlay = null;
		this.frame = {
			elapsed: 0, // start of frame
			stepTime: 0, // incremental frame time
			timestep: 1000/30 // 33.33336
		}
		this.metrics = {
			frameTime: 0, // 
			elapsed: 0,//performance.now(),
			frameCount: 0,
			framesPerSecond: 999999,
			max: 0,
			average: 0,
			averages: []
		}
		if (fnOnUpdate)
			self.onUpdate(fnOnUpdate);
		if (fnOnRender)
			self.onRender(fnOnRender);
	};
	Animator.prototype.overlayUpdate = function(elapsed) {
		var str = ["[metrics]",
				  `elapsed: ${elapsed}`,
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
	Animator.prototype.getMetrics = function() {
		return this.metrics;
	};
	Animator.prototype.animate = function(now) {
		var self = this;

		while(this.frame.stepTime < now) {
			this.update(this, now);
			this.frame.stepTime += this.frame.timestep;
		}
		this.render(this, now);
		if (this.overlayed) this.overlayUpdate(now);
		
		// nothing comes after the next frame request
		window.requestAnimationFrame(function(now) {
			if (!self.animating) return;
			if (now > self.frame.stepTime + 1000)
				self.frame.stepTime = now;

			self.animate(now);

			// todo: this is probably terrible metric handling
			if (now > self.metrics.elapsed + 1000) {
				self.metrics.elapsed = now;
				self.metrics.framesPerSecond = self.metrics.frameCount;
				self.metrics.frameCount = 0;
				if (self.metrics.max < self.metrics.framesPerSecond)
					self.metrics.max = self.metrics.framesPerSecond;
				if (self.metrics.min > self.metrics.framesPerSecond)
					self.metrics.min = self.metrics.framesPerSecond;
				self.metrics.averages.push(self.metrics.framesPerSecond);
				if (self.metrics.averages.length > 5) {
					var avg = 0;
					for(var i = 0; i < self.metrics.averages.length; i++)
						avg += self.metrics.averages[i];
					self.metrics.average = avg / self.metrics.averages.length;
					self.metrics.averages = [];
				};
			}
			self.metrics.frameCount++;
			self.metrics.frameTime = (now - self.frame.elapsed);
			self.frame.elapsed = performance.now();
		});
	};

	window.export = {
		Animator
	};

})();