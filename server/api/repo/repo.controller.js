'use strict';

var _ = require('lodash');
var Repo = require('./repo.model');

// Get list of repos
exports.index = function(req, res) {
  Repo.find(function (err, repos) {
    if(err) { return handleError(res, err); }
    return res.json(200, repos);
  });
};

// Get a single repo
exports.show = function(req, res) {
  Repo.findById(req.params.id, function (err, repo) {
    if(err) { return handleError(res, err); }
    if(!repo) { return res.send(404); }
    return res.json(repo);
  });
};

// Creates a new repo in the DB.
exports.create = function(req, res) {
  Repo.create(req.body, function(err, repo) {
    if(err) { return handleError(res, err); }
    return res.json(201, repo);
  });
};

// Updates an existing repo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Repo.findById(req.params.id, function (err, repo) {
    if (err) { return handleError(res, err); }
    if(!repo) { return res.send(404); }
    var updated = _.merge(repo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, repo);
    });
  });
};

// Deletes a repo from the DB.
exports.destroy = function(req, res) {
  Repo.findById(req.params.id, function (err, repo) {
    if(err) { return handleError(res, err); }
    if(!repo) { return res.send(404); }
    repo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}