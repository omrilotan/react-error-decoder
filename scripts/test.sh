#!/usr/bin/env bash

code=0

echo "Run tests. To update snapshots run: npm t -- --test-update-snapshots"
NODE_NO_WARNINGS=1 node --test --experimental-test-coverage --experimental-test-snapshots --experimental-strip-types $@ **/test.ts
code=$((code + $?))

exit $code
