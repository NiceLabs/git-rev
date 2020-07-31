#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

jq '.name = "@nicelabs/git-rev"' package.json > package-modified.json
mv package-modified.json package.json

VERSION=$(jq -r '.version' package.json)
npm --no-git-tag-version version "$VERSION-$BUILD_VERSION"
npm publish
