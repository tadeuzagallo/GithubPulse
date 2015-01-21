/**
* Github Pulse
* file: app.js
* Author: Rafaell Lycan
*/

;(function(){
  'use strict';

  // do something
  var settings = {
    api : 'https://api.github.com/repos/tadeuzagallo/GithubPulse/tags'
  };

  function getVersion(url){
    $.get(url).success(function(data){
      var v = data[0].name;
      $('.download').find('span').text('Currently '+v);
    });
  }

  $('.header a').click(function() {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $('#download').offset().top
    }, 500);
  });

  getVersion(settings.api);

})();