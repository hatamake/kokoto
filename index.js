const path = require('path');
const async = require('async');

const UI = require('kokoto-ui');
const Httpd = require('kokoto-httpd');

const config = require('./config.js');

async.waterfall([
	function(callback) {
		console.log('> Building UI components into bundle...');

		UI.build(function(error, result) {
			if (error) {
				callback(error, null);
			} else {
				callback(null, result.compilation.outputOptions.path);
			}
		});
	},
	function(uiPath, callback) {
		console.log('> Creating UI apps...');

		callback(null, function(config, express, model) {
			function sendFileCallback(res, error) {
				if (error) {
					res.status(error.statusCode || 500).end();
				}
			}

			express.get(/^\/(css|fonts|js)\/(.+?)$/, function(req, res) {
				const type = req.params[0];
				const filepath = req.params[1];

				res.sendFile(
					path.join(uiPath, type, filepath),
					sendFileCallback.bind(this, res)
				);
			});

			express.get('*', function(req, res) {
				res.sendFile(
					path.join(uiPath, 'index.html'),
					sendFileCallback.bind(this, res)
				);
			});
		});
	},
	function(uiApp, callback) {
		console.log('> Creating server instance...');

		callback(null, Httpd({
			url: '/api',
			secret: config.secret,
			db: config.db,
			session: config.session,
			apps: [uiApp],
			pagination: config.pagination
		}));
	},
	function(httpd, callback) {
		console.log('> Launching server...');

		if (Array.isArray(config.listen)) {
			httpd.listen.bind(httpd, config.listen)(callback);
		} else if (config.listen) {
			httpd.listen(config.listen, callback);
		} else {
			httpd.listen(8080, callback);
		}
	}
], function(error) {
	if (error) {
		throw error;
	}

	console.log('> Ready!');
});