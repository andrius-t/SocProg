/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var thing = require('./thing.model');
var User = require('../user/user.model');
exports.register = function(collection) {
  thing.schema.post('save', function (doc) {
    doc.populate('user', 'picture name ', function(err, things){
      User.find({$and: [{follows: {$in: [things.user._id]}},{_id: {$in: Object.keys(collection)}}]},'_id', function(err, users){
        if (!err){
          onSave(collection, things, users);
        }
      });
    });
  });
  thing.schema.post('remove', function (doc) {
    User.find({$and: [{follows: {$in: [doc.user]}},{_id: {$in: Object.keys(collection)}}]},'_id', function(err, users){
      if (!err){
        onRemove(collection, doc, users);

      }
    });
  });
};
//main, profile
function onSave(socket, doc, users, cb) {
  //console.log(users);
  socket[doc.user._id].forEach(function(item) {
    item.emit('main'+doc.user._id+':save', doc);
    item.emit('profile'+doc.user._id+':save', doc);
  });

  for(var i in users){
    socket[users[i]._id].forEach(function(item) {
      item.emit('main'+users[i]._id+':save', doc);
    });
  }

}

function onRemove(socket, doc, users, cb) {
  //console.log(users);

  socket[doc.user].forEach(function(item) {
    item.emit('main'+doc.user+':remove', doc);
    item.emit('profile'+doc.user+':remove', doc);
  });
  for(var i in users){
    socket[users[i]._id].forEach(function(item) {
      item.emit('main'+users[i]._id+':remove', doc);
    });
  }
}
