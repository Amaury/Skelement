"use strict";
/** UI namespace. */
sk._core.ui = new function() {
	/** Localisation constants. */
	this.l10n = null;
	/** Is the jSmart plugins are loaded? */
	this._pluginsLoaded = false;
	/** List of created template renderers. */
	this._templates = {};

	/**
	 * Template processing.
	 * @param	string		tag	Component's tag name.
	 * @param	string		tpl	Template definition. Could be empty (then an HTML inline template will be searched),
	 *					a string containing the template itself, or an object with an "id" key
	 *					(to find the inline template) or an "url" key (to fetch the template).
	 * @param	hash		data	Data to pass to the template.
	 * @param	function	handler	Function that would be called with the generated HTML given as parameter.
	 */
	this.render = function(tag, tpl, data, handler) {
		if (!this._pluginsLoaded) {
			this._pluginsLoaded = true;
			// add l10n plugin to jSmart
			jSmart.prototype.registerPlugin("block", "l10n", function(params, content, data, repeat) {
				if (repeat.value === false) {
					return (sk._core.ui.l10n[content]);
				}
			});
		}
		// check if the template was already processed
		if (!this._templates[tag]) {
			// get the template
			if (typeof tpl == "object" && tpl.url != undefined) {
				// fetch remote template from the given URL
				$.get(tpl.url, function(response) {
					sk._core.ui.render(tag, response, data, handler);
				}, "text");
				return;
			} else if (typeof tpl == "object" && tpl.id != undefined) {
				// inline HTML template, searched from the given id
				tpl = $("script#tpl-" + tpl.id).html();
			} else if (typeof tpl != "string") {
				// inline HTML template, searched from the component's tag name
				tpl = $("script#tpl-" + tag).html();
			}
			// creation of the jSmart renderer
			this._templates[tag] = new jSmart(tpl);
		}
		// generating the template's data
		var tplData = $.extend({l10n: this.l10n}, data);
		// template rendering
		var html = this._templates[tag].fetch(tplData);
		// call the given handler with the generated HTML
		handler(html);
	};
};
