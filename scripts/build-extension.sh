#!/bin/bash

# Build browser extension (Chrome or Firefox)
# Usage: ./scripts/build-extension.sh <chrome|firefox>

set -e

BROWSER="${1:?Error: browser type (chrome|firefox) required}"

if [[ ! "$BROWSER" =~ ^(chrome|firefox)$ ]]; then
  echo "Error: browser must be 'chrome' or 'firefox'"
  exit 1
fi

DIST_DIR="./extensions/dist/$BROWSER"
SRC_DIR="./extensions/src"
MANIFEST_FILE="$SRC_DIR/${BROWSER}-manifest.json"
BG_FILE="$SRC_DIR/${BROWSER}-background.js"

echo "Building $BROWSER extension..."

# Build web app
pnpm exec vite build

# Clean and create distribution directory
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Copy built app files
cp -r ./dist/* "$DIST_DIR/"

# Copy extension assets
cp -r "$SRC_DIR/images" "$DIST_DIR/"
cp "$BG_FILE" "$DIST_DIR/background.js"
cp "$MANIFEST_FILE" "$DIST_DIR/manifest.json"

# Inject version from package.json into manifest
VERSION=$(jq -r .version package.json)
jq ".version = \"$VERSION\"" "$DIST_DIR/manifest.json" > "$DIST_DIR/manifest.json.tmp"
mv "$DIST_DIR/manifest.json.tmp" "$DIST_DIR/manifest.json"

echo "✓ Built $BROWSER extension to $DIST_DIR"
