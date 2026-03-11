#!/usr/bin/env bash

set -e

ARGS=""

# Check for the "-u" option exists in cli args to update snapshots
if [[ "$@" == *"-u"* ]]; then
	ARGS+=" --test-update-snapshots"
else
	echo -e "To update snapshots run: npm t -- -u\n"
fi

node --test $ARGS **/test.ts
