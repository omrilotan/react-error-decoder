import collection from "./collection.json" with { type: "json" };

/**
 * Replace instances of %s in a string with the arguments provided
 */
const parse = (str: string, args: string[], i = 0): string =>
	str.replace(/%s/g, () => args[i++]);

/**
 * URL pattern to match the URL in the error message
 */
const pattern = /https?:\/\/[^\s]+/;

/**
 * Accepts a React minified message and returns a decoded message, number and url
 */
function decodeDetails(message: string): {
	/**
	 * The decoded message, or the original message if it couldn't be decoded
	 */
	message: string;
	/**
	 * The invariant number, if it could be decoded
	 */
	invariant?: string;
	/**
	 * The url to the React docs with the full message, if it could be decoded
	 */
	url?: string;
} {
	const fallback: ReturnType<typeof decodeDetails> = {
		message,
		invariant: undefined,
		url: undefined,
	};
	if (!message.startsWith("Minified React error")) return fallback;

	const [url] = message.match(pattern) || [];
	if (!url) return fallback;

	const { searchParams } = new URL(url);
	const args = searchParams.getAll("args[]");
	const invariant = searchParams.get("invariant");
	if (!invariant) return fallback;
	if (!Object.hasOwn(collection, invariant)) return fallback;

	const template = collection[invariant];
	return {
		message: parse(template, args),
		invariant,
		url,
	};
}

/**
 * Accepts a React minified message and returns a decoded message
 */
const decode = (message: string): string => decodeDetails(message).message;
decode.details = decodeDetails;
decode.collection = collection;

export { decode };
