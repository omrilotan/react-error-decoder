/**
 * Compare two snapshot files of the error-code collection and print a
 * CHANGELOG line describing the difference, e.g. "Add 602-607. Update 603".
 * Prints nothing when the collections are identical.
 *
 * Usage: node scripts/update/changes.mjs <old-snapshot> <new-snapshot>
 */
import { createRequire } from "node:module";
import { resolve } from "node:path";

const require = createRequire(import.meta.url);

function load(file) {
	const snapshot = require(resolve(file));
	return JSON.parse(Object.values(snapshot)[0]);
}

/**
 * Collapse sorted numbers into ranges: [600, 601, 602, 604] -> "600-602, 604"
 */
function ranges(numbers) {
	const groups = [];
	for (const number of numbers) {
		const last = groups.at(-1);
		if (last && last.end + 1 === number) last.end = number;
		else groups.push({ start: number, end: number });
	}
	return groups
		.map(({ start, end }) => {
			if (start === end) return `${start}`;
			if (end - start === 1) return `${start}, ${end}`;
			return `${start}-${end}`;
		})
		.join(", ");
}

const [, , oldFile, newFile] = process.argv;
const before = load(oldFile);
const after = load(newFile);
const sort = (keys) => keys.map(Number).sort((a, b) => a - b);

const added = sort(Object.keys(after).filter((key) => !(key in before)));
const removed = sort(Object.keys(before).filter((key) => !(key in after)));
const updated = sort(
	Object.keys(after).filter(
		(key) => key in before && before[key] !== after[key],
	),
);

const parts = [];
if (added.length) parts.push(`Add ${ranges(added)}`);
if (updated.length) parts.push(`Update ${ranges(updated)}`);
if (removed.length) parts.push(`Remove ${ranges(removed)}`);

if (parts.length) console.log(parts.join(". "));
