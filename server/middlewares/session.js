const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const {HttpError} = require('./error');

function middleware(express, model, config) {
	express.use(session({
		store: new KnexSessionStore({ knex: model._knex }),
		secret: config.secret,
		name: config.session.name,
		resave: false,
		saveUninitialized: false
	}));

	express.use(function(req, res, next) {
		res.shouldSignin = function() {
			if (!req.session || !req.session.user) {
				next(new HttpError('login_required', 403));
				return true;
			} else {
				return false;
			}
		};

		next();
	});
}

module.exports = middleware;