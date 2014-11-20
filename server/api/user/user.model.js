'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var authTypes = ['github'];
var githubApi = require('github');

var UserSchema = new Schema({
  name: String,
  picture: {type: String, default: 'img.jpg'},
  role: {
    type: String,
    default: 'user'
  },
  created: {
    type: Date,
    default: Date.now
  },
  follows:    [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  local: {
    name: String,
    email: {type: String, lowercase: true},
    password: String
  },
  provider: String,
  github: {}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this.local._password = password;
    this.local.password = this.encryptPassword(password);
  })
  .get(function() {
    return this.local._password;
  });

UserSchema
  .virtual('email')
  .set(function (email) {
    this.local.email = email;
  })
  .get(function () {
    return this.local.email;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role,
      'email': this.local.email,
      'picture': this.picture,
      'created': this.created,
      'follows': this.follows
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */


//UserSchema

// Validate empty password
UserSchema
  .path('local.password')
  .validate(function(password) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return password.length;
  }, 'Password cannot be blank');

// Validate empty email
UserSchema
  .path('local.email')
  .validate(function(email) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return email.length;
  }, 'Email cannot be blank');

// Validate email is not taken
UserSchema
  .path('local.email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({'local.email': value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
  }, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.local.password) && authTypes.indexOf(this.provider) === -1)
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return bcrypt.compareSync(plainText, this.local.password);
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password) return '';
    return bcrypt.hashSync(password);
  },

  /**
   * Returns authenticated githubApi
   *
   * @returns {githubApi}
   */
  githubApi: function() {
    var github = new githubApi({
      // required
      version: "3.0.0",
      // optional
      debug: true,
      protocol: "https"
    });

    github.authenticate({
      type: "oauth",
      token: this.github.token
    });

    return github
  }
};

module.exports = mongoose.model('User', UserSchema);
