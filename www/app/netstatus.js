"use strict";
/**
 * Webcomponent that show the network status.
 */
app.Netstatus = {
	/** HTML tag of this component. */
	tag: "netstatus",
	/** Template used to display this component. */
	template: {url: "/app/netstatus.tpl"}
};
// creation of the webcomponent
sk.createComponent(app.Netstatus);