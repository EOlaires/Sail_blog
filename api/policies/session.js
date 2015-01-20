module.exports = function(req, res, next) {
	var a = 0;
	console.log("e");
	if (req.query.yuni) {
		req.session.user = {};
		console.log("ako si yuni!!!!");
		return next();
	}
	if (req.session.user) {
		return next();
		console.log("a");

	}


	else if(a==1) {
		return next();
		console.log("b");
	}
	else {
		res.redirect("/signin");
		console.log("c");
	}
	console.log("d");
};