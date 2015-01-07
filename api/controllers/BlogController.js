/**
 * BlogsController
 *
 * @description :: Server-side logic for managing blogs
 * @help        :: See http://links.sailsjs.org/docs/controllers

 */

module.exports = {

	blog: function (req, res) {	
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
            console.log("c");
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

	new: function (req, res) {
			res.view();
  },

  addblog: function (req, res) {
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
          res.redirect("/blog/new");
        }
        else {
          res.redirect("/blog");
        }
    })
  },

  view: function (req, res) {
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

  update: function (req, res) {
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
        //next(null, blog);
      }
    }, function(err, result){
        if (err) {
          sails.log.error(err);
          return next(err);
        }
        else {
          var blog = result.blogs
          res.view({blog: blog}); // why result.blogs ung .blogs un ung name ng blogs function sa taas pwede ka pa kasi magkarron dyan ng dagdag na nd naman na irrelevant pra ispecify lang
        }
    });
  },

  updated: function (req, res) {

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
          res.redirect("/blog/" + req.param("id") + "/edit");
        }
        else {
          res.redirect("/blog/" + req.param("id"));
        }
    });
  },

  delete: function (req, res) {
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
          res.redirect("/blog");
        }
    });
  }

};

