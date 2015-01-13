'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  name: String,
  users:    [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  owner: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Group', GroupSchema);