$.ajaxSetup({async: false});
$.getScript("/app/app.js");
$.getScript("/app/user/user.js");
$.getScript("/app/user/list/list.js");
$.getScript("/app/user/card/card.js");
$.ajaxSetup({async: true});
