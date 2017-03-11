const _ = require('lodash');
const path = require('path');
const crypto = require('crypto');
const http = require('http');
const Express = require('express');

const middlewares = require('./middlewares');

const defaultConfig = {
	path: path.join(__dirname, '..'),
	url: '',
	secret: crypto.randomBytes(32).toString('base64'),
	session: 'session',
	database: {
		client: 'mysql2',
		connection: 'mysql://127.0.0.1:3306/Kokoto',
		schemaPostfix: ''
	},
	site: {
		name: 'Kokoto',
		pagination: 20,
		locale: 'ko'
	},
	debug: false
};

class KokotoHttpd extends http.Server {
	constructor(config) {
		const express = Express();
		const model = {};
		config = _.defaults(config, defaultConfig);

		middlewares.forEach(function(middleware) {
			return middleware(express, model, config);
		});

		super(express);
		this.express = express;
		this.model = model;
		this.config = config;
	}
}

module.exports = KokotoHttpd;