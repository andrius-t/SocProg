'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    changed: {
      type: Date,
      default: Date.now
    },
  name: String,
  info: String,
  active: Boolean,
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  group: {
    type: Schema.ObjectId,
    ref: 'Group'
  }
});

module.exports = mongoose.model('Thing', ThingSchema);