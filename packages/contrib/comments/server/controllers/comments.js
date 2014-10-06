'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Comment = mongoose.model('Comment'),
  User = mongoose.model('User'),
  _ = require('lodash');


/**
 * Find Comment by id
 */
exports.comment = function(req, res, next, id) {
  Comment.load(id, function(err, Comment) {
    if (err) return next(err);
    if (!Comment) return next(new Error('Failed to load Comment ' + id));
    req.comment = Comment;
    next();
  });
};

/**
 * Show a comment
 */
exports.show = function(req, res) {
  res.json(req.comment);
};

/**
 * Create a Comment
 */
exports.create = function(req, res) {
  var comment = new Comment(req.body);
  comment.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot save the comment'
      });
    } else {
      comment.populate({
        path: 'mentionsUsers',
        select: 'name username'
      }, function(err, doc) {
        res.json(doc);
      });
    }
  });
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
  var comment = req.comment;
  var mentions = [];
  var tagged_Users = [];
  if (req.body.mentionsUsers.length > 0) {

    _.map(req.body.mentionsUsers, function(mu) {
      // push client id (converted from string to mongo object id) into clients
      if (mu._id !== undefined) {
        tagged_Users.push(mu);
        mentions.push(mongoose.Types.ObjectId(mu._id));
      } else
        mentions.push(mongoose.Types.ObjectId(mu));
    });
    req.body.mentionsUsers = mentions;
  }
  comment = _.extend(comment, req.body);
  comment.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the comment'
      });
    } else {
      comment.populate({
        path: 'mentionsUsers',
        select: 'name username'
      }, function(err, doc) {
        res.json(doc);
      });
    }
  });
};

/**
 * Delete an Comment
 */
exports.destroy = function(req, res) {
  var comment = req.comment;

  comment.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the comment'
      });
    } else {
      res.json(comment);
    }
  });
};

/**
 * Fetching comments for a post
 */
exports.fetchByParent = function(req, res) {
  var parentId = req.params.parentId;
  var limit = req.query.limit;
  var query = Comment.find({
      parent: parentId
    })
    .sort({
      _id: -1
    })
    .populate('user', 'name username')
    .populate('mentionsUsers', 'name username')
    .populate('likes', 'name username');
  if (limit) {
    query.limit(limit);
  }
  query.exec(function(err, comments) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.json(comments);
    }
  });
};

exports.allUsers = function(req, res) {
  User.find({
    name: {
      $regex: req.query.term,
      $options: '-i'
    }
  }).limit(5).exec(function(err, users) {
    res.json(users);
  });
};
