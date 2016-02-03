'use strict';

angular.module('socProgApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, socket, $http) {
    $scope.notifications = [];
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    if (Auth.isLoggedIn()) {
      $http.get('/api/users/navbar').success(function (items) {
        $scope.notifications = items.notifications;
        socket.syncUpdates('notification' + items._id, $scope.notifications);
        $scope.noti = items.menu_noti;
        $scope.message = items.menu_message;
        if ($location.path() === '/message' && $scope.message === true) {
          $http.post('/api/users/message').success(function () {
            $scope.message = false;
          });
        }

      });
    }
    socket.socket.on('noti'+Auth.getCurrentUser()._id, function (item) {
      $scope.noti = item
    });
    socket.socket.on('message'+Auth.getCurrentUser()._id, function (item) {
      $scope.message = item
    });
    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
    $scope.notification = function(){
      if($scope.noti) {
        $http.post('/api/users/notification').success(function () {
          $scope.noti = false;
        });
      }
    };
    $scope.time = function (itemTime){
      return moment(itemTime).fromNow();

    };
  });