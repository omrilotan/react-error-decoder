const { URL } = require('url');
const collection = require('./collection.json');

const parse = (str, args, i = 0) => str.replace(/%s/g, () => args[i++]);
const pattern = /https?:\/\/[^\s]+/;

/**
 * @param {string} message React minified message
 * @returns {object} Decoded message, number and url
 */
function getDetails(message) {
	const fallback = {
		message,
		invariant: undefined,
		url: undefined,
	};

	if (!message.startsWith('Minified React error')) {
		return fallback;
	}

	try {
		const [ url ] = message.match(pattern);
		const { searchParams } = new URL(url);
		const args = searchParams.getAll('args[]');
		const [ invariant ] = searchParams.getAll('invariant');

		if (!invariant) {
			return fallback;
		}

		if (!collection[invariant]) {
			throw new RangeError(`Collection does not include invariant "${invariant}"`);
		}

		return {
			message: parse(collection[invariant], args),
			invariant,
			url,
		};
	} catch (error) {
		return fallback;
	}
}

/**
 * @param {string} message React minified message
 * @returns {string} Decoded message
 */
const decode = message => getDetails(message).message;

decode.details = message => getDetails(message);

module.exports = decode;
