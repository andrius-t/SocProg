'use strict';

angular.module('mean.comments').factory('Comments', ['$resource',
  function($resource) {
    return $resource('comments/:commentId', {
      commentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]).factory('FetchComments', ['$resource',
  function($resource) {
    var config = {
      query: { // GET /comments
        method: 'GET',
        isArray: true,
        transformResponse: function(comments) {
          comments = angular.fromJson(comments);
          comments.map(function(comment) {
            comment.likeIds = [];
            if (comment.likes) {
              for (var key in comment.likes) {
                var obj = comment.likes[key];
                comment.likeIds.push(obj._id);
              }
            }
          });
          return comments;
        }
      },
    };
    return $resource('comments/parent/:parentId', {
      parentId: '@_id'
    }, config);
  }
]).filter('newlines', function($sce) {
  return function(text) {
    if (text !== undefined) {
      return $sce.trustAsHtml(text.valueOf().replace(/\n/g, '<br/>'));
    }
  };
}).filter('parseUrlFilter', function($sce) {
  return function(text, target) {
    if (text) {
      if (typeof(text) === 'object') text = text.valueOf();
      text = Autolinker.link(text, {
        email: true,
        truncate: 15,
        twitter: false
      });
    }
    return $sce.trustAsHtml(text);
  };
}).filter('htmlToPlaintext', function() {
  return function(text) {
    return text.valueOf().replace(/<[^>]+>/gm, '');
  };
}).factory('mentionUser', function($http) {
  var fetchUsers = function(query) {
    $http.get('/tag/users/', {
      params: {
        term: query.term
      }
    })
      .success(function(data, status, headers, config) {
        var items = {
          results: []
        };
        var count = 0;
        angular.forEach(data, function(datum) {
          items.results.push({
            id: datum._id,
            text: datum.name,
          });
          count++;
        });
        query.callback(items);
      });
  };
  return fetchUsers;
}).factory('utils', function() {
  var utils = {
    indexOf: function(arr, obj) {
      var index = -1; // not found initially
      var keys = Object.keys(obj);
      // filter the collection with the given criterias
      arr.filter(function(doc, idx) {
        // keep a counter of matched key/value pairs
        var matched = 0;

        // loop over criteria
        for (var i = keys.length - 1; i >= 0; i--) {
          if (doc[keys[i]] === obj[keys[i]]) {
            matched++;

            // check if all the criterias are matched
            if (matched === keys.length) {
              index = idx;
              return idx;
            }
          }
        }
      });
      return index;
    },

    findAndModify: function(arr, obj) {
      var index = utils.indexOf(arr, obj);
      if (~index) arr[index] = obj;
      else arr.push(obj);
      return arr;
    },
    checkDUplicates: function(arr, obj) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i]._id === obj._id) {
          return true;
        }
      }
      return false;
    },

    findAndModifyById: function(arr, obj) {
      var index = utils.indexOf(arr, {
        ID: obj.ID
      });
      if (~index) arr[index] = obj;
      else arr.unshift(obj);
      return arr;
    },

    findAndRemove: function(arr, obj) {
      var index = utils.indexOf(arr, obj);
      if (~index) arr.splice(index, 1);
      return arr;
    },

    findAndRemoveById: function(arr, obj) {
      var index = utils.indexOf(arr, {
        _id: obj._id
      });

      if (~index) arr.splice(index, 1);
      return arr;
    },

    unique: function(arr, key) {
      var unique = {};
      var distinct = [];
      arr.forEach(function(obj) {
        if (!unique[obj[key]]) {
          distinct.push(obj);
          unique[obj[key]] = true;
        }
      });
      return distinct;
    },
  };
});
