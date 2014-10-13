'use strict';

angular.module('socProgApp')
  .controller('ProfileCtrl', function ($scope,$stateParams, User) {
    $scope.message = 'Hello';
    User.get({id:$stateParams.profileId}, function (data) {
      console.log(data);
    });
  });
