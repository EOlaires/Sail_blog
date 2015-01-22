module.exports = function(req, res, next) {
	console.log("e");
	// if (req.query.yuni) {
	// 	req.session.user = {};
	// 	console.log("ako si yuni!!!!");
	// 	return next();
	// }
	if (req.session.user) {
		return next();
		console.log("a");
	}
	else {
		res.redirect("/signin");
		console.log("c");
	}
	console.log("d");
};