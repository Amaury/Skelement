"use strict";
// function that loads synchronously an external JS file
function __loadFile(url) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send("");
	var node = document.createElement("script");
	node.type = "text/javascript";
	node.text = xhr.responseText;
	document.getElementsByTagName("head")[0].appendChild(node);
}

// polyfill for HTML custom elements
__loadFile("js/polyfill-custom-element.js");
// jQuery
__loadFile("js/jquery.min.js");
// jSmart
__loadFile("js/smart.min.js");
// Skelement
__loadFile("js/skelement/sk.js");
__loadFile("js/skelement/sk.url.js");
__loadFile("js/skelement/sk._core.js");
__loadFile("js/skelement/sk._core.network.js");
__loadFile("js/skelement/sk._core.ui.js");
