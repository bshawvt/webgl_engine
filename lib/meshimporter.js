(function() {
	function MeshImporter() {
		this.decoder = new TextDecoder();
	};
	MeshImporter.prototype.decoder = null;
	window.export = {MeshImporter};
})();