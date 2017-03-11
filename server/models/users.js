const crypto = require('crypto');
const escapeHtml = require('escape-html-whitelist');

const {HttpError} = require('../server/error');

function createSchema() {
	return [{
		name: 'Users',
		define(table) {
			table.string('id', 20).primary();
			table.string('password', 64).notNullable();
			table.string('name', 20).notNullable();
		}
	}];
}

function createModel(knex, schemaNames, model) {
	return {
		users: {
			get(id, trx) {
				return knex(schemaNames.Users)
					.select(['id', 'name'])
					.where('id', id)
					.transacting(trx);
			},

			create(user, trx) {
				return Promise.resolve().then(function() {
					return {
						id: model.users.validateId(user.id),
						password: model.users.validatePassword(user.password),
						name: model.users.validateName(user.name)
					};
				}).then(function(user) {
					return knex(schemaNames.Users)
						.insert(user, 'id')
						.transacting(trx)
						.then(function(userIds) {
							return {
								id: userIds[0],
								name: user.name
							};
						});
				});
			},

			update(id, user, trx) {
				return Promise.resolve().then(function() {
					return {
						password: model.users.validatePassword(user.password),
						name: model.users.validateName(user.name)
					};
				}).then(function(user) {
					return knex(schemaNames.Users)
						.update(user, 'id')
						.where('id', id)
						.transacting(trx)
						.then(function(userIds) {
							if (userIds.length < 1) {
								throw new HttpError('user_not_exist', 404);
							}

							return {
								id: userIds[0],
								name: user.name
							};
						});
				});
			},

			remove(id, trx) {
				return knex(schemaNames.Users)
					.delete()
					.where('id', id)
					.transacting(trx)
					.then(function(count) {
						if (count < 1) {
							throw new HttpError('user_not_exist', 404);
						}

						return null;
					});
			},

			validateId(id) {
				if (!id) {
					throw new HttpError('user_id_required');
				}

				if (!id.match(/^[a-zA-Z0-9_]{4,20}$/)) {
					throw new HttpError('user_id_invalid');
				}

				return id;
			},

			validatePassword(password) {
				if (!password) {
					throw new HttpError('password_required');
				}

				return crypto.createHash('sha256').update(password).digest('hex');
			},

			validateName(name) {
				if (!name) {
					throw new HttpError('user_name_required');
				}

				return escapeHtml(name, { allowedTags: [] });
			}
		},

	};
}

exports.createSchema = createSchema;
exports.createModel = createModel;