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

var config = require('../../config/environment');
var GitHubApi = require("github");
var Comment = require('../comment/comment.model');
var markdown = require( "markdown" ).markdown;
//var User = require('../user/user.model');
require('./thing.socket').register();


// Get list of things
exports.index = function(req, res) {

  Thing.find({$and:[{$or: [{user: {$in: req.user.follows}},{user: req.user._id}]},{group:{$exists: false}}]}).sort({ created: -1}).populate('user', 'picture name').exec(function(err, things){
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

// Get a single thing
exports.show = function(req, res) {


  //req.user.githubApi().repos.getAll({
  //}, function(err, res2) {
  //  return res.json(res2);
  //});


  req.user.githubApi().events.getFromUserPublic({
    user: 'Stamy',
    headers : {
      'If-None-Match' : '"da7e3a808716c4e2b82361b167226d69"' // naudoji etag
    }
  }, function(err, res2) {
    // panaudoti lodash kad surasti reikiamus eventus
    var events = res2.filter(function(event){
      return event.type === 'PushEvent';
    });

    req.user.github_events.addToSet(events);
    req.user.save(function (err) {
      // saved!
    });
    // console.log(req.user);
    return res.json(events);
  });

  //console.log(req._passport);

/*  var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    protocol: "https"
  });

  github.authenticate({
    type: "oauth",
    token: req.user.github.token
  });

    github.repos.getAll({
  }, function(err, res2) {
    return res.json(res2);
  });*/

//  github.user.getFrom({
//    user: "stamy"
//  }, function(err, res2) {
//    return res.json(res2);
//  });



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
  req.body.name = markdown.toHTML(req.body.name);
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};
exports.group = function(req, res){
  Thing.find({group:req.params.id}).sort({ created: -1}).populate('user', 'picture name').exec(function(err, things){
    if(err) { return handleError(res, err); }
    return res.json(200, things);
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
      thing.name = markdown.toHTML(req.body.name);
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

exports.count = function (req,res) {
  Thing.count({user: req.params.id}, function (err, count) {
    if (err) return handleError(err);
    return res.json(200, {count:count});
  });
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
  Thing.find({$and:[{user:req.params.id},{group:{$exists: false}}]}).sort({ created: -1}).populate('user', 'picture name').exec(function(err, things){
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};



function handleError(res, err) {
  return res.send(500, err);
}
