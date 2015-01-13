'use strict';

angular.module('socProgApp')
  .controller('MainCtrl', function ($scope, $http, socket,$modal, Auth) {

    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('main'+ Auth.getCurrentUser()._id, $scope.awesomeThings);
    });
    $http.get('/api/repos').success(function(repos) {
      $scope.repos = repos;
    });
    $http.get('/api/groups').success(function(groups) {
      $scope.groups = groups;
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
    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl1',
        size: size
      });
    };
  });
angular.module('socProgApp').controller('ModalInstanceCtrl1', function ($http, $scope, $modalInstance) {

  $scope.ok = function (item) {

    if($scope.thing.body == '') {
      return;
    }
    $http.post('/api/groups', item).
      success(function(data, status, headers, config) {
        $scope.thing.name = '';
        window.location.replace('group/'+data._id);
        $modalInstance.close();
      })

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});