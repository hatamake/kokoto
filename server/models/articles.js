function createSchema(knex, schemaNames) {
	return [{
		name: 'ArticleHistory',
		define(table) {
			table.increments('id');
		}
	}, {
		name: 'Articles',
		define(table) {
			table.increments('id');
			table.integer('history_id').unsigned().notNullable();
			table.integer('revision').notNullable();
			table.string('author_id', 20);
			table.text('summary');
			table.text('content');
			table.text('textContent');
			table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());

			table.foreign('history_id').references('id').inTable(schemaNames.ArticleHistory)
				.onUpdate('CASCADE').onDelete('RESTRICT');

			table.foreign('author_id').references('id').inTable(schemaNames.Users)
				.onUpdate('CASCADE').onDelete('SET NULL');
		}
	}, {
		name: 'ArticlesToArticles',
		define(table) {
			table.increments('id');
			table.integer('caller_id').unsigned().notNullable();
			table.integer('callee_history_id').unsigned();
			table.integer('callee_id').unsigned();

			table.foreign('caller_id').references('id').inTable(schemaNames.Articles)
				.onUpdate('CASCADE').onDelete('RESTRICT');

			table.foreign('callee_history_id').references('id').inTable(schemaNames.ArticleHistory)
				.onUpdate('CASCADE').onDelete('SET NULL');

			table.foreign('callee_id').references('id').inTable(schemaNames.Articles)
				.onUpdate('CASCADE').onDelete('SET NULL');
		}
	}];
}

function createModel(knex, schemaNames, model) {
	return {};
}

exports.createSchema = createSchema;
exports.createModel = createModel;