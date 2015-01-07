require('test_helper');

describe(TEST_NAME, function() {

	before(function(done) {
    	user = {id: 1, username: "zander"}
    	signIn(user, done);
 	 });

  	describe("GET /blog", function () {

	    it("should display list of blogs", function (done) {
	    	request.get("/blog")
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