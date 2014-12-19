'use strict';

angular.module('socProgApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $cookieStore) {
    $scope.errors = {};

    $scope.Auth = Auth;
    User.get(function (data) {
      console.log(data.github_profile);
      $scope.profile = data;
    });
    $scope.github = function(){
      return '/auth/github/connect?access_token=' + $cookieStore.get('token');
    };

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};
  });
