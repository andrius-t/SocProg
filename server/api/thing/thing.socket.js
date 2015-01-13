/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var thing = require('./thing.model');
var User = require('../user/user.model');
var Group = require('../group/group.model');
var data = require('../../config/socketio');

exports.register = function() {
  thing.schema.post('save', function (doc) {
    var collection = data.collection;
    doc.populate('user', 'picture name', function(err, things){
      if(things.group === undefined) {
        User.find({$and: [
          {follows: {$in: [things.user._id]}},
          {_id: {$in: Object.keys(collection)}}
        ]}, '_id notifications menu_noti', function (err, users) {
          if (!err) {
              onSave(collection, things, users);
          }
        });
      }else {
        Group.findOne({_id : things.group}, function(err, group){
          if(!err){
            User.find({$and:[{_id:{$in: Object.keys(collection)}},{_id:{$in: group.users}}]}, '_id notifications menu_noti',function(err, users){
              //console.log(users);
              onSaveGroup(collection, things, users);

            });
            //onSaveGroup(collection, things, users.users);
          }
        });
      }
    });
  });
  thing.schema.post('remove', function (doc) {
    var collection = data.collection;
    if(doc.group === undefined) {
      User.find({$and: [
        {follows: {$in: [doc.user]}},
        {_id: {$in: Object.keys(collection)}}
      ]}, '_id', function (err, users) {
        if (!err) {
            onRemove(collection, doc, users);

        }
      });
    }else{
      Group.findOne({_id : doc.group}, function(err, group){
        if(!err){
          User.find({$and:[{_id:{$in: Object.keys(collection)}},{_id:{$in: group.users}}]},'_id notifications menu_noti', function(err, users){
            //console.log(users);
            onRemoveGroup(collection, doc, users);

          });
        }
      });
    }
  });
};
function onSaveGroup(socket, doc, users, cb){
  for(var i in users) {
    //console.log(users[i]);
    socket[users[i]._id].forEach(function (item) {
      item.emit('group' + doc.group + ':save', doc);
    });
  }

}
//main, profile
function onSave(socket, doc, users, cb) {
  //console.log(users);
  socket[doc.user._id].forEach(function(item) {
    item.emit('main'+doc.user._id+':save', doc);
    item.emit('profile'+doc.user._id+':save', doc);
  });

  var notification = {from: doc.user._id, picture: doc.user.picture, message: 'New post by '+doc.user.name, url: 'profile/'+doc.user._id};
  for(var i in users){
    socket[users[i]._id].forEach(function(item) {

      item.emit('main'+users[i]._id+':save', doc);
      item.emit('notification'+users[i]._id+':save', notification);
      item.emit('noti'+users[i]._id, true);
      users[i].notifications.push(notification);
      users[i].menu_noti = true;
      users[i].save();

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

function onRemoveGroup(socket, doc, users, cb) {

  for(var i in users){
    socket[users[i]._id].forEach(function(item) {
      item.emit('group'+doc.group+':remove', doc);
    });
  }
}