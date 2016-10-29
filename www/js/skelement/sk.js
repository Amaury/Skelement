"use strict";
/**
 * Main Skelement object.
 */
var sk = new function() {
	/**
	 * Loading of external JS files.
	 * @param	string|array	url	URL or list of URLs.
	 */
	this.load = function(url) {
		if ($.isArray(url)) {
			for (var i in url) {
				this.load(url[i]);
			}
			return
		}
		$.getScript(url);
	};
	/**
	 * Load a list of external JS files from a text file.
	 * @param	string	url	URL of the text file.
	 */
	this.loadList = function(url) {
		$.get(url, function(txt) {
			var lines = txt.split("\n");
			for (var i = 0, len = lines.length; i < len; i++) {
				var url = $.trim(lines[i]);
				if (url.length && url.charAt(0) != "#") {
					sk.load(url);
				}
			}
		}, "text");
	};
	/**
	 * Create webcomponents from a list of objects.
	 * @param	array|string	component	Component object, or list of component objects.
	 */
	this.createComponent = function(component) {
		// parameter verification
		if (!$.isArray(component)) {
			component = [component];
		}
		for (var i = 0; i < component.length; i++) {
			this._core.createComponent(component[i]);
		}
	};
	/** Refresh the current page. */
	this.refresh  = function() {
		document.location.href = this.url._url;
	};

	/* *** Init. *** */
	window.addEventListener("DOMContentLoaded", function() {
		sk._core.init();
	}, false);
};
