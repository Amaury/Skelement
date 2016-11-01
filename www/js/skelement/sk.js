"use strict";
/**
 * Main Skelement object.
 */
var sk = new function() {
	/** Set if the application is executed inside Cordova. */
	this.cordovaApp = !!window.cordova;
	/** True if the "deviceready" event was triggered. */
	this._isDeviceReady = false;
	/** True if the "DOMContentLoaded" event was triggered. */
	this._isDomLoaded = false;

	/**
	 * Load one external JS file.
	 * @param	string		url		URL that must be loaded.
	 * @param	function	callback	Function to call after loading.
	 */
	this.loadScript = function(url, callback) {
		$.getScript(url, callback);
	};
	/**
	 * Loading of a list of JS files.
	 * @param	array	urls	List of URLs.
	 */
	this.loadScripts = function(urls) {
		if (!$.isArray(urls) || !urls.length)
			return;
		var url = urls.shift();
		this.loadScript(url, function() {
			sk.loadScripts(urls);
		});
	};
	/**
	 * Load a list of external JS files from a text file.
	 * @param	string	url	URL of the text file.
	 */
	this.loadList = function(url) {
		$.get(url, function(txt) {
			var lines = txt.split("\n");
			var urls = [];
			for (var i = 0, len = lines.length; i < len; i++) {
				var url = $.trim(lines[i]);
				if (url.length && url.charAt(0) != "#")
					urls.push(url);
			}
			sk.loadScripts(urls);
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
	/**
	 * Define a callback that would be executed each time a template is rendered and injected in DOM.
	 * @param	function	callback	The callback to execute.
	 */
	this.setPostRenderingCallback = function(callback) {
		sk._core.postRenderingCallback = callback;
	};

	/* *** Init. *** */
	// initialize the framework when the DOM content is loaded,
	// and when the device is ready (if running inside Phonegap/Cordova)
	window.addEventListener("DOMContentLoaded", function() {
		this._isDomLoaded = true;
		if (!this.cordovaApp || this._isDeviceReady) {
			sk._core.init();
		}
	}, false);
	document.addEventListener("deviceready", function() {
		this._isDeviceReady = true;
		if (this.cordovaApp && this._isDomLoaded) {
			sk._core.init();
		}
	}, false);
};
