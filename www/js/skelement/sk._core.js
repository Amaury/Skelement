"use strict";
/** Core namespace. Must not be used from outside of the framework. */
sk._core = new function() {
	/**
	 * Random identifier generator.
	 * @return	string	The identifier.
	 */
	this.generateId = function() {
		var arr = new Uint8Array(20);
		window.crypto.getRandomValues(arr);
		var id = [].map.call(arr, function(byte) {
			return ("0" + byte.toString(16)).slice(-2);
		}).join("");
		return (id);
	};
	/**
	 * Create a webcomponent.
	 * @param	Object	classObj	Component's management object.
	 */
	this.createComponent = function(classObj) {
		// get the tag name from object property
		var tag = classObj.tag;
		// creation of the component
		var component = (function() {
			// creation of the component's prototype
			var proto = Object.create(HTMLElement.prototype);
			// definition of basic properties
			proto.tag = tag;
			proto.manager = classObj;

			// ----- definition of prototype's methods
			// -- method called when the component is created
			proto.createdCallback = function() {
				// vérification qu'il y a un identifiant
				var id = $(this).attr("id");
				if (id == undefined) {
					id = sk._core.generateId();
					$(this).attr("id", id);
				}
				// génération du HTML
				this.render();
			};
			// -- method called when an attribute of the HTML node is modified
			if (classObj.prototype && typeof classObj.prototype.changed == "function") {
				proto.attributeChangedCallback = classObj.prototype.changed;
			}
			// -- rendering method
			proto.render = function(data) {
				// check if some data are provided
				if (data == undefined) {
					// get the attributes of the HTML node and create an associative array that will
					// be given as parameter for the creation callback
					var attrs = {};
					$.each(this.attributes, function(index, attr) {
						if (attr.name.substring(0, 3) == "sk-") {
							// process special attributes
							if (attr.name == "sk-network-connected") {
								// update the network connection status
								attr.value = sk._core.network.isConnected(true);
								$(this).attr("sk-network-connected", attr.value);
							}
						}
						attrs[attr.name] = attr.value;
					});
					// check if the creation callback exists
					if (classObj.prototype != undefined && classObj.prototype.created != undefined) {
						// call the creation callback, giving 2 parameters: the HTML node attributes,
						// and a callback function that should be called as a result
						var node = this;
						classObj.prototype.created(attrs, function(response) {
							node.render(response);
						});
						return;
					}
					data = {};
				}
				// data are enriched with the node identifier
				var id = $(this).attr("id");
				data.id = id;
				data.skThis = "$('#" + id + "')[0]";
				// the template is processed and its HTML result is used as the content of the component
				var node = this;
				sk._core.ui.render(this.tag, this.manager.template, data, function(html) {
					node.innerHTML = html;
				});
			};
			// -- all other methods of the management object are added to the component's prototype
			for (var m in classObj.prototype) {
				if (typeof classObj.prototype[m] == "function" && $.inArray(m, ["created", "changed", "render", "tag", "manager"]) == -1) {
					proto[m] = classObj.prototype[m];
				}
			}
			// the webcomponent is registered
			return (document.registerElement("sk-" + tag, {prototype: proto}));
		})();
	};
};
