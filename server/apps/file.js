const Promise = require('bluebird');
const path = require('path');
const fs = require('fs');

const {HttpError} = require('../middlewares/error');
const {parseIncomingForm} = require('../utils/formidable');
const {sendFile} = require('../utils/sendFile');

function rollbackUpload(files) {
	Promise.resolve(files)
		.map(file => Promise.promisify(fs.unlink)(file.path))
		.catch(() => Promise.reject(new HttpError('request_invalid', 400)));
}

module.exports = function(express, model, config) {
	const uploadDirPath = path.join(__dirname, '..', 'static', 'file');

	express.post('/file', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		parseIncomingForm(req, uploadDirPath)
			.then(function([fields, files]) {
				if (!files.stream) {
					return rollbackUpload(files);
				}

				const authorId = req.session.user.id;
				const filename = path.basename(files.stream.path);
				const content = (fields.content || '');
				const tags = JSON.parse(fields.tags || '[]');

				return model.file.create(authorId, filename, content, tags);
			})
			.then(file => res.json({ file: file }))
			.catch(next);
	});

	express.get('/file/search', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {query, type, after} = req.query;

		model.file.search(type, query, after)
			.then(files => res.json({ files: files }))
			.catch(next);
	});

	express.get('/file/:id', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		model.file.get(req.params.id)
			.then(file => res.json({ file: file }))
			.catch(next);
	});

	express.get('/file/:id/stream', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		model.file.get(req.params.id)
			.then(file => sendFile(uploadDirPath, file.filename))
			.catch(next);
	});

	express.get('/file/:id/history', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		model.get.get(req.params.id)
			.then(file => model.file.search('history', file.historyId, -1))
			.then(files => res.json({ files: files }))
			.catch(next);
	});

	express.put('/file/:id', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		parseIncomingForm(req, uploadDirPath)
			.then(function([fields, files]) {
				if (!files.stream) {
					return rollbackUpload(files);
				}

				const authorId = req.session.user.id;
				const filename = path.basename(files.stream.path);
				const content = (fields.content || '');
				const tags = JSON.parse(fields.tags || '[]');

				return model.file.update(authorId, filename, content, tags);
			})
			.then(file => res.json({ file: file }))
			.catch(next);
	});

	express.delete('/file/:id', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id} = req.params;
		const userId = req.session.user.id;

		model.archiveFile(id, userId)
			.then(() => res.json({}))
			.catch(next);
	});

	express.post('/file/:id/comment', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id} = req.params;
		const authorId = req.session.user.id;
		const {content} = req.body;

		model.file.addComment(id, authorId, content)
			.then(comment => res.json({ comment: comment }))
			.catch(next);
	});

	express.put('/file/:id/comment/:commentId', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id, commentId} = req.params;
		const authorId = req.session.user.id;
		const {content} = req.body;

		model.file.updateComment(id, commentId, authorId, content)
			.then(comment => res.json({ comment: comment }))
			.catch(next);
	});

	express.delete('/file/:id/comment/:commentId', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id, commentId} = req.params;
		const userId = req.session.user.id;

		model.file.removeComment(id, commentId, userId)
			.then(() => res.json({}))
			.catch(next);
	});
};