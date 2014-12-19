/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Message = require('./message.model');
var MessageList = require('./messagelist.model');
var User = require('../user/user.model');


exports.register = function(socket) {
  Message.schema.post('save', function (doc) {
    doc.populate('from to', 'name picture menu_message', function(err, things){
      onSave(socket, things);
    });
  });

};
exports.socket = function(doc, collection) {
  if(collection !== undefined) {
    doc.populate('users', 'name', function (err, things) {
      onSaveList(collection, things);
    });
  }
};

function onSave(socket, doc, cb) {
  socket.emit('message'+ doc.list +':save', doc);
  /*User.findById(doc.to._id, function(err, user){
    if (err) { return handleError(res, err); }
    user.menu_message = true;
  });*/
  var user = doc.to;
  user.menu_message = true;
  user.save(function (err) {
    if (err) { return handleError(res, err); }
    socket.emit('message'+ user._id, true);
  });
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
