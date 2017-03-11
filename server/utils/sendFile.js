const Promise = require('bluebird');

function sendFile(res, filepath) {
	return Promise.promisify(res.sendFile, { context: res })(filepath);
}

exports.sendFile = sendFile;