#!/usr/bin/env bash
# Usage: ./scripts/release.sh [next|patch|minor|major]
# Requires: svu installed (https://github.com/caarlos0/svu)
#
# This script bumps the version using svu, updates package.json, and creates a git tag.

set -euo pipefail

INCREMENT=${1:-next}
NEW_VERSION=$(svu "$INCREMENT" | sed 's/^v//')

echo "Bumping to $NEW_VERSION..."
npm version "$NEW_VERSION" --no-git-tag-version

git add package.json
git commit -m "chore: release v$NEW_VERSION"
git tag "v$NEW_VERSION"

echo "Tagged v$NEW_VERSION"
echo "Run: git push && git push --tags"
