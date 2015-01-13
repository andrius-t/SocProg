'use strict';

angular.module('socProgApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/group/{groupId}',
        templateUrl: 'app/group/group.html',
        controller: 'GroupCtrl'
      });
  });