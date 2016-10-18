/**
 * Main Skelement object.
 */
var sk = new function() {
	/** List of created template renderers. */
	this._templates = {};
	/**
	 * Template processing.
	 * @param	string		tag	Component's tag name.
	 * @param	string		tpl	Template definition. Could be empty (than an HTML inline template will be searched),
	 *					a string containing the template itself, a string containing an URL, or an object
	 *					with an "id" key (to find the inline template) or an "url" key (to fetch the template).
	 * @param	hash		data	Data to pass to the template.
	 * @param	function	handler	Function that would be called with the generated HTML given as parameter.
	 */
	this.render = function(tag, tpl, data, handler) {
		// check if the template was already processed
		if (!this._templates[tag]) {
			// get the template
			if (tpl == undefined || tpl == "") {
				// inline HTML template, searched from the component's tag name
				tpl = $("script#tpl-" + tag).html();
			} else if (typeof tpl == "object" && tpl.id != undefined) {
				// inline HTML template, searched from the given id
				tpl = $("script#tpl-" + tpl.id).html();
			} else if (typeof tpl == "string" && (tpl.substr(0, 7) == "http://" || tpl.substr(0, 8) == "https://" || tpl.substr(0, 7) == "file://")) {
				// fetch remote template from the given URL
				$.get(tpl, function(response) {
					sk.render(tag, response, data, handler);
				}, "text");
				return;
			} else if (typeof tpl == "object" && tpl.url != undefined) {
				// fetch remove template from the given URL
				$.get(tpl.url, function(response) {
					sk.render(tag, response, data, handler);
				}, "text");
				return;
			}
			// creation of the jSmart renderer
			this._templates[tag] = new jSmart(tpl);
		}
		// template rendering
		var html = this._templates[tag].fetch(data);
		// call the given handler with the generated HTML
		handler(html);
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
	 * Create webcomponents from a list of objects.
	 * @param	array	list	Objects' list.
	 */
	this.createComponents = function(list) {
		for (var i = 0; i < list.length; i++) {
			this.createComponent(list[i]);
		}
	};
	/**
	 * Create a webcomponent.
	 * @param	Object	classObj	Component's management object.
	 */
	this.createComponent = function(classObj) {
		// parameter verification
		if ($.isArray(classObj)) {
			this.createComponents(classObj);
			return;
		}
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
					id = sk.generateId();
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
					// get the attributes of the HTML node
					var attrs = {};
					$.each(this.attributes, function(index, attr) {
						attrs[attr.name] = attr.value;
					});
					// call the creation callback, giving 2 parameters: the HTML node attributes, and a callback function that should be called as a result
					var node = this;
					classObj.prototype.created(attrs, function(response) {
						node.render(response);
					});
					return;
				}
				// data are completed with the node identifier
				var id = $(this).attr("id");
				data.id = id;
				data.skThis = "$('#" + id + "')[0]";
				// the template is processed and its HTML result is used as the content of the component
				var node = this;
				sk.render(this.tag, this.manager.template, data, function(html) {
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
