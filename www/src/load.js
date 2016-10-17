$.ajaxSetup({async: false});
$.getScript("/src/app.js");
$.getScript("/src/app.user.js");
$.getScript("/src/app.user.list.js");
$.getScript("/src/app.user.card.js");
$.ajaxSetup({async: true});
