function load_albums() { 
  $('#loading').fadeIn();
  var source = '<option value="{{id}}">{{ name }} - {{ count }} photos</option>';
  var template = Handlebars.compile(source);

  FB.api('/me/albums', function(response) {
    $.each(response.data, function(i, item) {
      var data = { image_url: item.cover_photo, name: item.name, id: item.id, count: item.count };
      var result = template(data);
      if(data.count) {
        $("#albums-list").append(result);
      }
    });
    $('#loading').fadeOut("slow", function(e) {
      $("#albums-list").attr("disabled", false);
      $("#albums-list").chosen();
    });
  });
}

function load_photos(album_id) {
  if(album_id == null) {
    return;
  }
  
  $('#loading').fadeIn();
  var source = $("#item-template").html();
  var template = Handlebars.compile(source);

  FB.api('/' + album_id + '/photos?limit=50', function(response) {
    $.each($("div#container .item"), function(i, item) {
      $(item).fadeOut("fast", function() { $(this).remove(); });
    })
    
    $("div#container").remove();
    $("#bd").html("<div id='container'></div>");

    $.each(response.data, function(i, item) {
      var data = { image_url: item.images[1].source, name: item.name, comments: item.comments, link: item.link };
      if(item.likes) {
        data.likes_count = item.likes.data.length;
      } else {
        data.likes_count = 0;
      }

      if(item.comments) {
        var comments = [];
        $.each(item.comments.data, function(q, comment) {
          comments.push({ user_id: comment.from.id, username: comment.from.name, message: comment.message });
        })
        data.comments_count = comments.length;
        data.comments = comments;
      } else {
        data.comments_count = 0;
      }

      var result = $(template(data)).hide();
      $("div#container").append(result);
      result.fadeIn();

      var $container = $('div#container');
      $container.imagesLoaded(function(){
        $container.masonry({
          itemSelector : '.item',
          columnWidth : 240,
          isFitWidth: true
        });
        $('#loading').fadeOut();
      });

    })
  })
}

function updateStatus() {
  FB.getLoginStatus(function(response) {
    if (response.authResponse) {
       FB.api('/me', function(user) {
          if (user) {
            $(".fb-login-button").fadeOut();
            load_albums();
            $("#fb-user").show();
            var image = document.getElementById('image');
            image.src = 'https://graph.facebook.com/' + user.id + '/picture?type=square';
            var name = document.getElementById('name');
            name.innerHTML = user.name;              
          }
      });
    }  
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '#TODO: YOUR FACEBOOK APP ID HERE', // App ID
    channelUrl : '//#TODO: YOUR FACEBOOK APP URL HERE/channel.html', // Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    oauth      : true, // enable OAuth 2.0
    xfbml      : true  // parse XFBML
  });
  FB.Event.subscribe('auth.statusChange', updateStatus);
};

(function(d){
   var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   d.getElementsByTagName('head')[0].appendChild(js);
 }(document));
