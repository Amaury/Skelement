"use strict";
/** UI namespace. */
sk._core.ui = new function() {
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
			} else if (typeof tpl == "string" && (tpl.charAt(0) == "/" || tpl.substr(0, 7) == "http://" || tpl.substr(0, 8) == "https://" || tpl.substr(0, 7) == "file://")) {
				// fetch remote template from the given URL
				$.get(tpl, function(response) {
					sk._core.ui.render(tag, response, data, handler);
				}, "text");
				return;
			} else if (typeof tpl == "object" && tpl.url != undefined) {
				// fetch remove template from the given URL
				$.get(tpl.url, function(response) {
					sk._core.ui.render(tag, response, data, handler);
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
};
