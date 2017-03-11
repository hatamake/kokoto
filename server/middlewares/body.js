const bodyParser = require('body-parser');

module.exports = function(express, model, config) {
	express.use(bodyParser.urlencoded({ extended: true }));
	express.use(bodyParser.json());
};