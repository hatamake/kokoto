function createSchema(knex, schemaNames) {
	return [{
		name: 'Files',
		define(table) {
			table.integer('article_id').unsigned().primary();
			table.string('path').notNullable();
			table.string('type').notNullable();

			table.foreign('article_id').references('id').inTable(schemaNames.Articles)
				.onUpdate('CASCADE').onDelete('RESTRICT');
		}
	}];
}

function createModel(knex, schemaNames, model) {
	return {};
}

exports.createSchema = createSchema;
exports.createModel = createModel;