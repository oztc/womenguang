Handlebars.registerHelper('list', function(items, fn) {
  if(items) {
    var out = "";
    for(var i=0, l=items.length; i<l; i++) {
      out = out + fn(items[i]);
    }
    return out;
  } else {
    return "";
  }
});
