const Promise = require('bluebird');
const formidable = require('formidable');

const {HttpError} = require('../middlewares/error');

function parseIncomingForm(req, uploadDirPath, callback) {
	const type = req.get('Content-Type');

	if (!type) {
		return Promise.reject(new HttpError('request_invalid', 401));
	} else if (type.startsWith('multipart/form-data')) {
		const form = new formidable.IncomingForm();

		form.uploadDir = uploadDirPath;
		form.keepExtensions = true;

		return Promise.promisify(form.parse, {
			context: form,
			multiArgs: true
		})(req);
	} else if (type.startsWith('application/x-www-form-urlencoded')) {
		return Promise.resolve([req.body, {}]);
	} else {
		return Promise.resolve([{}, {}]);
	}
}

exports.parseIncomingForm = parseIncomingForm;