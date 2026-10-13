#!/usr/bin/env bash

# Sync the error-code collection with React upstream
# (https://github.com/facebook/react/blob/main/scripts/error-codes/codes.json)
#
# 1. Fetch the latest codes.json (npm run prepare)
# 2. Update the test snapshot (npm t -- -u)
# 3. Bump the patch version
# 4. Add a CHANGELOG entry describing the added / updated codes
#
# Usage: npm run update
# Nothing is committed; review the diff and commit when satisfied.

set -euo pipefail

cd "$(dirname "$0")/../.."

SNAPSHOT="src/test.ts.snapshot"
PREVIOUS="$(mktemp -t snapshot.XXXXXX)"
trap 'rm -f "$PREVIOUS"' EXIT

if ! git diff --quiet -- "$SNAPSHOT" CHANGELOG.md; then
	echo "Working tree has uncommitted changes in $SNAPSHOT or CHANGELOG.md. Commit or stash them first." >&2
	exit 1
fi

cp "$SNAPSHOT" "$PREVIOUS"

echo "Fetching latest codes.json from React"
npm run prepare --silent

echo "Updating snapshot"
npm t --silent -- -u

CHANGES="$(node scripts/update/changes.mjs "$PREVIOUS" "$SNAPSHOT")"

if [ -z "$CHANGES" ]; then
	echo "Collection is up to date. Nothing to do."
	exit 0
fi

echo "Changes: $CHANGES"

VERSION="$(npm version patch --no-git-tag-version --silent | sed 's/^v//')"
echo "Version: $VERSION"

{
	echo "# CHANGELOG"
	echo
	echo "## $VERSION"
	echo
	echo "- $CHANGES"
	tail -n +2 CHANGELOG.md
} > CHANGELOG.md.tmp
mv CHANGELOG.md.tmp CHANGELOG.md

npm run format --silent

echo
echo "Done. Review and commit:"
echo "  git add -A && git commit -m \"$CHANGES\""
