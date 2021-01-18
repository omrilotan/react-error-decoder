const decode = require('.');

describe('react-error-decoder', () => {
	it.each([
		[
			'Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.',
			'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.',
		],
	])('decodes messages successfully', (encoded, decoded) => {
		expect(decode(encoded)).toBe(decoded);
	});

	it.each([
		'visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message',
		'Minified React error #1: Something else has gone wrong.',
		'Minified React error #1: Something else has gone wrong. https://www.facebook.com',
		'Minified React error #1: Something else has gone wrong. https://www.facebook.com?invariant=900',
	])('falls back to original message', message => {
		expect(decode(message)).toBe(message);
	});
});
