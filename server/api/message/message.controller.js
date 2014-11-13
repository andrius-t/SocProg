'use strict';

var _ = require('lodash');
var Message = require('./message.model');
var User = require('../user/user.model');
var MessageList = require('./messagelist.model');

// Get list of messages
exports.index = function(req, res) {
  MessageList.find({users: {$in: [req.user._id]}}).sort({ updated: -1}).exec(function(err, list){
    if(err) { return handleError(res, err); }
    User.populate(list, {path:'users', select: 'name'}, function(err, populated){
      if(err) { return handleError(res, err); }
      return res.json(200, populated);
    });
  });
};

// Get list of messages
exports.seen = function(req, res) {
  MessageList.findOne({$and: [{users: {$in: [req.user._id]}},{_id: req.params.id}]}).exec(function(err, list){
    if(err) { return handleError(res, err); }
    list.seen = true;
    list.save(function (err) {
      if (err) { return handleError(res, err); }
      require('./message.socket').registers(list);
      return res.json(200, list);
    });
  });
};

// Get a single message
exports.show = function(req, res) {
  Message.find({ $and: [{list: req.params.id}, { $or: [{from: req.user}, {to: req.user}]}]}).populate('from', 'name picture').exec(function(err, message){
    if(err) { return handleError(res, err); }
    if(!message) { return res.send(404); }
    return res.json(message);
  });
};

// Creates a new message in the DB.
exports.create = function(req, res) {
  if (req.body.to != req.user._id) {
    var listm = {};
    listm.users = [req.body.to, req.user._id];
    listm.updated = new Date();
    listm.seen = false;
    listm.last = req.user._id;
    MessageList.findOneAndUpdate({$and: [{users: {$in: [req.body.to]}}, {users: {$in: [req.user._id]}}]},listm,{upsert: true}, function (err, list) {
      if (err) {
        return handleError(res, err);
      }
      require('./message.socket').registers(list);
      req.body.list = list._id;
      req.body.from = req.user._id; 
      Message.create(req.body, function (err, message) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(201, message);
      });
    });
  } else {
    return res.json(404);
  }

};

// Updates an existing message in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Message.findById(req.params.id, function (err, message) {
    if (err) { return handleError(res, err); }
    if(!message) { return res.send(404); }
    var updated = _.merge(message, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, message);
    });
  });
};

// Deletes a message from the DB.
exports.destroy = function(req, res) {
  Message.findById(req.params.id, function (err, message) {
    if(err) { return handleError(res, err); }
    if(!message) { return res.send(404); }
    message.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}