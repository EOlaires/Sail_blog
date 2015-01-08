var passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy,
    request = require("request");
    // skey = require("skey");

module.exports = {

  //============================================================================
  //-- "private"

  _accessToken: "",

  //-- config
  //-- needed to wrap since sails instance is only available after the exports
  _getConfig: function() {
    return {
      pkey: sails.config.voyager.pkey || "",
      auth_url: sails.config.voyager.auth_url || "",
      access_token_url: sails.config.voyager.access_token_url || "",
      accounts_api_url: sails.config.voyager.accounts_api_url || "",
      request_timeout: sails.config.voyager.request_timeout || 30000,
      credentials: sails.config.voyager.credentials || {}
    };
  },

  //----------------------------------------------------------------------------

 _decryptUser: function(data, done) {
    var config = this._getConfig();
    var skeyCrypto = new skey.Skey(config.pkey);
    var user = null;

    skeyCrypto.decrypt(data.s, function(err, rawSkey) {
      if (rawSkey) {
        user = {
          voyager_id: rawSkey.user_id,
          username: rawSkey.user_name,
          mdsp_id: rawSkey.mdsp_id
        };
      }
      done(err, user);
    });
  },

  //----------------------------------------------------------------------------

  _saveUser: function(vUser, done) {
    var self = this;

    async.auto({
      user: function(next) {
        User.findOne({mdsp_id: vUser.mdsp_id}, function(err, user) {
          if (user) {
            next(err, user);
          } else {
            User.create(vUser, function(err, user) {
              next(err, user);
            });
          }
        });
      },
      profile: ["user", function(next, result) {
        //-- we don't care too much if profile creation fails
        var user = result.user;
        Profile.findOne({user_id : user.id}, function(err, profile) {
          if (profile && profile.first_name) {
            next(null, profile);
          } else {
            self._getProfile(vUser, function(err, vProfile) {
              if (!vProfile) {
                return next();
              }
              if (profile) {
                Profile.update({ id: profile.id }, {
                  first_name: vProfile.first_name,
                  last_name: vProfile.last_name
                }, function(err, profile) {
                  next(null, profile);
                });
              } else {
                Profile.create({
                  user_id: user.id,
                  first_name: vProfile.first_name,
                  last_name: vProfile.last_name
                }, function(err, profile) {
                  next(null, profile);
                });
              }
            });
          }
        });
      }],
      updateAttrs: ["user", function(next, result) {
        var user = result.user;
        var attrs = {};

        if (user && !user.voyager_id) {
          attrs.voyager_id = vUser.voyager_id;
        }
        if (user && (!user.username || user.username != vUser.username)) {
          attrs.username = vUser.username;
        }
        next(null, attrs);
      }],
      updatedUser: ["updateAttrs", function(next, result) {
        var user = result.user;
        var updateAttrs = result.updateAttrs;

        if (_.isEmpty(updateAttrs)) {
          next(null, user);
        } else {
          User.update({id: user.id}, updateAttrs, function(err, users) {
            next(err, _.first(users) || user);
          });
        }
      }]
    }, function(err, result) {
      done(err, result.updatedUser);
    });
  },

  //----------------------------------------------------------------------------

  _serializeUser: function(user, done) {
    done(null, user);
  },

  //----------------------------------------------------------------------------

  _deserializeUser: function(user, done) {
    //-- return user if serialized value is a user object
    if (_.isObject(user)) {
      return done(null, user);
    }
    //-- otherwise, assume serialized user is a user id
    User.findById(user).exec(function(err, user) {
      done(err, user);
    });
  },

  //----------------------------------------------------------------------------

  _authenticate: function(username, password, done) {
    var self = this;
    var config = this._getConfig();

    _.merge(config.credentials, { username: username, password: password });

    var options = {
      url: config.auth_url,
      json: config.credentials,
      timeout: config.request_timeout
    }
    request.post(options, function(error, response, body) {
      if (error) {
        sails.log.error("VoyagerPassport: authenticate: error: ", username, error);
        return done(error);
      }

      switch (response.statusCode) {
        case 200:
          self._accessToken = body.access_token;
          self._decryptUser(body, function(err, user) {
            if (err) {
              sails.log.error("VoyagerPassport: authenticate: decrypt: ", username, err);
              done(err);
            }
            self._saveUser(user, done);
          });
          break;

        case 408:
          sails.log.error("VoyagerPassport: authenticate: timeout: ", username, body);
          done(new Error("Request timed out!"));
          break;

        default:
          sails.log.error("VoyagerPassport: authenticate: fail: ", username, body);
          done(null, false, body);
      }
    });
  },

  //----------------------------------------------------------------------------

  _getProfile: function(vUser, done) {
    var self = this;
    var config = this._getConfig();

    var options = {
      url: config.accounts_api_url,
      timeout: config.request_timeout,
      headers: {
        Authorization: "Bearer " + self._accessToken
      },
    }
    request.get(options, function(error, response, body) {
      var data = {};

      try {
        data = JSON.parse(body);
      } catch(e) {
        //-- error, do nothing...
      };

      if (error) {
        sails.log.error("VoyagerPassport: getProfile: error: ", vUser, error);
        return done(error);
      }

      switch (response.statusCode) {
        case 200:
          var profile = {
            first_name : data.first_name,
            last_name : data.last_name
          };
          done(null, profile);
          break;

        case 408:
          sails.log.error("VoyagerPassport: getProfile: timeout: ", vUser, data);
          done(new Error("Request timed out!"));
          break;

        default:
          sails.log.error("VoyagerPassport: getProfile: fail: ", vUser, data);
          done(data);
      }
    });
  },

  //----------------------------------------------------------------------------

  _getAccessToken: function(params, done) {
    var self = this;
    var config = this._getConfig();

    var options = {
      url: config.access_token_url,
      timeout: config.request_timeout,
      qs: _.merge(config.credentials, params)
    }

    request.get(options, function(error, response, body) {
      var data = {};

      try {
        data = JSON.parse(body);
      } catch(e) {
        //-- error, do nothing...
      };

      if (error) {
        sails.log.error("VoyagerPassport: getAccessToken: error: ", error);
        return done(error);
      }

      switch (response.statusCode) {
        case 200:
          self._accessToken = data.access_token;
          self._decryptUser(data, function(err, user) {
            if (err) {
              sails.log.error("VoyagerPassport: getAccessToken: decrypt: ", err);
              done(err);
            }
            self._saveUser(user, done);
          });
          break;

        case 408:
          sails.log.error("VoyagerPassport: getAccessToken: timeout: ", data);
          done(new Error("Request timed out!"));
          break;

        default:
          sails.log.error("VoyagerPassport: getAccessToken: fail: ", data);
          done(null, false, data);
      }
    });
  },

  //============================================================================
  //-- "public"

  initialize: function(options) {
    var self = this;
    var opts = options || {};
    var passport_opts = {
      usernameField: opts.usernameField || "username",
      passwordField: opts.passwordField || "password"
    };

    //-- Passport session setup.
    //-- To support persistent login sessions, Passport needs to be able to
    //-- serialize users into and deserialize users out of the session. Typically,
    //-- this will be as simple as storing the user ID when serializing, and finding
    //-- the user by ID when deserializing.
    passport.serializeUser(self._serializeUser);
    passport.deserializeUser(self._deserializeUser);

    //-- Use the LocalStrategy within Passport.
    //-- Strategies in passport require a `verify` function, which accept
    //-- credentials (in this case, a username and password), and invoke a callback
    //-- with a user object.
    passport.use(new LocalStrategy(
      //-- custom username and password fields...
      passport_opts,

      function(username, password, done) {
        //-- asynchronous verification, for effect...
        process.nextTick(function() {
          self._authenticate(username, password, done);
        });
      }
    ));

    return self;
  },

  //----------------------------------------------------------------------------

  authenticate: function(done) {
    var self = this;
    return function(req, res) {
      passport.authenticate("local", function(err, user, info) {
        done(err, user, info);
      })(req, res);
    }
  },

  //----------------------------------------------------------------------------

  getAccessToken: function(done) {
    var self = this;
    return function(req, res) {
      var params = {
        code: req.param("code"),
        redirect_uri: req.baseUrl + req.originalUrl
      };
      self._getAccessToken(params, function(err, user, info) {
        done(err, user, info);
      });
    }
  }

}.initialize(/*{ usernameField: "username", passwordField: "password" }*/);