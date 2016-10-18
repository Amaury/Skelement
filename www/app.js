/** Root namespace object. */
var app = {};

// loading of all application's scripts
$.ajaxSetup({async: false});
$.getScript("/app/title.js");
$.getScript("/app/user.js");
$.getScript("/app/user/list.js");
$.getScript("/app/user/card.js");
$.ajaxSetup({async: true});
