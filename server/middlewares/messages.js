const path = require('path');
const fs = require('fs');
const i18n = require('i18n');

const messagesDir = path.join(__dirname, '..', 'messages');

const locales = fs.readdirSync(messagesDir).map(function(filename) {
	const extIndex = filename.lastIndexOf('.');

	if (extIndex < 0) {
		return filename;
	} else {
		return filename.substring(0, extIndex);
	}
});

function middleware(express, model, config) {
	i18n.configure({
		locales: locales,
		defaultLocale: config.site.locale,
		directory: messagesDir
	});

	express.use(i18n.init);
}

module.exports = middleware;