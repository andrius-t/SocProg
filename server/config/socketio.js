/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var User = require('../api/user/user.model');
var collection = {};

//require('../api/thing/thing.socket').send(collection);

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

//require('../api/thing/thing.socket').register(collection);
//require('../api/message/message.socket').info(collection);

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/message/message.socket').register(socket);
  require('../api/repo/repo.socket').register(socket);
  require('../api/comment/comment.socket').register(socket);
  //require('../api/thing/thing.socket').register(socket);

}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  socketio.use(require('socketio-jwt').authorize({
     secret: config.secrets.session,
     handshake: true
   }));

  socketio.on('connection', function (socket) {
      if (collection[socket.decoded_token._id] === undefined){
        collection[socket.decoded_token._id] = [socket];

      } else {
        collection[socket.decoded_token._id].push(socket);
      }
      socket.connectedAt = new Date();

      // Call onDisconnect.
      socket.on('disconnect', function () {
        var index = collection[socket.decoded_token._id].indexOf(socket);
        if (index > -1) {
          collection[socket.decoded_token._id].splice(index, 1);
        }
        onDisconnect(socket);
        console.info('[%s] DISCONNECTED');
      });

      // Call onConnect.
      onConnect(socket);
      console.info('[%s] CONNECTED');
   });



};
module.exports.collection = collection;