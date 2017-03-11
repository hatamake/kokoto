const Promise = require('bluebird');

const {diffBlocks} = require('../utils/diff');

module.exports = function(express, model, config) {
	express.post('/document', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const authorId = req.session.user.id;
		const {title} = req.body;
		const content = (req.body.content || '');
		const tags = (req.body.tags || []);

		model.document.create(authorId, title, content, tags)
			.then(document => res.json({ document: document }))
			.catch(next);
	});

	express.get('/document/search', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {type, query, after} = req.query;

		model.document.search(type, query, after)
			.then(documents => res.json({ documents: documents }))
			.catch(next);
	});

	express.get('/document/:id', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		model.document.get(req.params.id)
			.then(document => res.json({ document: document }))
			.catch(next);
	});

	express.get('/document/:id/history', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		model.document.get(req.params.id)
			.then(function(document) {
				return model.document.search('history', document.historyId, -1);
			})
			.then(documents => res.json({ documents: documents }))
			.catch(next);
	});

	express.get('/document/:id/diff', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const thisId = req.params.id;
		const thatId = req.query.to;

		Promise.map([thisId, thatId], model.document.get.bind(model.document))
			.then(function(documents) {
				const thisContent = documents[0].content;
				const thatContent = documents[1].content;
				return diffBlocks(thisContent, thatContent);
			})
			.then(diff => res.json({ diff: diff }))
			.catch(next);
	});

	express.put('/document/:id', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const authorId = req.session.user.id;
		const {id} = req.params;
		const {title} = req.body;
		const content = (req.body.content || '');
		const tags = (req.body.tags || []);

		model.document.update(id, authorId, title, content, tags)
			.then(document => res.json({ document: document }))
			.catch(next);
	});

	express.delete('/document/:id', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id} = req.params;
		const userId = req.session.user.id;

		model.document.archive(id, userId)
			.then(() => res.json({}))
			.catch(next);
	});

	express.post('/document/:id/comment', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id} = req.params;
		const authorId = req.session.user.id;
		const {content, range} = req.body;

		model.document.addComment(id, authorId, content, range)
			.then(comment => res.json({ comment: comment }))
			.catch(next);
	});

	express.put('/document/:id/comment/:commentId', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id, commentId} = req.params;
		const authorId = req.session.user.id;
		const {content} = req.body;

		model.document.updateComment(id, commentId, authorId, content)
			.then(comment => res.json({ comment: comment }))
			.catch(next);
	});

	express.delete('/document/:id/comment/:commentId', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id, commentId} = req.params;
		const userId = req.session.user.id;

		model.document.removeComment(id, commentId, userId)
			.then(() => res.json({}))
			.catch(next);
	});
};