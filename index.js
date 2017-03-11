const Promise = require('bluebird');
const path = require('path');

const config = require('./config');
const Server = require('./server');
const {sendFile} = require('./server/utils/sendFile');
const build = require('./build');

const staticDir = path.join(__dirname, 'static');
const indexFilepath = path.join(staticDir, 'index.html');

const server = new Server(config);

Promise.resolve()
	.then(function() {
		server.express.get(/^\/(css|fonts|js|images)\/(.+?)$/, function(req, res, next) {
			const filepath = path.join(staticDir, req.params[0], req.params[1]);
			sendFile(res, filepath).catch(next);
		});

		server.express.get('*', function(req, res, next) {
			sendFile(res, indexFilepath).catch(next);
		});
	})
	.then(build)
	.then(function() {
		return Promise.promisify(function(callback) {
			if (Array.isArray(config.listen)) {
				server.listen.bind(server, config.listen)(callback);
			} else if (config.listen) {
				server.listen(config.listen, callback);
			} else {
				server.listen(8080, callback);
			}

			console.log('> Ready');
		})();
	})
	.catch(function(error) {
		console.log('> Failed');
		console.log((error && error.stack) || error);
	});