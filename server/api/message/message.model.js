'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  list : {
    type: Schema.ObjectId,
    ref: 'MessageList'
  },
  created: {
    type: Date,
    default: Date.now
  },
  from: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  body: String
});

module.exports = mongoose.model('Message', MessageSchema);
