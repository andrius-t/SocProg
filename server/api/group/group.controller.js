'use strict';

var _ = require('lodash');
var Group = require('./group.model');
var User = require('../user/user.model');

// Get list of groups
exports.index = function(req, res) {
  Group.find({users: {$in: [req.user._id]}},function (err, groups) {
    if(err) { return handleError(res, err); }
    return res.json(200, groups);
  });
};

// Get a single group
exports.show = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    User.populate(group, {path:'users', select: 'name'}, function(err, populated){
      if(err) { return handleError(res, err); }
      return res.json(200, populated);
    });
  });
};

// Creates a new group in the DB.
exports.create = function(req, res) {
  req.body.owner = req.user._id;
  req.body.users = [req.user._id];
  Group.create(req.body, function(err, group) {
    if(err) { return handleError(res, err); }
    return res.json(201, group);
  });
};

// Updates an existing group in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    User.findOne({'local.email':req.body.email},'_id, name', function (err, user){
      if (err) { return handleError(res, err); }
      if(!user) { return res.send(404); }
      group.users.pull(user._id);
      //console.log(user);
      group.users.push(user._id);
      group.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, user);
      });
    });
    //var updated = _.merge(group, req.body);

  });
};

// Deletes a group from the DB.
exports.destroy = function(req, res) {
  Group.findById(req.params.id, function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.send(404); }
    group.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}