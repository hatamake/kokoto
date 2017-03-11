const {HttpError} = require('../middlewares/error');

module.exports = function(express, model, config) {
	express.get('/site/:key', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {key} = req.params;

		if (!config.site.hasOwnProperty(key)) {
			return next(new HttpError('site_key_not_exist', 404));
		}

		res.json({ value: config.site[key] });
	});
};