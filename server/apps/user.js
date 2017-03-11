const Promise = require('bluebird');
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');

const {parseIncomingForm} = require('../utils/formidable');
const {sendFile} = require('../utils/sendFile');

module.exports = function(express, model, config) {
	const uploadDirPath = path.join(config.path, 'static', 'images', 'user');
	const defaultPicturePath = path.join(uploadDirPath, 'default.png');

	express.post('/user', function(req, res, next) {
		const {id, password, name} = req.body;

		model.user.create(id, password, name)
			.then(function(user) {
				req.session.user = user;
				res.json({ user: user });
			})
			.catch(next);
	});

	express.get('/user/:id', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id} = req.params;

		Promise.resolve()
			.then(function() {
				if (id === 'me') {
					return req.session.user;
				} else {
					return model.user.get(id);
				}
			})
			.then(user => res.json({ user: user }))
			.catch(next);
	});

	express.get('/user/:id/picture', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		let {id} = req.params;

		if (id === 'me') {
			id = req.session.user.id;
		} else {
			try {
				id = model.user._validateId(id);
			} catch(error) {
				return next(error);
			}
		}

		Promise.resolve()
			.then(function() {
				if (!id) {
					return true;
				}

				return sendFile(res, path.join(uploadDirPath, `${id}.png`))
					.then(() => false)
					.catch(() => true);
			})
			.then(function(useDefault) {
				if (useDefault) {
					return sendFile(res, defaultPicturePath);
				}
			})
			.catch(next);
	});

	express.put('/user/me', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id} = req.session.user;
		const picturePath = path.join(uploadDirPath, `${id}.png`);

		parseIncomingForm(req, uploadDirPath)
			.then(function([fields, files]) {
				if (!files.picture) {
					return fields;
				}

				const tmpPicturePath = files.picture.path;

				return Jimp.read(tmpPicturePath)
					.then(jimp => jimp.resize(40, 40).write(picturePath))
					.then(() => fs.unlinkSync(tmpPicturePath))
					.thenReturn(fields);
			})
			.then(user => model.user.update(id, user))
			.then(user => res.json({ user: user }))
			.catch(next);
	});

	express.delete('/user/me', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const userRemoval = model.removeUser(req.session.user.id);
		const sessionRemoval = Promise.promisify(req.session.destroy, { context: req.session })();

		Promise.all([userRemoval, sessionRemoval])
			.then(() => res.json({}))
			.catch(next);
	});
};