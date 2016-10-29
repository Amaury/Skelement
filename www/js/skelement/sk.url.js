"use strict";
/** URL namespace. */
sk.url = new function() {
	/** Current URL. */
	this._url = null;
	/** Chunked current URL. */
	this._urlChunks = null;

	/**
	 * Return the current URL.
	 * @return	string	The URL.
	 */
	this.getPath = function() {
		return (this._url);
	};
	/**
	 * Return the chunked current URL.
	 * @return	array	The chunked URL.
	 */
	this.getParts = function() {
		return (this._urlChunks);
	};
	/**
	 * Defines the current URL in the adress bar.
	 * @param	string	url	The new URL.
	 */
	this.set = function(url) {
		history.pushState(url, "", url);
		this._update(url);
	};

	/**
	 * Update the computed URL data.
	 * @param	string	url	(optional) The URL to use. If not given, use the current URL.
	 */
	this._update = function(url) {
		if (url == undefined || typeof url != "string" || !url.length)
			url = window.location.pathname;
		if (url.charAt(0) != "/")
			url = "/" + url;
		this._url = url;
		url = url.substr(1);
		if (url.charAt(url.length - 1) == "/")
			url = url.substr(0, -1);
		this._urlChunks = url.split("/");
	};

	/* *** Init. *** */
	this._update(window.location.pathname);
	// gestion de l'historique de navigation
	$(window).bind("popstate", function(event) {
		document.location.href = event.originalEvent.state ? event.originalEvent.state : "/";
	});
};
