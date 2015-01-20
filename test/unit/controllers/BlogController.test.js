require('test_helper');

describe(TEST_NAME, function() {

	// beforeEach(function(done) {
 //    	user = {id: 1, username: "zander"}
 //    	testSignin(user, done);
 // 	 });

	 //var agent = request.agent() ;

	  // before(function(done){
	  //     agent
	  //       .post('/signin')
	  //       .send({user: 'test', pass: 'password'})
	  //       .end(function(err, res) {
	  //         if (err) return done(err);
	  //         console.log("test before");
	  //         done();
	  //       });
	  // });

	


  	describe("GET /blog", function () {

	    it("should display list of blogs", function (done) {
	    	var a = 1;
	    	request.get("/blogs?yuni=test")
	    		.expect(200)
	    		.end(function (err, res){
	    			expect(err);
	    			console.log(err);
	    			console.log(res.body);
	    			done();
	    		});
	    });
	});


});