const _ = require('lodash');
const Promise = require('bluebird');
const Knex = require('knex');

const modelInits = require('../models');

module.exports = function(express, model, config) {
	const knex = Knex(config.database);
	model._knex = knex;

	const {schemaPostfix} = config.database;
	const schemaNames = {};

	return Promise.each(modelInits, function(modelInit) {
		const schema = modelInit.createSchema(knex, schemaNames);

		return Promise.each(schema, function({name, define}) {
			if (schemaPostfix) {
				const schemaName = name + '__' + schemaPostfix;

				schemaNames[name] = schemaName;
				name = schemaName;
			} else {
				schemaNames[name] = name;
			}

			return knex.schema.hasTable(name).then(function(exist) {
				if (!exist) {
					return knex.schema.createTable(name, define);
				}
			});
		}).then(function() {
			const _model = modelInit.createModel(knex, schemaNames, model);
			_.assign(model, _model);
		});
	});
};