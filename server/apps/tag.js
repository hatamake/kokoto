module.exports = function(express, model, config) {
	express.get('/tag/search', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const query = (req.query.query || '');
		const {after} = req.query;

		model.tag.search(query, after)
			.then(tags => res.json({ tags: tags }))
			.catch(next);
	});

	express.put('/tag/:id', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id} = req.params;
		const {title, color} = req.body;

		model.tag.update(id, title, color)
			.then(tag => res.json({ tag: tag }))
			.catch(next);
	});

	express.delete('/tag/:id', function(req, res, next) {
		if (res.shouldSignin()) { return; }

		const {id} = req.params;

		model.tag.remove(id)
			.then(() => res.json({}))
			.catch(next);
	});
};