"use strict";
/**
 * Main Skelement object.
 */
var sk = new function() {
	/* Init. */
	window.addEventListener("DOMContentLoaded", function() {
		/* Management of device connection. */
		sk._core.network.changeConnection();
		document.addEventListener("deviceready", function() {
			sk._core.network.changeConnection(null);
		}, false);
		document.addEventListener("offline", function() {
			sk._core.network.changeConnection(null, false);
		}, false);
		document.addEventListener("online", function() {
			sk._core.network.changeConnection(null, true);
		}, false);
		/* Loading of application files. */
		var appLoader = $("body").attr("sk-app-loader");
		sk.load(appLoader);
	}, false);
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
};
