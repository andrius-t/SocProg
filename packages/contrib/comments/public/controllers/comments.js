'use strict';

angular.module('mean.comments').controller('CommentsController', ['$scope', '$http', 'Global', '$stateParams', 'Comments', 'FetchComments', 'MeanSocket', 'utils',
  function($scope, $http, Global, $stateParams, Comments, FetchComments, MeanSocket, utils) {
    var socket = MeanSocket;
    $scope.global = Global;
    $scope.commentEditable = true;

    $scope.taggedUsers = [];
    $scope.mentionsUsers = [];

    $scope.getCommentPeopleTextRaw = function(item) {
      $scope.mentionsUsers.push({
        'id': item._id,
        'name': item.name
      });
      $scope.taggedUsers.push(item._id);
      return '[-' + item.name + ']';
    };

    $scope.package = {
      name: 'comments'
    };

    $scope.loadcomment = false;

    socket.on('commentCreated', function(response) {
      if ($scope.parent._id === response.comment.parent._id) {
        if ($scope.parent.comments.length === 0) {
          $scope.parent.comments = [];
        }
        utils.findAndModify($scope.parent.comments, response.comment.data);
      }
    });

    socket.on('commentDeleted', function(response) {
      if ($scope.parent._id === response.comment.parent._id) {
        utils.findAndRemoveById($scope.parent.comments, response.comment.data);
      }
    });

    socket.on('commentUpdated', function(response) {
      if ($scope.parent._id === response.comment.parent._id) {
        utils.findAndModifyById($scope.parent.comments, response.comment.data);
      }
    });

    $scope.editComment = function(comment) {
      $scope.commentEditable = false;
      comment.editable = true;
      comment.mentionsUsers.forEach(function(user) {
        comment.body = comment.body.replace('<a class="mention-user" href="/#!/users/' + user._id + '">' + user.name + '</a>', '[-' + user.name + ']');
      });
      utils.findAndModify($scope.parent.comments, comment);
    };

    $scope.findComments = function(parent, fixedNumberOfComments) {
      $scope.parent = parent;
      var queryParams = {};

      if (fixedNumberOfComments) {
        queryParams = {
          parentId: parent._id,
          limit: fixedNumberOfComments + 1
        };
      } else {
        queryParams = {
          parentId: parent._id
        };
      }

      FetchComments.query(queryParams)
        .$promise.then(function(comments) {
          comments.forEach(function(comment) {
            if (comment.mentionsUsers !== null && comment.mentionsUsers !== undefined & comment.mentionsUsers.length > 0) {
              comment.mentionsUsers.forEach(function(user) {
                comment.body = comment.body.replace('[-' + user.name + ']', '<a class="mention-user" href="/#!/users/' + user._id + '">' + user.name + '</a>');
              });
            }
          });
          if (fixedNumberOfComments && comments.length > fixedNumberOfComments) {
            $scope.loadcomment = true;
            $scope.parent.comments = comments.slice(0, -1);
          } else {
            $scope.loadcomment = false;
            $scope.parent.comments = comments;
          }
        });
    };

    $scope.remove = function(comment) {
      var status = confirm('Are you sure you want to delete this comment.?');
      if (status) {
        var commentDelete = new Comments(comment);
        commentDelete.$remove().then(function(comment) {
          socket.emit('commentDeleted', {
            data: comment,
            parent: $scope.parent
          });
          utils.findAndRemoveById($scope.parent.comments, comment);
        });
      }
    };

    $scope.update = function(comment) {
      var updateComment = new Comments(comment);
      comment.mentionsUsers.forEach(function(user) {
        comment.body = comment.body.replace('[-' + user.name + ']', '<a class="mention-user" href="/#!/users/' + user._id + '">' + user.name + '</a>');
      });
      angular.extend(comment, updateComment);
      updateComment.$update().then(function(res) {
        if (res.mentionsUsers !== undefined && res.mentionsUsers.length > 0) {
          res.mentionsUsers.forEach(function(user) {
            comment.body = res.body.replace('[-' + user.name + ']', '<a class="mention-user" href="/#!/users/' + user._id + '">' + user.name + '</a>');
          });
        }
        $scope.commentEditable = true;
        comment.editable = false;
        utils.findAndModify($scope.parent.comments, comment);
        socket.emit('commentUpdated', {
          data: comment,
          parent: $scope.parent
        });
      });
    };

    $scope.create = function(body, parent, tagged_users) {
      var comment = new Comments({
        body: body,
        parent: parent._id,
        user: Global.user._id,
        likes: []
      });

      if (tagged_users !== undefined) {
        comment.mentionsUsers = tagged_users;
      }
      comment.$save().then(function(data) {
        var tags_users = [];
        var regex = /(<([^>]+)>)/ig;
        if (data.mentionsUsers !== undefined && data.mentionsUsers.length > 0) {
          data.mentionsUsers.forEach(function(user) {
            tags_users.push(user._id);
          });

        }
        data.user = Global.user;
        data.likes = [];
        data.likeIds = [];
        if ($scope.parent.comments.length === 0) {
          $scope.parent.comments = [];
        }
        $scope.parent.comments.push(data);
        if (data.mentionsUsers !== undefined && data.mentionsUsers.length > 0) {
          $scope.mentionsUsers.forEach(function(user) {
            data.body = data.body.replace('[-' + user.name + ']', '<a class="mention-user" href="/#!/users/' + user.id + '">' + user.name + '</a>');
          });
        }
        // Use of utils utils.findAndModify(parent.comments, data);
        socket.emit('commentCreated', {
          data: data,
          parent: parent
        });
      });

      this.body = '';
    };
  }
]);
