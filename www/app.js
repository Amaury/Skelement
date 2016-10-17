var app = {};

$.ajaxSetup({async: false});
$.getScript("/app/user.js");
$.getScript("/app/user/list.js");
$.getScript("/app/user/card.js");
$.ajaxSetup({async: true});
