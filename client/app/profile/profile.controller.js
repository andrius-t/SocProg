'use strict';

angular.module('socProgApp')
  .controller('ProfileCtrl', function ($http, socket, $scope, $stateParams, User, Auth) {

    User.get({id:$stateParams.profileId}, function (data) {
      data._id = $stateParams.profileId;
      $scope.profile = data;
    });
    $scope.getCurrentUser = Auth.getCurrentUser;
    $http.get('/api/things/profile/'+$stateParams.profileId).success(function(profileThings) {
      $scope.profileThings = profileThings;
      socket.syncUpdates('thing', $scope.profileThings);
    });
  });
