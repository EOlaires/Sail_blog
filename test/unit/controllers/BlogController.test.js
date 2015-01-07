require('test_helper');

describe(TEST_NAME, function() {


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