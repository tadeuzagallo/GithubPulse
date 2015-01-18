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
    var http = $.get(url).success(function(data){
      var v = data[0].name;
      $('.download').find('span').text('Currently '+v);
    });
  }

  getVersion(settings.api);

})();