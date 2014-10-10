/**
 * Created by Andrius on 08/10/2014.
 */
'use strict';

angular.module('socProgApp')
    .controller('CommentCtrl', function ($scope, $http, socket, Auth) {
        $scope.comments = [];

        /*$http.get('/api/comments').success(function(comments) {
            $scope.comments = comments;
            socket.syncUpdates('comment', $scope.comments);
        });*/
        $scope.addComment = function(parent,body) {
            if(body === '') {
                return;
            }
            $http.post('/api/comments', { body: body, parent: parent });
            this.body = '';
        };
        $scope.findComments = function(parent, number) {
            /*var params = {};
            $scope.parent = parent;
            if (number) {
                params = {
                    parentId: parent._id,
                    limit: number+1
                };
            } else {
                params = {
                    parentId: parent._id
                }
            }*/
            $scope.parent = parent;
            $http.get('/api/comments/' + parent._id).success(function(comments) {
                $scope.comments = comments;
                socket.syncUpdates('comment'+parent._id, $scope.comments);
            });

        }

        $scope.deleteComment = function(comment) {
            $http.delete('/api/comments/' + comment._id);
        };

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('comment'+$scope.parent._id);
        });
        $scope.time = function (itemTime){
          return moment(itemTime).fromNow();

        }
        $scope.getCurrentUser = Auth.getCurrentUser;
        $scope.editComment = function(comment) {
          //$scope.commentEditable = false;
          comment.editable = true;
        };
        $scope.update = function(comment) {
          delete comment.editable;
          $http.put('/api/comments/'+comment._id, comment);

        }
    });
