/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Repo = require('./repo.model');

exports.register = function(socket) {
  Repo.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Repo.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('repo:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('repo:remove', doc);
}