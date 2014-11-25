/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Message = require('./message.model');
var MessageList = require('./messagelist.model');

exports.register = function(socket, collection) {
  Message.schema.post('save', function (doc) {
    doc.populate('from to', 'name picture', function(err, things){
      onSave(socket, things);
    });
  });
  exports.registers = function(doc) {
    doc.populate('users', 'name', function (err, things) {
      onSaveList(collection, things);
    });
  };
};

function onSave(socket, doc, cb) {
  socket.emit('message'+ doc.list +':save', doc);
}


function onSaveList(socket, doc, cb) {
  if (socket[doc.users[0]._id] !== undefined) {
    socket[doc.users[0]._id].forEach(function(item) {
      item.emit('messagelist' + doc.users[0]._id + ':save', doc);
    });
  }
  if (socket[doc.users[1]._id] !== undefined) {
    socket[doc.users[1]._id].forEach(function(item) {
      item.emit('messagelist' + doc.users[1]._id + ':save', doc);
    });
  }
}
