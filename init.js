(function () {
	var sources = ["application.js"]
	document.addEventListener("DOMContentLoaded", function() {
		new Loader().load(sources,
		// onDone
		function(loader) {
			console.log("minimum resources loaded...", loader);
			try {
				var {MainApplication} = loader.import;
				new MainApplication(loader);
			}
			catch (e) {
				console.error("init.js error:", e);
			}
		},
		// onLoad
		function(type, name) {
			console.log("application.js loaded %s -> %s", type, name);
			
		},
		// onError
		function(url) {
			console.log("resource failed to load: %s", url);
		});
	});
})();
