"use strict";
/** Network namespace. */
sk._core.network = new function() {
	/** Network's state. */
	this._connected = null;
	/**
	 * Method called when the network's status changed.
	 * @param	HTMLNode	node		Node to update (null to update all nodes).
	 * @param	bool		connected	Connection state.
	 */
	this.changeConnection = function(node, connected) {
		if (connected !== true && connected !== false) {
			if (navigator == undefined || navigator.connection == undefined || navigator.connection.type == undefined ||
			    navigator.connection.type == Connection.UNKNOWN) {
				this._connected = null;
			} else if (navigator.connection.type == NONE) {
				this._connected = false;
			} else {
				this._connected = true;
			}
		} else {
			this._connected = connected;
		}
		var str = (this._connected === true) ? "true" : (this._connected === false) ? "false" : "unknown";
		if (node == null)
			$("[sk-network-connected]").attr("sk-network-connected", str);
		else
			$(node).attr("sk-network-connected", str);
	};
};
