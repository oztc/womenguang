//= require_tree .

$(function(){
  $('#container').masonry({
    itemSelector : '.item'
  });

  $("#albums-list").live("change", function(e) {
    load_photos(this.value);
    location.hash = "#" + this.value;
  });

});