(function() {
/* loads resources in fifo order
*/
function Loader(loader) {
	var self = this;
	
	if (loader) {
		this.resources = new Map(loader.resources);
		this.import = Object.assign({}, loader.import);
	}
	else {
		this.resources = new Map();
		this.import = Object.create({});
	}
};
Loader.prototype.get = function(name) {
	return this.resources.get(name) || null;// || {filename: null, data: null};
};

Loader.prototype.load = function(sources, fnOnDone, fnOnLoad, fnNotFound) {
	var self = this;
	function onNext(fnOnNext, found, type, data) {
		if (found && typeof fnOnLoad == "function") {
			fnOnLoad(type, data);
		}
		if (!found) {
			fnNotFound(type.substr(0, type.indexOf("?")));
		}
		if (typeof fnOnNext == "function")
			fnOnNext();
	};
	function onDone() {
		if (typeof fnOnDone == "function")
			fnOnDone(self);
	};
	function addResource(filename, data) {
		self.resources.set(filename, {
			filename: filename, 
			data: data
		});
	};
	function getJson(url, filename, fnNext) {
		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.responseType = "json";
		req.onerror = function(error) {
			//console.trace("onerror @getJson: ", error);
			onNext(fnNext, false, url);
		};
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) {
				var data = null;
				try {
					data = JSON.parse(JSON.stringify(req.response));
					addResource(filename, data);
				}
				catch (e) {
					console.error(e);
				}
				finally {
					onNext(fnNext, true, "json", filename);
				}
			};
			if (req.status == 404) {
				if (typeof fnNext == "function")
					fnNext();
			};
		};
		req.send();
	};
	function getScript(url, filename, fnNext) {
		var element = document.createElement("script");
		element.type = "application/javascript";
		element.onerror = function(error) {
			//console.log("onerror @getScript: ", error);
			onNext(fnNext, false, url);
		};
		element.onload = function(event) {
			self.import = Object.assign(self.import, window.export);
			onNext(fnNext, true, "script", filename);
		};
		element.src = url;
		document.head.appendChild(element);
	};
	function getStyle(url, filename, fnNext) {
		var element = document.createElement("link");
		element.rel = "stylesheet";
		element.type = "text/css";
		element.onerror = function(error) {
			//console.log("onerror @getStyle: ", error);
			onNext(fnNext, false, url);
		};
		element.onload = function(event) {
			onNext(fnNext, true, "style", filename);
		};
		element.href = url;
		document.head.appendChild(element);
	};
	function getImage(url, filename, fnNext) {
		var element = document.createElement("img");
		element.style.display = "none";
		element.onerror = function(error) {
			//console.log("onerror @getImage: ", error);
			onNext(fnNext, false, url);
		};
		element.onload = function(event) {
			addResource(filename, element);
			onNext(fnNext, true, "image", filename);
		};
		element.src = url;
		document.body.appendChild(element);
	};
	function getAudio(url, filename, fnNext) {
		var element = document.createElement("audio");
		element.style.display = "none";
		element.onerror = function(error) {
			//console.log("onerror @getAudio: ", error);
			onNext(fnNext, false, url);
		};
		element.oncanplaythrough = function(event) {
			element.oncanplaythrough = null;
			this.play(); // cache audio
			this.pause();
			addResource(filename, element);
			onNext(fnNext, true, "audio", filename);
		};
		element.src = url;
		document.body.appendChild(element);
	};
	function getData(url, filename, fnNext) {
		var req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.responseType = "arraybuffer";
		req.onerror = function(error) {
			//console.log("onerror @getData: ", error);
			onNext(fnNext, false, url);
		};
		req.onreadystatechange = function() {
			if (req.readyState == 4 && req.status == 200) {
				addResource(filename, req.response);
				onNext(fnNext, true, "data", filename)//{filename: filename, data: req.response});
			};
			if (req.status == 404) {
				onNext(fnNext);
			};
		};
		req.send();
	};
	function load(sources, fnOnDone) {
		if (sources.length > 0) {
			var date = new Date().getTime();
			var source = sources.pop();
			var url = `${source}?v=${date}`;
			var filename = source.split(/[\/\\]/g).pop();
			if (self.resources.get(filename)) {
				console.warn("duplicate resource: %s", filename);
				return load(sources, fnOnDone);
			}
			switch(filename.split(/[.]/g).pop()) {
				case "json": {
					getJson(url, filename, function() {
						load(sources, fnOnDone);
					});
					break;
				}
				case "js": {
					getScript(url, filename, function() {
						load(sources, fnOnDone);
					});
					break;
				}
				case "css": {
					getStyle(url, filename, function() {
						load(sources, fnOnDone);
					});
					break;
				}
				case "png":
				case "jpg":
				case "jpeg": {
					getImage(url, filename, function() {
						load(sources, fnOnDone);
					});
					break;
				}
				case "ogg":
				case "mp3":
				case "wav": {
					getAudio(url, filename, function() {
						load(sources, fnOnDone);
					});
					break;
				}
				default: {
					getData(url, filename, function() {
						load(sources, fnOnDone);
					});
					break;
				}
			}
		}
		else {
			onDone(fnOnDone);
			//if (typeof fnOnDone == "function")
			//	fnOnDone();
		}
	};
	var sourceList = sources.reverse();
	load(sourceList, fnOnDone);
};
	
window.Loader = Loader;
window.export = Object.create({});
})();