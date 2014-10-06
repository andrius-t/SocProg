'use strict';

var comments = require('../controllers/comments');

// Comment authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.comment.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

// The Package is past automatically as first parameter
module.exports = function(Comments, app, auth, database) {

  app.route('/comments')
    .post(auth.requiresLogin, comments.create);

  app.route('/comments/parent/:parentId')
    .get(comments.fetchByParent);

  app.route('/comments/:commentId')
    .get(comments.show)
    .put(auth.requiresLogin, hasAuthorization, comments.update)
    .delete(auth.requiresLogin, hasAuthorization, comments.destroy);

  // Fetch User With query params
  app.get('/tag/users/', comments.allUsers);

  // Finish with setting up the postId param
  app.param('commentId', comments.comment);
};
