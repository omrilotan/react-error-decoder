import collection from "./collection.json";

type Collection = Record<string, string>;

const parse = (str: string, args: string[], i = 0): string =>
	str.replace(/%s/g, () => args[i++]);
const pattern = /https?:\/\/[^\s]+/;

/**
 * Accepts a React minified message and returns a decoded message, number and url
 */
function decodeDetails(message: string): {
	message: string;
	invariant?: string;
	url?: string;
} {
	const fallback = {
		message,
		invariant: undefined,
		url: undefined,
	};

	if (!message.startsWith("Minified React error")) {
		return fallback;
	}

	try {
		const [url] = message.match(pattern) || [];
		const { searchParams } = new URL(url);
		const args = searchParams.getAll("args[]");
		const [invariant] = searchParams.getAll("invariant");

		if (!invariant) {
			return fallback;
		}

		if (!collection[invariant]) {
			throw new RangeError(
				`Collection does not include invariant "${invariant}"`,
			);
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
 * Accepts a React minified message and returns a decoded message
 */
const decode = (message: string): string => decodeDetails(message).message;

decode.details = decodeDetails;

decode.collection = collection as Collection;

export { decode };
