import { decode } from ".";

describe("react-error-decoder", (): void => {
	test("get all details for error", (): void => {
		const input =
			"Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
		const message =
			"Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.";
		const url =
			"https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]=";
		const invariant = "130";
		expect(decode.details(input)).toEqual({ message, url, invariant });
	});
	test.each([
		[
			"Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.",
			"Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.",
		],
		[
			"Minified React error #152; visit https://reactjs.org/docs/error-decoder.html?invariant=152&args[]=NGABuilder for the full message or use the non-minified dev environment for full errors and additional helpful warnings.",
			"NGABuilder(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.",
		],
		[
			"Minified React error #152; visit https://legacy.reactjs.org/docs/error-decoder.html?invariant=152&args[]=NGABuilder for the full message or use the non-minified dev environment for full errors and additional helpful warnings.",
			"NGABuilder(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.",
		],
	])("decodes messages successfully", (input: string, message: string): void =>
		expect(decode(input)).toBe(message),
	);
	test("Leave an error not in dictionary as is", (): void => {
		const input =
			"Minified React error #223; visit https://reactjs.org/docs/error-decoder.html?invariant=223&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
		expect(decode(input)).toBe(input);
	});
	test("creates an object from regular error messages", (): void => {
		expect(decode.details("Something must have gone horribly wrong")).toEqual({
			message: "Something must have gone horribly wrong",
			url: undefined,
			invariant: undefined,
		});
	});
	test.each([
		"visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message",
		"Minified React error #1: Something else has gone wrong.",
		"Minified React error #1: Something else has gone wrong. https://www.facebook.com",
		"Minified React error #1: Something else has gone wrong. https://www.facebook.com?invariant=900",
	])("falls back to original message", (message: string): void =>
		expect(decode(message)).toBe(message),
	);
	test("updated snapshot", (): void =>
		expect(decode.collection).toMatchSnapshot());
});
