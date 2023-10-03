(function() {
	
	function Loader(loader) {
		var self = this;

		if (loader) {
			this.resources = new Map(loader.resources);
			this.import = Object.assign({}, loader.import);
		}
		else {
			this.resources = new Map();
			this.import = Object.create({});
		};
		this.loadIndex = 0;
		this.loadLength = 0;
	};
	Loader.prototype.get = function(name) {
		return this.resources.get(name) || null;
	};
	Loader.prototype.load = function(sources, fnOnDone, fnOnLoad, fnNotFound) {
		var self = this
		this.loadLength = sources.length;
		this.loadIndex = 0;
		
		sources.forEach(function(item) {
			console.log("loading filepath: %s", item);
			load(item);
		});
		
		function load(path) {
			//if (!sources.length)
			//	return; //fnOnDone(self);
			//var path = sources.pop();
			var time = new Date().getTime();
			var url = `${path}?v=${time}`;
			var filename = path.split(/[\/\\]/g).pop();
			console.log("load('%s')", url);
			if (self.resources.get(filename))
				return console.warn("duplicate resource: %s", filename);
			switch(filename.split(/[.]/g).pop()) {
				case "json": {
					getJson(url, filename);
					break;
				}
				case "js": {
					getScript(url, filename);
					break;
				}
				case "css": {
					getStyle(url, filename);
					break;
				}url
				case "png":
				case "jpg":
				case "jpeg": {
					getImage(url, filename);
					break;
				}
				case "ogg":
				case "mp3":
				case "wav": {
					getAudio(url, filename);
					break;
				}
				default: {
					getData(url, filename);
					break;
				}
			}
				
		};
		function addResource(filename, data) {
			self.resources.set(filename, {
				filename: filename, 
				data: data
			});
		};
		function onNext(name, found) {
			self.loadIndex++;
			if (typeof fnOnLoad == "function" && found)
				fnOnLoad(name);
			if (typeof fnNotFound == "function" && !found)
				fnNotFound(name);
			if (typeof fnOnDone == "function" && 
				self.loadIndex == self.loadLength) {
				fnOnDone(self);
			}
		};
		function getJson(url, filename) {
			var req = new XMLHttpRequest();
			req.open("GET", url, true);
			req.responseType = "json";
			req.onerror = function(error) {
				//console.trace("onerror @getJson: ", error);
				onNext(filename, false);
			};
			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					if (req.status == 404)
						return onNext(filename, false);
					if (eq.status == 200) {
						var data = null;
						try {
							data = JSON.parse(JSON.stringify(req.response));
							addResource(filename, data);
						}
						catch (e) {
							console.error(e);
						}
						finally {
							onNext(filename, true);
						}
					}
				};
			};
			req.send();
		};
		function getData(url, filename) {
			var req = new XMLHttpRequest();
			req.open("GET", url, true);
			req.responseType = "arraybuffer";
			req.onerror = function(error) {
				//console.log("onerror @getData: ", error);
				onNext(filename, false);
			};
			req.onreadystatechange = function() {
				//console.log("onreadystatechange: %s", filename, req.status, req.readyState);
				if (req.readyState == 4) {
					if (req.status == 404)
						return onNext(filename, false);
					if (req.status == 200) {
						addResource(filename, req.response);
						onNext(filename, true);
					}
				};
			};
			req.send();
		};
		function getScript(url, filename) {
			var element = document.createElement("script");
			element.type = "application/javascript";
			element.onerror = function(error) {
				//console.log("onerror @getScript: ", error);
				onNext(filename, false);
			};
			element.onload = function(event) {
				self.import = Object.assign(self.import, window.export);
				onNext(filename, true);
			};
			element.src = url;
			document.head.appendChild(element);
		};
		function getStyle(url, filename) {
			var element = document.createElement("link");
			element.rel = "stylesheet";
			element.type = "text/css";
			element.onerror = function(error) {
				onNext(filename, false);
				//console.log("onerror @getStyle: ", error);
			};
			element.onload = function(event) {
				onNext(filename, true);
			};
			element.href = url;
			document.head.appendChild(element);
		};
		function getImage(url, filename) {
			var element = document.createElement("img");
			element.style.display = "none";
			element.onerror = function(error) {
				onNext(filename, false);
				//console.log("onerror @getImage: ", error);
			};
			element.onload = function(event) {
				onNext(filename, true);
				addResource(filename, element);
			};
			element.src = url;
			document.body.appendChild(element);
		};
		function getAudio(url, filename) {
			var element = document.createElement("audio");
			element.style.display = "none";
			element.onerror = function(error) {
				onNext(filename, false);
				//console.log("onerror @getAudio: ", error);
			};
			element.oncanplaythrough = function(event) {
				element.oncanplaythrough = null;
				this.play(); // cache audio
				this.pause();
				addResource(filename, element);
				onNext(filename, true);
			};
			element.src = url;
			document.body.appendChild(element);
		};
	};

	
	window.Loader = Loader;
	window.export = Object.create({});
})();