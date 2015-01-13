'use strict';

angular.module('socProgApp')
  .controller('GroupCtrl', function ($scope, $stateParams, $http, Auth,socket) {
    $http.get('/api/groups/'+$stateParams.groupId).success(function(group) {
      $scope.group = group;
    });
    $http.get('/api/things/group/'+$stateParams.groupId).success(function(groupThings) {
      $scope.groupThings = groupThings;
      socket.syncUpdates('group'+ $stateParams.groupId, $scope.groupThings);
    });
    $scope.created = function (itemTime){
      return moment(itemTime).format("MMM Do YYYY");
    };
    $scope.add = function(email){
      if(email !== undefined && email !== ''){
        $http.put('/api/groups/'+$stateParams.groupId, {email:email}).success(function(user) {
          var oldItem = _.find($scope.group.users, {_id: user._id});
          var index = $scope.group.users.indexOf(oldItem);
          if (oldItem) {
            $scope.group.users.splice(index, 1, user);
          } else {
            $scope.group.users.unshift(user);
          }
        });

      }
    };
    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing,group: $stateParams.groupId});
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
