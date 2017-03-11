function createSchema(knex, schemaNames) {
	return [{
		name: 'Comments',
		define(table) {
			table.increments('id');
			table.integer('article_id').unsigned().notNullable();
			table.string('author_id');
			table.text('content');
			table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());

			table.foreign('article_id').references('id').inTable(schemaNames.Articles)
				.onUpdate('CASCADE').onDelete('RESTRICT');

			table.foreign('author_id').references('id').inTable(schemaNames.Users)
				.onUpdate('CASCADE').onDelete('SET NULL');
		}
	}];
}

function createModel(knex, schemaNames, model) {
	return {};
}

exports.createSchema = createSchema;
exports.createModel = createModel;