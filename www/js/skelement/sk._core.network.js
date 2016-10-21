"use strict";
/** Network namespace. */
sk._core.network = new function() {
	/** Method called when the network's status changed. */
	this.connectionStatusChanged = function() {
		var connected = navigator.onLine;
		var str = (connected === true) ? "true" : "false";
		$("[sk-network-connected]").attr("sk-network-connected", str);
	};
	/**
	 * Returns the network status.
	 * @param	bool	text	Returns a text string if this parameter is set to true.
	 * @return	bool	True if the network is connected, false if not, null if unknown.
	 */
	this.isConnected = function(text) {
		var connected = navigator.onLine;
		if (text === true)
			return ((connected === true) ? "true" : "false");
		return (this._connected);
	};

	/* *** Init. *** */
	/* Management of device connection. */
	this.connectionStatusChanged();
	document.addEventListener("deviceready", function() {
		sk._core.network.connectionStatusChanged();
	}, false);
	document.addEventListener("offline", function() {
		sk._core.network.connectionStatusChanged();
	}, false);
	document.addEventListener("online", function() {
		sk._core.network.connectionStatusChanged();
	}, false);
};
