const _ = require('lodash');
const JsDiff = require('diff');

function diffBlocks(a, b) {
	return JsDiff.diffLines(a, b).reduce(function(result, item) {
		const lastItem = (_.last(result) || {});

		if (item.added && lastItem.removed) {
			lastItem.added = true;
			lastItem.value = JsDiff.diffWords(lastItem.value, item.value);
		} else {
			result.push(item);
		}

		return result;
	}, []);
}

exports.diffBlocks = diffBlocks;