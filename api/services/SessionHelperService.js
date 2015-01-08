function SessionHelperService(){}


SessionHelperService.prototype.setSession = function(req, user) {
	req.session.user = user;
}
SessionHelperService.prototype.destroySession = function(req, user) {
	req.session.destroy();
}

module.exports = SessionHelperService;