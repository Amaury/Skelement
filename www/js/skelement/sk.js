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
				sk.load($.trim(lines[i]));
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

	/* *** Init. *** */
	window.addEventListener("DOMContentLoaded", function() {
		/* Loading of application files. */
		var appFile = $("body").attr("sk-app-file");
		if (appFile != undefined && appFile.length) {
			sk.load(appFile);
			return;
		}
		var appLoader = $("body").attr("sk-app-loader");
		sk.loadList(appLoader);
	}, false);
};
