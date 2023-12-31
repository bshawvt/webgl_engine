/* todo: at some point anything between ` and ` should be styled 
	\xa0 = space
*/
window.docs = Object.create({
	//
	"init.js": "Document entry point template that loads a minimum set of files.\n\nThe variable `sources` \
		(init.js:2) is an Array of URIs that will be loaded before the template application starts.\n \
		After all resources are loaded this script will create a new instance of MainApplication (application.js).",

	"application.js": "A template that tries to use all pieces of this project together.\n\n \
		Exports as `MainApplication` and initialized by init.js.",

	"lib/animator.js": "A class that wraps `requestAnimationFrame` and executes `Animator.update` \
		at a fixed constant rate while executing `Animator.render` as quickly as possible.\n\n \
		Render and update methods are user defined and must be set either through the Animator constructor \
		or through `Animator.onRender` & `Animator.onUpdate` methods.\n\n \
		\
		Example usage:\n \
		`var anim = new Animator(fnRender, fnUpdate);\n \
		anim.animate();`\n\n \
		\
		Constructor::Animator(`fnUpdate?` => Function, `fnRender?` => Function):\n \
		\xa0\xa0\xa0\xa0 Both params are optional and overwrite their respective prototypes.\n\n \
		\
		Animator.animate(`elapsed` => Float):\n \
		\xa0\xa0\xa0\xa0 A non-blocking loop that executes update and render methods. Returns undefined.\n\n \
		\
		Animator.onUpdate(`fnUpdate` => Function):\n \
		\xa0\xa0\xa0\xa0 Set an application defined update function. Returns undefined.\n \
		\xa0\xa0\xa0\xa0 fnUpdate(`animator` => Animator, `now` => Float): Executed at a fixed \
		rate before render.\n\n \
		\
		Animator.onRender(`fnRender` => Function):\n \
		\xa0\xa0\xa0\xa0 Set an application defined render function. Returns undefined.\n \
		\xa0\xa0\xa0\xa0 fnRender(`animator` => Animator, `now` => Float): Executed as quickly as \
		possible after render.\n\n \
		\
		Animator.getMetrics():\n \
		\xa0\xa0\xa0\xa0 Returns an object full of metrics.\n\n",

	"lib/graphics.js": "A graphics class that creates and manages a WebGL context. \
		Provides methods for drawing to and manipulating the new context.\n\n \
		\
		Example usage:\n \
		`var g = new Graphics();\n \
		g.clear();`\n\n \
		\
		Constructor::Graphics(`opts?` => Object):\n \
		\xa0\xa0\xa0\xa0 The optional `opts` param is used to specify the context's initial states \
		such as glClear color. The `opts` object supports the following properties:\n \
		`{`\n \
		`\xa0\xa0\xa0\xa0 useGl2` => Boolean: Create a WebGl2 context.\n \
		`\xa0\xa0\xa0\xa0 ` => ?: ?.\n \
		`}`\n \
		\
		\n\n \
		\
		Graphics.setClearColor(`rgba` => String):\n \
		Graphics.setClearColor(`red` => Unsigned Byte, `green` => Unsigned Byte, `blue` => Unsigned Byte, `alpha` => Unsigned Byte):\n \
		\xa0\xa0\xa0\xa0 Set the clear color used by glClear. If the type of the first param is \
		a String then the `0xRRGGBB`, `0xRRGGBBAA` notation is expected. Returns undefined.\n\n \
		\
		\
		\
		",

	"lib/loader.js": "A class that dynamically imports scripts and media into the active document in a first in first out order.\n\n\
		Images, audio, json, and other binary files are imported as Resource objects. \
		Resources can be retrieved with the `Loader.get` method.\n \
		Dynamically imported scripts are supported but if a script inherits from any other script then \
		load order becomes important. When scripts are imported with a closure the global window \
		objects `export` property can be used to encapsulate any script content and later imported \
		through `Loader.import`. Eg, the script should contain a line similar to `window.export = {MyClass, MyData}`.\n\n \
		\
		Example usage:\n \
		`new Loader().load('myclass.js', 'path/item.png', function(loader) { \n\
		\xa0\xa0\xa0\xa0 var {MyClass, MyItems} = loader.import; // import classes\n \
		\xa0\xa0\xa0\xa0 var mc = new MyClass();\n \
		\xa0\xa0\xa0\xa0 console.log(loader.get('item.png'));\n \
		});`\n\n \
		\
		Constructor::Loader(`loader?` => Loader):\n \
		\xa0\xa0\xa0\xa0 If the optional `loader` param is defined then any previous resources \
		will be appended to the new Loader instance.\n\n \
		\
		Loader.load(`src` => Array, `fnOnDone?` => Function, `fnOnLoad?` => Function, `fnOnError?` => Function):\n \
		\xa0\xa0\xa0\xa0 Loads a list of URI references and executes callbacks when appropriate. Returns undefined.\n \
		\xa0\xa0\xa0\xa0 fnOnDone(`loader` => Loader): Optional. Executed after all URI references have had a chance to load.\n \
		\xa0\xa0\xa0\xa0 fnOnLoad(`type` => String, `name` => String): Optional. Executed after a URI reference has loaded.\n \
		\xa0\xa0\xa0\xa0 fnOnError(`url` => String): Optional. Executed when a URI reference fails to load.\n\n \
		\
		Loader.get(`filename` => String):\n \
		\xa0\xa0\xa0\xa0 Expects filename to be trimmed. Eg, `filename.png` instead of `path/filename.png`. Returns Resource or null.\n\n \
		A Resource object is defined as: `{ filename: String, extension: String, data: Ambiguous }`\nA Resource object will always \
		contain the `filename`, `extension`, and `data` properties which are often used internally. \
		It may also contain application defined properties and the application may overwrite and reuse the `data` property.\n\n"
});