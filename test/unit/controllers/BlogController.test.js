require("sails-test-helper");

describe(TEST_NAME, function() {

	before(function (done) {
		async.auto({
			user_create: function (next) {
				var args = {
					first_name: "Roberta",
					last_name: "Garcia",
					username: "rgarcia",
					password: "password"
				};
				User.create(args, next);
			},
			user_login: ["user_create", function (next, result) {
				var user_object = {
					user: result.user_create.username,
					pass: result.user_create.password
				};
				fakeSignIn(user_object, next);
			}],
			user: function(next) {
				factory.build("blogcontent", function(obj) {
					blog_obj = obj;
					next();
				});
			}
		}, function (err, result) {
			console.log(result);
			Cookies = result.user_login;
			console.log(Cookies);
			done();
		});
	});

  	describe("GET /blogs", function () {

	    it("should display list of blogs", function (done) {
	    	request.get("/blogs")
	    		.expect(200)
	    		.end(function (err, res){
	    			expect(err).to.not.exists;
	    			console.log(err);
	    			//console.log(res.body);
	    			done();
	    		});
	    });
	});

	describe("GET /blogs/new", function () {
		it("should display a new form for creating a new blog", function (done) {
			request.get("/blogs/new")
				.expect(200)
				.end(function (err, res){
					expect(err).to.not.exists;
					done();
				});
		});
	});

	describe("POST /blogs", function () {
		it("should display updated list of blogs", function (done) {
			_blog = _.clone(blog_obj);
			var args = {
	          //userid : Cookies,
	          titleblog : _blog.title,
	          post : _blog.post
	        };
			request.post("/blogs")
				.send(args)
				.expect(200)
				.expect("Location", "/blogs")
				.expect(302, done);
		});
	});

	describe("GET /blogs/:id", function () {
		it("should display a specific blog", function (done) {
			
			request.get("/blogs/1")
				.expect(200)
				.end(function (err, res){
					expect(err).to.not.exists;
					done();
				});

		});
	});

	describe("GET /blogs/:id/edit", function () {
		it("should display a form for editing a blog", function (done) {
			
			request.get("/blogs/1/edit")
				.expect(200)
				.end(function (err, res){
					expect(err).to.not.exists;
					done();
				});

		});
	});

	describe("PUT /blogs/:id", function () {
		it("should display a specific blog", function (done) {
			
			_blog = _.clone(blog_obj);
			var args = {
	          //userid : Cookies,
	          titleblog : _blog.title,
	          post : _blog.post
	        };
			request.put("/blogs/1")
				.send(args)
				.expect(200)
				.expect("Location", "/blogs/1")
				.expect(302, done);

		});
	});

	describe("DELETE /blogs/:id", function () {
		it("should display a specific blog", function (done) {
			
			request.delete("/blogs/1")
				.expect(200)
				.expect("Location", "/blogs")
				.expect(302, done);

		});
	});



});

function fakeSignIn(user_object, next) {
  request.post("/signin")
    .send(user_object)
    .end(function(err, res) {
      next(null, res.headers['set-cookie'].pop().split(';')[0]);
    });
 
}