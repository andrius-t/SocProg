'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


/**
 * Post Schema
 */
var CommentSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  changed: {
    type: Date,
    default: Date.now
  },
  body: {
    type: String,
    trim: true,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    index: true
  },
  mentionsUsers: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  userPicture: {
    type: String
  },
  userName: {
    type: String
  },
  parent: {
    type: Schema.ObjectId,
    ref: 'Article',
    index: true
  },
  likes: [{
    type: Schema.ObjectId,
    ref: 'User'
  }]
});

/**
 * Validations
 */
CommentSchema.path('body').validate(function(message) {
  return message.length;
}, 'Comment cannot be blank');

/**
 * Statics
 */
CommentSchema.statics.load = function(id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username picture').exec(cb);
};
CommentSchema.set('versionKey', false);
mongoose.model('Comment', CommentSchema);
