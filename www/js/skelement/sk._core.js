"use strict";
/** Core namespace. Must not be used from outside of the framework. */
sk._core = new function() {
	/** Framework initialisation. */
	this.init = function() {
		// check for l10n
		var lang = window.navigator.userLanguage || window.navigator.language;
		var l10n = $("body").attr("sk-l10n-" + lang);
		if (l10n != undefined) {
			this.loadL10n(l10n, function() {
				sk._core.loadApplication();
			});
			return;
		}
		// check for l10n generalisation
		var index = lang.indexOf("-");
		if (index != -1) {
			var lang = lang.substring(0, index);
			l10n = $("body").attr("sk-l10n-" + lang);
			if (l10n != undefined) {
				this.loadL10n(l10n, function() {
					sk._core.loadApplication();
				});
				return;
			}
		}
		// check for global l10n
		l10n = $("body").attr("sk-l10n");
		if (l10n != undefined) {
			this.loadL10n(l10n, function() {
				sk._core.loadApplication();
			});
			return;
		}
		// no l10n loading - direct loading of application's files
		this.loadApplication();
	};
	/**
	 * Load a l10n file.
	 * @param	string		l10n		Path to the file.
	 * @param	function	callback	Callback to call after file fetching.
	 */
	this.loadL10n = function(l10n, callback) {
		$.get(l10n, function(data) {
			sk._core.ui.l10n = data;
			callback();
		}, "json");
	};
	/** Load application files. */
	this.loadApplication = function() {
		// search for "sk-app-file" attribute: One JS file that contains the whole application
		var appFile = $("body").attr("sk-app-file");
		if (appFile != undefined && appFile.length) {
			sk.loadScript(appFile);
			return;
		}
		// search for "sk-app-loader" attribute: A text file that lists the several JS files
		var appLoader = $("body").attr("sk-app-loader");
		sk.loadList(appLoader);
	};
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
			// management of the component's template
			if (classObj.templateId != undefined) {
				classObj.template = {id: classObj.templateId};
				classObj.templateId = undefined;
			} else if (classObj.templateUrl != undefined) {
				classObj.template = {url: classObj.templateUrl};
				classObj.templateUrl = undefined;
			} else if (classObj.template == undefined) {
				classObj.template = {id: tag};
			}
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
						attrs[$.camelCase(attr.name)] = attr.value;
					});
					// check if the creation callback exists
					if (classObj.prototype == undefined || classObj.prototype.created == undefined) {
						data = attrs;
					} else {
						// call the creation callback, giving 2 parameters: the HTML node attributes,
						// and a callback function that should be called as a result
						var node = this;
						classObj.prototype.created(attrs, function(response) {
							if (response == undefined)
								response = attrs;
							node.render(response);
						});
						return;
					}
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
