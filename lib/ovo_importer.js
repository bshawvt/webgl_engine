(function() {
	function OvoLoader() {
		this.decoder = new TextDecoder();
	};
	OvoLoader.prototype.load = function(resource) {
		var metadata = Object.create(null);
		var vertex_groups = new Array();
		var vertices = new Array();
		var primitive_groups = new Array();
		var vertex_relation = new Array();
		var primitive_lists = new Array();
		var characters = this.decoder.decode(resource);

		function toNewLine(data, index) {
			//console.log(index, data[index]);
			while (index < data.length && data[index] != '\n') {
				//console.log(data[index]);
				index++;
			}
			//console.log(index, data[index]);
			return index - 1;
		};

		function trim(data, index) {
			//console.log(index, data[index]);
			while (index < data.length && data[index] == ' ' || data[index] == '\t')
				index++;
			//console.log(index, data[index]);
			return index - 1;
		};

		// remove comments
		var buffer = "";
		var trimmed = "";
		var index = 0;
		while(index <= characters.length) {
			var ch = characters[index];
			if (ch == '\n' || index == characters.length) {
				if (buffer.length > 0) {
					trimmed += buffer;
					trimmed += '\n';
				}
				buffer = "";
			}
			else if (ch == '#') { // DESTROY!
				index = toNewLine(characters, index);
			}
			else if (ch == ';') { // ANNIHILATe!!1
				buffer = "";
			}
			else if (ch == ' ' || ch == '\t') { // CAsuaLtY of war!
				if (buffer.length > 0)
					buffer += ch;
				else
					index = trim(characters, index);
			}
			else
				buffer += ch;
			index++;
		}
		function getMetadata(group, data, index) {
			var buffer = "";
			var rowCount = -1;
			var rowNumber = 0;
			var key = "";
			while(index <= data.length) {
				var ch = data[index];
				if (ch == '\n') {
					if (buffer.length > 0) {
						if (rowCount == -1) {// line is start of metadata and row #s needs to be set here
							rowCount = parseInt(buffer) || 0;
							if (rowCount == 0) {
								buffer = "";
								return index;
							}
						}
						else { // 
							group[key] = buffer;
							rowNumber++;
							if (rowNumber == rowCount) {
								buffer = "";
								return index;
							}
						}
					}
					key = "";
					buffer = "";
				}
				else if (ch == ':') {
					if (rowCount == -1)
						throw `parse error at line: unexpected :`;
					key = buffer;
					buffer = "";
				}
				else if (ch == '\t' || ch == ' ') {
					if (buffer.length > 0) {
						if (rowCount == -1) {// line is start of metadata and row #s needs to be set here
							rowCount = parseInt(buffer) || 0;
							if (rowCount == 0) {
								buffer = "";
								return index;// + 1;
							}
							buffer = "";
						}
						else
							buffer += ch;
					}
					index = trim(data, index);
				}
				else
					buffer += ch;
				index++;
			}
			return index;
		};
		function getGroup(group, data, index) {
			var rowCount = -1;
			var rowNumber = 0;
			while(index <= data.length) {
				var ch = data[index];
				if (ch == '\n') {
					if (buffer.length > 0) {
						if (rowCount == -1) {// line is start of metadata and row #s needs to be set here
							rowCount = parseInt(buffer) || 0;
							if (rowCount == 0) {
								buffer = "";
								return index;
							}
						}
						else { //
							rowNumber++;
							group.push(buffer);
							if (rowNumber == rowCount) {
								buffer = "";
								return index;
							}
						}
					}
					buffer = "";
				}
				else if (ch == '\t' || ch == ' ') {
					if (buffer.length > 0) {
						if (rowCount == -1) {// line is start of metadata and row #s needs to be set here
							rowCount = parseInt(buffer) || 0;
							buffer = "";
							if (rowCount == 0) {
								buffer = "";
								return index;
							}
						}
						else
							buffer += ch;
					}
					index = trim(data, index);
				}
				else
					buffer += ch;
				index++;
			}
			return index;
		};
		function getVertices(group, relationGroup, data, index) {
			var buffer = "";
			var attributeKey = "";
			var layoutState = 0;
			var groupState = 0;
			var attrIndex = 0; // group index
			var attrIndexCount = 0; // 
			var lineCount = 0;
			var lineIndex = 0;
			var attrTotal = 0; // total number of attributes per line
			var attrCount = 0; // number of attributes pushed into array this line
			var attrAccum = 0; // accumulation of attrCount
			while (index <= data.length) {
				var ch = data[index];
				if (ch == '\n') {
					if (layoutState == 2) { // finish layout with line number
						layoutState = 3;
						lineCount = parseInt(buffer) || 0;
					}
					else if (layoutState == 3) {
						attrAccum += attrCount;
						lineIndex++;
						attrCount = 0;
					}
					attrIndexCount = 0;
					attrIndex = 0;
					groupState = 0;
					buffer = "";
					if (attrAccum == attrTotal * lineCount)
						return index;
				}
				else if (ch == '[') {
					if (layoutState == 0) 
						layoutState = 1;
					else if (layoutState == 3) {
						if (!groupState)
							groupState = 1;
					}
				}
				else if (ch == ']') {
					if (layoutState == 1) {
						layoutState = 2;
						//push data
						var list = new Array();
						var count = parseInt(buffer) || 0;
						attrTotal += count;
						group.push({name: attributeKey, count: count, list: list});
						attributeKey = "";
					}
					else if (layoutState == 3) {
						if (groupState == 1) {
							groupState = 0;
							if (!relationGroup[lineIndex])
								relationGroup[lineIndex] = new Array();
							relationGroup[lineIndex].push(parseFloat(buffer));
						}
					}
					buffer = "";
				}
				else if (ch == ':') {
					if (buffer.length > 0) {
						if (layoutState == 1)
							attributeKey = buffer;
						else if (layoutState == 3) {
							// todo 

						}
					}
					buffer = "";
				}
				else if (ch == '\t' || ch == ' ') {
					if (layoutState == 1) {
						// push data
						var list = new Array();
						var count = parseInt(buffer) || 0;
						attrTotal += count;
						group.push({name: attributeKey, count: count, list: list});
						attributeKey = "";
					}
					else if (layoutState == 3) {
						if (groupState == 0) {
							// todo 
							group[attrIndex].list.push(parseFloat(buffer) || 0.0);
							attrIndexCount++;
							if (attrIndexCount == group[attrIndex].count) {// && attrIndex+1 <= group.length)
								attrIndexCount = 0;
								attrIndex++;
							}
							attrCount++;
						}
						else if (groupState == 1) {
							if (!relationGroup[lineIndex])
								relationGroup[lineIndex] = new Array();
							relationGroup[lineIndex].push(parseFloat(buffer));
						}
					}
					buffer = "";
					index = trim(data, index);
				}
				else
					buffer += ch;
				index++;
			}
			return index;
		};
		// todo: 
		function getPrimitiveLists(group, data, index) {
			var buffer = "";
			var state = 0; // primitive list parse state
			var primitiveName = "";
			var element = null; // reference to current primitive set
			var elementCount = 0;
			var elementSets = 0; // number of complete index sets that have been read
			var indices = 0; // # of sorted indices, indexCount < lineCount
			var indexCount = 0;
			while (index <= data.length) {
				var ch = data[++index];
				if (ch == '\n' || index == data.length) {
					if (buffer.length > 0) {
						if (state == 0) { // 1 set primitive groups element count
							state = 1;
							elementCount = parseInt(buffer) || 0;
						}
						else if (state == 4) { // 4 set number of indices
							state = 5;
							indexCount = parseInt(buffer) || 0;
							console.log("number of indices: ", indexCount);
							if (indexCount == 0)
								throw `parse error: index error`;
						}
						else if (state == 5) { // 5 get as index
							indices++;
							var val = parseInt(buffer) || 0;
							group[group.length - 1].list.push(val);
							console.log("index number: ", val);
							if (indices == indexCount) { // reset state to gather more primitives
								elementSets++;
								if (elementSets == elementCount) 
									return index;//console.log("done with primitives");
								state = 1;
								primitiveName = "";
								buffer = "";
								indices = 0;
							}
						}
					}
					buffer = "";
				}
				else if (ch == '[') { // 2
					if (state == 2) {
						state = 3
					}
					buffer = "";
				}
				else if (ch == ']') {
					if (state == 3) {
						state = 4;
						var item = parseInt(buffer) || 0;
						console.log("element group:", item);
						console.log(group[group.length - 1]);
						group[group.length - 1].group.push(item);
					}
					buffer = "";
				}
				else if (ch == '\t' || ch == ' ') {
					if (buffer.length > 0) {
						if (state == 1) { // 1 set primitive name
							state = 2;
							primitiveName = buffer;
							var list = new Array();
							var groupList = new Array();
							group.push({primitive: primitiveName, group: groupList, list: list})
							console.log(group.length);
							//element = element;
							console.log("primitiveName: ", primitiveName);
						}
						else if (state == 3) { // primitive group
							var item = parseInt(buffer) || 0;
							console.log("element group:", item);
							console.log(group[group.length - 1]);
							group[group.length - 1].group.push(item);
						}
						else if (state == 4) { // 4 set number of indices
							state = 5;
							indexCount = parseInt(buffer) || 0;
							console.log("number of indices: ", indexCount);
							if (indexCount == 0)
								throw `parse error: index error`;
						}
						else if (state == 5) { // 5 get as index
							indices++;
							var val = parseInt(buffer) || 0;
							group[group.length - 1].list.push(val);
							console.log("index number: ", val);
							if (indices == indexCount) { // reset state to gather more primitives
								elementSets++;
								if (elementSets == elementCount) 
									return index;
								state = 1;
								primitiveName = "";
								buffer = "";
								indices = 0;
							}
						}
					}
					buffer = "";
					index = trim(data, index);
				}
				else
					buffer += ch;
			}
			return index;
		};
		// 
		blockType = "";
		index = 0;
		while(index <= trimmed.length) {
			ch = trimmed[index];
			if (ch == '\n' || index == trimmed.length) {
				blockType = "";
			}
			else
				blockType += ch;
			index++;

			if (blockType == 'METADATA') {
				console.log("METADATA block");
				index = getMetadata(metadata, trimmed, index);
				blockType = "";
			}
			else if (blockType == 'VERTEX_GROUPS') {
				console.log("VERTEX_GROUPS block");
				index = getGroup(vertex_groups, trimmed, index);
				blockType = "";
			}
			else if (blockType == 'VERTICES') {
				console.log("VERTICES block");
				index = getVertices(vertices, vertex_relation, trimmed, index);
				blockType = "";
			}
			else if (blockType == 'PRIMITIVE_GROUPS') {
				console.log("PRIMITIVE_GROUPS block");
				index = getGroup(primitive_groups, trimmed, index);
				blockType = "";
			}
			else if (blockType == 'PRIMITIVE_LISTS') {
				console.log("PRIMITIVE_LISTS block");
				index = getPrimitiveLists(primitive_lists, trimmed, index);
				blockType = "";
			}
		}
		var r = {
			metadata: metadata,
			vertex_groups: vertex_groups,
			vertices: vertices,
			primitive_groups: primitive_groups,
			vertex_relation: vertex_relation,
			primitive_lists: primitive_lists
		};
		console.log(r);
		//console.log(r, trimmed);
	};
	// todo: multipass because because leading comments are hard
	OvoLoader.prototype.load4 = function(resource) {
		var metadata = Object.create(null);
		var vertex_groups = new Array();
		var vertices = new Array();
		var primitive_groups = new Array();
		var vertex_relation = new Array();
		var primitive_lists = null;//new Array();
		var characters = this.decoder.decode(resource);

		// behold the grand entrance of my 3̸̢̨̛͈̖͎̳̬̘̰̪̩͓͍̟̬͈̳̭͖͈͔͍̟̦̜͔͖͈̝͔͙̩̭̬̤͌̂͂̽̓͆͑̅͛̓̊̂̂̄͛͑͗̽̓̏̋̀̓͐̆̈̓̿͂̂͒͆̃͊̔̓̓̉̋̏̌͊̆̿̎͗̃̅̈́̊̀̀̎̐̂̏́̋̈́̀͐͐̃͒̄̀̈́̔̚̚̕̚͝͝ͅͅadness
		var lines = characters.split("\n");
		var trimmedLines = new Array();
		for (var i = 0; i < lines.length; i++) {
			var lc = lines[i].indexOf(';');
			var tc = lines[i].indexOf('#');
			if (lc != -1)
				lines[i] = lines[i].substr(lc + 1, lines[i].length); // trim leading comments
			if (tc != -1)
				lines[i] = lines[i].substr(0, tc); // trim trailing comments
			lines[i] = lines[i].trimStart();
			lines[i] = lines[i].trimEnd();
			if (lines[i].length == 0) continue;
			trimmedLines.push(lines[i]);
		};
		for(var i = 0; i < trimmedLines.length; i++) {
			var data = trimmedLines[i];
			
			// trim line before doing anything with it
			var lc = data.indexOf(';');
			var tc = data.indexOf('#');
			if (lc != -1)
				data = data.substr(lc + 1, data.length); // trim leading comments
			if (tc != -1)
				data = data.substr(0, tc); // trim trailing comments
			data = data.trimStart();
			data = data.trimEnd();
			if (data.length == 0) continue;

			// find group blocks
			var lineSplit = data.split(' ');
			var open = data.indexOf('[');
			var close = data.indexOf(']');
			var blockName = lineSplit[0].toLowerCase();
			
			// 
			//console.log(data);
			var rowCount = lineSplit[lineSplit.length - 1];
			if (blockName == "metadata") {
				console.log("found a metadata block");
				
			}
			else if (blockName == "vertex_groups") {
				console.log("found a vertex_groups block");
			}
			else if (blockName == "vertices") {
				console.log("found a vertices block with %i rows",rowCount, data, open, close, data.length);
				if (open != -1 && close != -1) {
					var contents = data.substring(open + 1, close);
					var attrs = contents.split(' ');
					for(var vi = 0; vi < attrs.length; vi++) {
						var split = attrs[vi].split(':');
						if (split.length == 2) {
							var rowElementCount = parseInt(split[1]) || 0;
							var list = new Array();
							vertices.push({
								type: split[0],
								count: rowElementCount,
								list: list
							});
						}
						else 
							throw `parse error: ${i}: attribute layout element error`;
					};
				}
				else
					throw `parse error:${i}: vertices missing attributes layout`;
			}
			else if (blockName == "primitive_groups") {
				console.log("found a primitive_groups block");
			}
			else if (blockName == "primitive_lists") {
				console.log("found a primitive_lists block");
			}
			
			// test ; [v:2 n:3 t0:2] 4#thing
			// [v:2 n:3 t0:2] 4
			// 
		}
		var r = {
			metadata: metadata,
			vertex_groups: vertex_groups,
			vertices: vertices,
			primitive_groups: primitive_groups,
			vertex_relation: vertex_relation,
			primitive_lists: primitive_lists
		};
		console.log(r);
		
	};
	window.export = {OvoLoader};
})();