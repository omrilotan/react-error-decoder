const { URL } = require('url');
const collection = require('./collection.json');

const parse = (str, args, i = 0) => str.replace(/%s/g, () => args[i++]);
const pattern = /https?:\/\/[^\s]+/;

/**
 * @param {string} message React minified message
 * @returns {string} Decoded message
 */
module.exports = function decode(message) {
	if (!message.startsWith('Minified React error')) {
		return message;
	}

	try {
		const [ url ] = message.match(pattern);
		const { searchParams } = new URL(url);
		const args = searchParams.getAll('args[]');
		const invariant = searchParams.getAll('invariant');
		if (!collection[invariant]) {
			throw new RangeError(`Collection does not include invariant "${invariant}"`);
		}

		return parse(collection[invariant], args);
	} catch (error) {
		return message;
	}
};
