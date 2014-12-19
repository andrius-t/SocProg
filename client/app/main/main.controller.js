'use strict';

angular.module('socProgApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {

    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('main'+ Auth.getCurrentUser()._id, $scope.awesomeThings);
    });
    $http.get('/api/repos').success(function(repos) {
      $scope.repos = repos;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.time = function (itemTime){
      return moment(itemTime).fromNow();

    };

    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.editThing = function(thing) {
      thing.edit = $("<div>").html(toMarkdown(thing.name)).text();
      //$scope.commentEditable = false;
      thing.editable = true;
    };
    $scope.update = function(thing) {
      delete thing.editable;
      $http.put('/api/things/'+thing._id, {name:thing.edit,user:thing.user});

    }
  });
