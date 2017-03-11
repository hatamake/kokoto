class HttpError extends Error {
	constructor(messageId, status) {
		super(messageId);
		this.name = 'HttpError';

		this.status = status;
	}
}

function middleware(express, model, config) {
	express.use(function(error, req, res, next) {
		const status = (isNaN(error.status) ? 500 : error.status);
		const message = res.__(error.message);

		res.status(status);

		if (config.debug) {
			res.json({
				error: {
					name: error.name,
					message: message,
					stack: error.stack
				}
			});
		} else {
			res.json({
				error: {
					message: message
				}
			});
		}
	});
}

module.exports = middleware;
module.exports.HttpError = HttpError;