function createSchema(knex, schemaNames) {
	return [{
		name: 'Tags',
		define(table) {
			table.string('id').primary();
			table.integer('count').notNullable();
			table.string('color', 7).notNullable().defaultTo('#cccccc');
		}
	}, {
		name: 'ArticlesToTags',
		define(table) {
			table.integer('article_id').unsigned().notNullable();
			table.string('tag_id').notNullable();

			table.foreign('article_id').references('id').inTable(schemaNames.Articles)
				.onUpdate('CASCADE').onDelete('RESTRICT');

			table.foreign('tag_id').references('id').inTable(schemaNames.Tags)
				.onUpdate('CASCADE').onDelete('RESTRICT');
		}
	}];
}

function createModel(knex, schemaNames, model) {
	return {};
}

exports.createSchema = createSchema;
exports.createModel = createModel;