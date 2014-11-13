'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
/*    mentionsUsers: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    userPicture: {
        type: String
    },
    userName: {
        type: String
    },*/
    parent: {
        type: Schema.ObjectId,
        ref: 'Thing',
        index: true
    }
/*    likes: [{
        type: Schema.ObjectId,
        ref: 'User'
    }]*/
});

module.exports = mongoose.model('Comment', CommentSchema);
