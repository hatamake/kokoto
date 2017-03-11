const Express = require('express');

const appInits = require('../apps');

function middleware(express, model, config) {
	const router = Express.Router();

	appInits.forEach(function(appInit) {
		appInit(router, model, config);
	});

	express.use(`${config.url}/api`, router);
}

module.exports = middleware;