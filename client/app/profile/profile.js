'use strict';

angular.module('socProgApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile/{profileId}',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl'
      });
  });