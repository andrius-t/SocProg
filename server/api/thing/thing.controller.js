/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');
var GitHubApi = require("github");
var Comment = require('../comment/comment.model');


// Get list of things
exports.index = function(req, res) {
  Thing.find().sort({ created: -1}).populate('user', 'picture name').exec(function(err, things){
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

// Get a single thing
exports.show = function(req, res) {

  var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https"
  });
  github.user.getFrom({
    user: "stamy"
  }, function(err, res2) {
    return res.json(res2);
  });

//  Thing.findById(req.params.id, function (err, thing) {
//    if(err) { return handleError(res, err); }
//    if(!thing) { return res.send(404); }
//    return res.json(thing);
//  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {

  // Attach to object current user
  req.body.user = req.user;

  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if (req.body.user._id.toString() === req.user._id.toString()) {
    Thing.findById(req.params.id, function (err, thing) {
      if (err) {
        return handleError(res, err);
      }
      if (!thing) {
        return res.send(404);
      }
      thing.name = req.body.name;
      thing.changed = new Date();
      thing.save(function (err) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, thing);
      });
    });
  }
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    if(thing.user.toString() === req.user._id.toString()) {
      thing.remove(function (err) {
        if (err) {
          return handleError(res, err);
        }
        Comment.remove({parent:req.params.id},function(err){
          if(err) { return handleError(res, err); }
          return res.send(204);
        });

      });

    } else {
      return res.send(404);
    }
  });
};


/////////////////
/////////////////

exports.profileIndex = function(req, res) {
  Thing.find({user:req.params.id}).sort({ created: -1}).populate('user', 'picture name').exec(function(err, things){
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};



function handleError(res, err) {
  return res.send(500, err);
}