const path = require('path');

new Promise(function(resolve, reject) {
	console.log('> Building UI components into bundle...');

	const ui = require('kokoto-ui');

	ui.build(function(error, result) {
		if (error) {
			reject(error);
		} else {
			resolve(result);
		}
	});
}).then(function(result) {
	console.log('> Creating UI apps...');

	return function(config, express, model) {
		const uiPath = path.join(path.dirname(require.resolve('kokoto-ui')), 'dist');

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
	};
}).then(function(uiApp) {
	console.log('> Creating server instance...');

	const Server = require('kokoto-httpd');

	const config = require('./config.js');
	config.url = '/api',
	config.apps = [uiApp];

	return Server(config);
}).then(function(server) {
	console.log('> Launching server...');

	return new Promise(function(resolve, reject) {
		server.listen(8080, function(error) {
			if (error) {
				return reject(error);
			} else {
				return resolve();
			}
		});
	});
}).then(function() {
	console.log('> Ready!');
}).catch(function(error) {
	console.log(error.stack);
});