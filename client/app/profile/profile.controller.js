'use strict';
angular.module('socProgApp')
  .controller('ProfileCtrl', function ($http, $upload, socket, $modal, $scope, $stateParams, User, Auth) {
    var data = Auth.getCurrentUser().follows;
    User.get({id:$stateParams.profileId}, function (data) {
      data._id = $stateParams.profileId;
      $scope.profile = data;
    });
    $scope.getCurrentUser = Auth.getCurrentUser;
    $http.get('/api/things/profile/'+$stateParams.profileId).success(function(profileThings) {
      $scope.profileThings = profileThings;
      socket.syncUpdates('profile'+$stateParams.profileId, $scope.profileThings);
    });

    $http.get('/api/things/count/'+$stateParams.profileId).success(function(post) {
      $scope.postCount = post.count;
    });
    $http.get('/api/users/followers/'+$stateParams.profileId).success(function(post) {
      $scope.followers = post.count;
    });

    if ($stateParams.profileId !== undefined && data !== undefined) {
      $scope.following = (data.indexOf($stateParams.profileId) > -1);
    }
    $scope.addFollower = function (user) {
      $http.post('/api/users/addfollower', { _id: $stateParams.profileId }).success(function() {
        $scope.following = true;
        $scope.followers += 1;
      });
    };
    $scope.removeFollower = function (user) {
      $http.post('/api/users/removefollower', { _id: $stateParams.profileId }).success(function() {
        $scope.following = false;
        $scope.followers -= 1;

      });
    };
    $scope.onFileSelect = function($files) {
      //$files: an array of files selected, each file has name, size, and type.
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];
        $scope.upload = $upload.upload({
          url: '/api/users/image', //upload.php script, node.js route, or servlet url
          method: 'POST',
          file: file
        }).progress(function(evt) {
          console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
          // file is uploaded successfully
          window.location.reload();
        });
      }
    };

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };
    $scope.sendMessage = function(message) {
      console.log(message);
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
    $scope.created = function (itemTime){
      return moment(itemTime).format("MMM Do YYYY");
    };
    $scope.time = function (itemTime){
      return moment(itemTime).fromNow();

    };
    $scope.editThing = function(thing) {
      thing.edit = $("<div>").html(toMarkdown(thing.name)).text();
      //$scope.commentEditable = false;
      thing.editable = true;
    };
    $scope.update = function(thing, upthing) {
      delete thing.editable;
      $http.put('/api/things/'+thing._id, {name:thing.edit,user:thing.user});

    };

    $scope.open = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size
      });
    };
  });


angular.module('socProgApp').controller('ModalInstanceCtrl', function ($http, $scope, $modalInstance, $stateParams) {

  $scope.ok = function (item) {

    if($scope.thing.body == '') {
      return;
    }
    item.to = $stateParams.profileId;
    console.log(item)
    $http.post('/api/messages', item).
      success(function(data, status, headers, config) {
        $scope.thing.body = '';
        $modalInstance.close();
      })

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});