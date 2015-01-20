/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	signin: function (req, res) {
    var error_message = req.session.flash || "";
    req.session.flash = "";
		res.view({error_message: error_message});
	},

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
	signup: function (req, res) {

      //var error_message = req.session.flash || "";
      //req.session.flash = "";
      //res.view({message:error_message.message, fname: error_message.fname, lname: error_message.lname, user: error_message.user});
      res.view({message: ""});
	},

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
	usersignin: function (req, res) {
    console.log("asdaksjdhasljdhasl;jdhas ");
      async.auto({
        users: function(next) {
          var params = {
            username : req.param("user"),
            password : req.param("pass")
          }
          User.findOne(params)
            .exec(function (err, user) {
              if (err) {
                return next(err);
              }
              if (!user) {               
                return next("Incorrect Username or Password!")
              }
              return next(null, user);
          });
        }
    }, function (err, result) {

        if (err) {
          req.session.flash = err;
          res.redirect("/signin");
        }
        else {
        //  console.log("eto un", result);
          var user = result.users || {};
          req.session.user = user;
          var sessionHelper = new SessionHelperService();
          
          sessionHelper.setSession(req, user);
          console.log(req.session);
          res.redirect("/blogs");
        }
    });

  },

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
	create: function (req, res) {

    //console.log(req.params.all());
    if (req.param("pass") === req.param("confirmpass")) {
      async.auto({
        user: function(next) {
          var params = {
            first_name : req.param("fname"),
            last_name : req.param("lname"),
            username : req.param("user"),
            password : req.param("pass")
          };
          User.create(params)
            .exec(function (err, user) {         
            if (err) {
              return next(err);
            } 
            next(null, user);
          });
        }
      }, function (err, result) {
        //console.log("====");
        //console.log(err);

          if (err) {
            //res.redirect("/signup");
            res.view("user/signup", {message: "Username already exist!", fname: req.param("fname"), lname:req.param("lname"), user:""});
          }
          else {
            req.session.user = result.user;
            res.redirect("/blogs");
          }
      });
    } 
    else {
      //req.session.flash = {message: "Mismatch Password", fname: req.param("fname"), lname:req.param("lname"), user:req.param("user")};
      res.view("user/signup", {message: "Mismatch Password", fname: req.param("fname"), lname:req.param("lname"), user:req.param("user")});
    } 
	},

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
	signout: function (req, res) {
    var sessionHelper = new SessionHelperService();
    sessionHelper.destroySession(req);
		res.redirect("/signin");
	}

};

