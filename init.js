(function () {
	var sources = ["application.js"]
	document.addEventListener("DOMContentLoaded", function() {
		new Loader().load(sources,
		// onDone
		function(loader) {
			console.log("minimum resources loaded...", loader.import);
			try {
				var {MainApplication} = loader.import;
				new MainApplication(loader);
			}
			catch (e) {
				console.error("init.js error:", e);
			}
		},
		// onLoad
		function(filename) {
			console.log("init.js loaded %s", filename);
			
		},
		// onError
		function(filename) {
			console.log("resource failed to load: %s", filename);
		});
	});
})();
