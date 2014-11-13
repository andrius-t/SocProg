'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MessageList = new Schema({
  users:    [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  last: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  updated: {
    type: Date,
    default: Date.now
  },
  seen: Boolean

});
module.exports = mongoose.model('MessageList',MessageList);
