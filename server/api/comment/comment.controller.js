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
  Comment.find({parent:req.params.id}).sort({ created: -1}).populate('user', 'picture name').exec(function(err, comment){
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
  if (req.body.user._id.toString() === req.user._id.toString()) {

    Comment.findById(req.params.id, function (err, comment) {

      if (err) {
        return handleError(res, err);
      }
      if (!comment) {
        return res.send(404);
      }
      comment.body = req.body.body;
      comment.changed = new Date();

      comment.save(function (err) {
        if (err) {
          console.log(err);
          return handleError(res, err);
        }
        return res.json(200, comment);
      });
    });
  } else {
    return res.send(404);
  }
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