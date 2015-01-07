require('test_helper');

describe(TEST_NAME, function() {

	beforeEach(function(done) {
		async.series({
			user: function(next) {
				Factory.build("user", function(obj) {
					user_obj = obj;
					next();
				});
			}
		}, done);
	});

	describe("GET /signup", function () {

		it("should display the signup page", function (done) {
			request.get("/signup")
				.expect(200)	
				.end(function(err, res){	
					expect(err).to.not.exist;
					done();					
				});
		});
	});

	describe("POST /signup (register a new user)", function() {
		function blogUsers() {
			_user = _.clone(user_obj);
				var args = {
					fname: _user.first_name,
					lname: _user.last_name,
					user: _user.username,
					pass: _user.password,
					confirmpass: _user.password
				};
		}

		// it("should be able to add & register new User", function (done) {
			
		// 	//delete _user.first_name;
		// 	request.post("/signup")
		// 		.send(args)
		// 		.expect(200)
  //      			.expect("Location", "/blog")
  //       		.expect(302, done);
		// });

		it("should be succesful", function() {
			request.post("/signup")
				.send(blogUsers.args)
				.expect(200)
				.end(function(err, res){
					expect(err).to.not.exist;
					done();
				});
		});

		it("should return 'First Name is required' error when no delivery mode is passed", function() {
			_user = _.clone(user_obj);
			var args = {
				fname: _user.first_name,
				lname: _user.last_name,
				user: _user.username,
				pass: _user.password,
				confirmpass: _user.password
			};
			request.post("/signup")
				.send(args)
				.expect
		});

	});

	describe("GET /signin", function() {
		it("should display the signin page", function (done) {
			request.get("/signin")
				.expect(200)
				.end(function(err, res){
					expect(err).to.not.exist;
					done();
				});
		});
	});

	describe("POST /signin", function() {
		it("should diplay the blog page", function (done) {
			_user = _.clone(user_obj);
			var args = {
				user: _user.username,
				pass: _user.password
			};
			//delete _user.first_name;
			request.post("/signin")
				.send(args)
				.expect(200)
       			.expect("Location", "/blog")
        		.expect(302, done);
		})
	});

});