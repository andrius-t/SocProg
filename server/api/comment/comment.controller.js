'use strict';

var _ = require('lodash');
var Comment = require('./comment.model');

// Get list of comments
exports.index = function(req, res) {
  Comment.find(function (err, comments) {
    if(err) { return handleError(res, err); }
    return res.json(200, comments);
  });
};


// Get list of comment
exports.show = function(req, res) {
  Comment.find({parent:req.params.id}).sort({ created: -1}).populate('user', 'email name').exec(function(err, comment){
    if(err) { return handleError(res, err); }
    return res.json(200, comment);
  });
};

// Creates a new comment in the DB.
exports.create = function(req, res) {
  req.body.user = req.user;
  Comment.create(req.body, function(err, comment) {
    if(err) { return handleError(res, err); }
    return res.json(201, comment);
  });
};

// Updates an existing comment in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Comment.findById(req.params.id, function (err, comment) {
    if (err) { return handleError(res, err); }
    if(!comment) { return res.send(404); }
    var updated = _.merge(comment, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, comment);
    });
  });
};

// Deletes a comment from the DB.
exports.destroy = function(req, res) {

    Comment.findById(req.params.id, function (err, comment) {
      if (err) {
        return handleError(res, err);
      }
      if (!comment) {
        return res.send(404);
      }
      if (comment.user.toString() === req.user._id.toString()) {
        comment.remove(function (err) {
          if (err) {
            return handleError(res, err);
          }
          return res.send(204);
        });
      } else {
        return res.send(404);
      }
    });

};

function handleError(res, err) {
  return res.send(500, err);
}