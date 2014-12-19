'use strict';

angular.module('socProgApp')
  .controller('MessageCtrl', function ($scope, $http, socket, Auth, $anchorScroll, $location, User) {
    $scope.thing = {};
    $scope.messages = [];
    var current;
    $scope.isCollapsed = true;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $http.get('/api/messages').success(function(messages) {

      $scope.list = messages;
      var check = exist($location.hash(), messages);
      if ($location.hash() != '' && (check !== false)){
        current = messages[check]._id;
        if (messages[check].users[0]._id == Auth.getCurrentUser()._id) {
          $scope.openChat(messages[check]._id, messages[check].users[1]._id);
        } else {
          $scope.openChat(messages[check]._id, messages[check].users[0]._id);
        }
      }else{
        $location.hash(messages[0]._id);
        current = messages[0]._id;
        if (messages[0].users[0]._id == Auth.getCurrentUser()._id) {
          $scope.openChat(messages[0]._id, messages[0].users[1]._id);
        } else {
          $scope.openChat(messages[0]._id, messages[0].users[0]._id);
        }
      }
      socket.syncUpdates('messagelist'+Auth.getCurrentUser()._id, $scope.list);
    });
    function exist (id, messages) {
      for (var i = 0; i < messages.length; i++) {
        if (messages[i]._id == id) {
          return i;
        }
      }
      return false;
    }
    $scope.isActive = function(route) {
      return route === $location.hash();
    };
    function getuser (user) {
      User.get({id:user}, function (data) {
        $scope.profile = data;
      });
    };
    $scope.openChat = function (id, user) {
      socket.unsyncUpdates('message'+current);
      current = id;
      getuser(user);
      $scope.thing.to = user;
      $http.post('/api/messages/'+id);
      $http.get('/api/messages/'+id ).success(function(messages) {
        $scope.messages = messages;
        socket.syncUpdates('message'+id, $scope.messages);
      });
    };
    $scope.time = function (itemTime){
      return moment(itemTime).fromNow();

    };
    $scope.send = function (item) {
      if($scope.thing.body == '') {
        return;
      }
      $http.post('/api/messages', item).
        success(function(data, status, headers, config) {
          $scope.thing.body = '';
      });

    };

  });
