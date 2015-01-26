/**
 * BlogsController
 *
 * @description :: Server-side logic for managing blogs
 * @help        :: See http://links.sailsjs.org/docs/controllers

 */

module.exports = {

  //display a list of all blogs
	index: function (req, res) {	
    async.auto({
      blogs: function(next) {
        var params = {
          userid : req.session.user.id
        };
        Blog.find(params)
          .exec(function (err, blog) {
            if (err) {
              return next(err)
            }
            next(null, blog);          
        });
      }
    }, function (err, result) {
        if (err) {
          sails.log.error(err);
        }
        else {
          var time = new Date();
          var hour = time.getHours();
          var min = time.getMinutes();
          var sec = time.getSeconds();
          if (hour < 12) {
            var time = "Good Morning, ";
          }
          else if (hour >= 12 && hour < 18) {
            var time = "Good Afternoon, ";
          }
          else {
            var time = "Good Evening, ";
          }
          var blog = result.blogs || {};
          res.view({blog: blog, greeting: time})
        }
    })
	},

//--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //return an HTML form for creating a new blog
	new: function (req, res) {
			res.view();
  },

//--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //create a new blog
  create: function (req, res) {
    async.auto({
      blogs: function(next) {

        var params = {
          userid : req.session.user.id,
          title : req.param("titleblog"),
          post : req.param("post"),
        };
        Blog.create(params)
          .exec(function (err, blog) {
            if (err) {
              return next(err);
            }
            next(null, blog);
        });
      }
    },function(err, result) {
        if (err) {
          res.redirect("/blogs/new");
        }
        else {
          res.redirect("/blogs");
        }
    })
  },

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
  //display a specific blog
  show: function (req, res) {
    async.auto({ 
      blogs: function(next) {
        var params = {
          id : req.param("id")
        };
        Blog.find(params)
          .exec(function (err, blog) {
            if (err) {
              return next(err);
            }
            next(null, blog);
        });
      }
    }, function(err, result){
        if (err) {
          sails.log.error(err);
          return next(err);
        }
        else {
          var blog = result.blogs
          res.view({blog: blog});
        }
    });
  },

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
  //return an HTML form for editing a blog
  edit: function (req, res) {
    async.auto({
      blogs: function(next) {
        var params = {
          id : req.param("id")
        };

        Blog.findOne(params) 
          .exec(function (err, blog) {
            if (err) {
              return next(err);
            }
            next(null, blog);
        });
      }
    }, function(err, result){
        if (err) {
          sails.log.error(err);
          return next(err);
        }
        else {
          var blog = result.blogs;
          res.view({blog: blog}); 
        }
    });
  },

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
  update: function (req, res) {

    async.auto({
      blogs : function(next) {
        var params = {
          id : req.param("id")
        };
        Blog.find(params)
          .exec(function (err, blog) {
            if (err) {
              return next(err);
            }
            next(null, blog);
        });
      },
      update: ["blogs", function(next, result) {
        var params = {
            userid : req.session.user.id,
            title : req.param("titleblog"),
            post : req.param("post"),
        };
        Blog.update({id: req.param("id")}, params)
          .exec(function (err,blog) {
            if (err) {
              return next(err)
            }
            next(null, blog);
        });
      }]
    }, function (err, result) {
        if (err) {
          res.redirect("/blogs/" + req.param("id") + "/edit");
        }
        else {
          res.redirect("/blogs/" + req.param("id"));
        }
    });
  },

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
  destroy: function (req, res) {
    async.auto({
      blogs : function(next) {
        var params = {
          id : req.param("id")
        };
        Blog.find(params)
          .exec(function (err, blog) {
            if (err) {
              return next(err);
            }
            next(null, blog);
        });
      },
      destroy : ["blogs", function (next, result) {
        Blog.destroy({id:req.param("id")})
          .exec(function (err, blog) {
            if (err) {
              res.redirect("/blogs");
              return next(err);
            }
            next(null, blog)
        });
      }]
    }, function (err, result) {
        if (err) {
          sails.log.error(err);
        }
        else {
          res.redirect("/blogs");
        }
    });
  }

};

