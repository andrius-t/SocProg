'use strict';

angular.module('socProgApp')
  .controller('SearchCtrl', function ($scope, $http, $location) {
    $http.get('/api/users/search/'+ $location.search().q).success(function(data) {
      $scope.data = data;
      $scope.data.forEach(function(item){
        $http.get('/api/things/count/' + item._id).success(function (post) {
          item.posts = post.count;
        });
        $http.get('/api/users/followers/'+item._id).success(function(post) {
          item.followers = post.count;
        });

      });
    });
  });
