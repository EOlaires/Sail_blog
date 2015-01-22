/**
 * BlogsController
 *
 * @description :: Server-side logic for managing blogs
 * @help        :: See http://links.sailsjs.org/docs/controllers

 */

module.exports = {

  //display a list of all blogs
	index: function (req, res) {	
    console.log("yuni index");
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
      console.log("yuni new");
			res.view();
  },

//--=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  //create a new blog
  create: function (req, res) {
    console.log("sample1");
    async.auto({
      blogs: function(next) {

        var params = {
          userid : req.session.user.id,
          title : req.param("titleblog"),
          post : req.param("post"),
        };
        console.log(params);
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
          console.log("sample error");
          //console.log(err);
          res.redirect("/blogs/new");
        }
        else {
          console.log("sample");
          res.redirect("/blogs");
        }
    })
  },

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
  //display a specific blog
  show: function (req, res) {
    console.log("------sdf-dsfsdf-df-dsf-d");
    async.auto({ 
      blogs: function(next) {
        var params = {
          id : req.param("id")
        };
        console.log("params:");
        console.log(params);
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
          console.log(blog);
        }
    });
  },

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
  //eturn an HTML form for editing a blog
  edit: function (req, res) {
    console.log("edieediteditedit edit edit edit");
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
        //next(null, blog);
      }
    }, function(err, result){
        if (err) {
          sails.log.error(err);
          return next(err);
        }
        else {
          var blog = result.blogs;
          console.log(blog);
          res.view({blog: blog}); // why result.blogs ung .blogs un ung name ng blogs function sa taas pwede ka pa kasi magkarron dyan ng dagdag na nd naman na irrelevant pra ispecify lang
        }
    });
  },

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
  update: function (req, res) {

    console.log("Na-Route");

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
          console.log("na-route ulit");
          res.redirect("/blogs/" + req.param("id"));
        }
    });
  },

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=
  destroy: function (req, res) {
    console.log("ayos");
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
          console.log("sobrang ayos");
          res.redirect("/blogs");
        }
    });
  }

};

