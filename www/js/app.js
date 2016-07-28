// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    // find template and compile it
    var templateSource = document.getElementById('results-template').innerHTML,
      template = Handlebars.compile(templateSource),
      resultsPlaceholder = document.getElementById('results'),
      playingCssClass = 'playing',
      audioObject = null;

    var fetchTracks = function(albumId, callback) {
      $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function(response) {
          callback(response);
        }
      });
    };

    var searchAlbums = function(query) {
      $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
          q: query,
          type: 'album'
        },
        success: function(response) {
          resultsPlaceholder.innerHTML = template(response);
        }
      });
    };

    results.addEventListener('click', function(e) {
      var target = e.target;
      if (target !== null && target.classList.contains('cover')) {
        if (target.classList.contains(playingCssClass)) {
          audioObject.pause();
        } else {
          if (audioObject) {
            audioObject.pause();
          }
          fetchTracks(target.getAttribute('data-album-id'), function(data) {
            audioObject = new Audio(data.tracks.items[0].preview_url);
            audioObject.play();
            target.classList.add(playingCssClass);
            audioObject.addEventListener('ended', function() {
              target.classList.remove(playingCssClass);
            });
            audioObject.addEventListener('pause', function() {
              target.classList.remove(playingCssClass);
            });
          });
        }
      }
    });

    document.getElementById('search-form').addEventListener('submit', function(e) {
      e.preventDefault();
      searchAlbums(document.getElementById('query').value);
    }, false);
  });
})
