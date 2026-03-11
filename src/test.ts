import { describe, snapshot, test } from "node:test";
import { deepEqual, equal } from "node:assert/strict";
import { decode } from "./index.ts";
import { fail } from "node:assert";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function getSnapshotPath() {
	const filename = new URL(import.meta.url).pathname;
	const { name, dir } = path.parse(filename);
	return path.resolve(dir, `${name}.ts.snapshot`);
}

describe("react-error-decoder", (): void => {
	test("get all details for error", (): void => {
		const input =
			"Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
		const message =
			"Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.";
		const url =
			"https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]=";
		const invariant = "130";
		deepEqual(decode.details(input), { message, url, invariant });
	});
	[
		[
			"Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.",
			"Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined.",
		],
		[
			"Minified React error #152; visit https://reactjs.org/docs/error-decoder.html?invariant=152&args[]=NGABuilder for the full message or use the non-minified dev environment for full errors and additional helpful warnings.",
			"Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.",
		],
		[
			"Minified React error #152; visit https://legacy.reactjs.org/docs/error-decoder.html?invariant=152&args[]=NGABuilder for the full message or use the non-minified dev environment for full errors and additional helpful warnings.",
			"Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.",
		],
		[
			"Minified React error #72; visit https://legacy.reactjs.org/docs/error-decoder.html?invariant=72&args[]=div&args[]=header&args[]=footer for the full message or use the non-minified dev environment for full errors and additional helpful warnings.",
			"Expected onSetParent() and onSetChildren() to be consistent (div has parents header and footer).",
		],
	].forEach(([input, message]: string[]) =>
		test("decodes messages successfully", (): void => {
			equal(decode(input), message);
		}),
	);

	test("Leave an error not in dictionary as is", (): void => {
		const input =
			"Minified React error #223; visit https://reactjs.org/docs/error-decoder.html?invariant=223&args[]=undefined&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
		equal(decode(input), input);
	});
	test("creates an object from regular error messages", (): void => {
		deepEqual(decode.details("Something must have gone horribly wrong"), {
			message: "Something must have gone horribly wrong",
			url: undefined,
			invariant: undefined,
		});
	});
	[
		"visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=undefined&args[]= for the full message",
		"Minified React error #1: Something else has gone wrong.",
		"Minified React error #1: Something else has gone wrong. https://www.facebook.com",
		"Minified React error #1: Something else has gone wrong. https://www.facebook.com?invariant=900",
	].forEach((message: string): void => equal(decode(message), message));
	test("updated snapshot", async (context): Promise<void> => {
		try {
			context.assert.snapshot(decode.collection);
		} catch (error) {
			const snapshotModule = require(getSnapshotPath());
			const list = JSON.parse(Object.values(snapshotModule)[0] as string);
			const errors = [];
			if (Object.keys(list).length !== Object.keys(decode.collection).length) {
				errors.push(
					`Expected ${Object.keys(decode.collection).length} items but got ${Object.keys(list).length}`,
				);
			} else {
				for (const key in decode.collection) {
					if (!Object.hasOwn(decode.collection, key)) continue;
					if (list[key] !== decode.collection[key]) {
						errors.push(
							`Expected item [${key}] to be "${decode.collection[key]}" but got "${list[key]}"`,
						);
					}
				}
			}
			if (errors.length > 0) {
				console.error("Snapshot mismatch:");
				fail(["Snapshot does not match collection:", ...errors].join("\n"));
			} else {
				fail(error);
			}
		}
	});
});
