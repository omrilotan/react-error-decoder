const decode = require('.');

describe('react-error-decoder', () => {
	it('get all details for error', () => {
		const encoded = 'Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.';
		const decoded = 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.';
		expect(decode.details(encoded)).toEqual({
			message: decoded,
			url: 'https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]=',
			invariant: '130',
		});
	});
	it.each([
		[
			'Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.',
			'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.',
		],
		[
			'Minified React error #152; visit https://reactjs.org/docs/error-decoder.html?invariant=152&args[]=NGABuilder for the full message or use the non-minified dev environment for full errors and additional helpful warnings.',
			'NGABuilder(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.',
		],
	])('decodes messages successfully', (encoded, decoded) => {
		expect(decode(encoded)).toBe(decoded);
	});
	it.each([
		[
			'Minified React error #223; visit https://reactjs.org/docs/error-decoder.html?invariant=223&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.',
		],
	])('Leave an error not in dictionary as is', encoded => {
		expect(decode(encoded)).toBe(encoded);
	});
	it('creates an object from regular error messages', () => {
		expect(decode.details('Something must have gone horribly wrong')).toEqual({
			message: 'Something must have gone horribly wrong',
			url: undefined,
			invariant: undefined,
		});
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
