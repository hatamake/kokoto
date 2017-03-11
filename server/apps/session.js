module.exports = function(express, model, config) {
	express.put('/session', function(req, res, next) {
		const {id, password} = req.body;

		model.user.auth(id, password)
			.then(function(user) {
				req.session.user = user;
				res.json({ user: user });
			})
			.catch(next);
	});

	express.delete('/session', function(req, res, next) {
		if (res.shouldSignin()) { return; }
		
		req.session.destroy(function(error) {
			if (error) {
				next(error);
			} else {
				res.json({});
			}
		});
	});
};