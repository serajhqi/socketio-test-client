#!/usr/bin/env bash
# Updates the AUR PKGBUILD file with the current version and sha256sum.
# Requires: curl, sha256sum (coreutils)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION=$(node -p "require('./package.json').version")
TARBALL_URL="https://registry.npmjs.org/socketio-test-client/-/socketio-test-client-${VERSION}.tgz"

echo "Fetching tarball from $TARBALL_URL..."
SHA=$(curl -sL "$TARBALL_URL" | sha256sum | awk '{print $1}')

echo "Updating aur/PKGBUILD with version=$VERSION, sha256=$SHA"
sed -i "s/^pkgver=.*/pkgver=$VERSION/" "$SCRIPT_DIR/aur/PKGBUILD"
sed -i "s/^sha256sums=.*/sha256sums=('$SHA')/" "$SCRIPT_DIR/aur/PKGBUILD"
sed -i "s/^pkgrel=.*/pkgrel=1/" "$SCRIPT_DIR/aur/PKGBUILD"

echo "✓ Updated aur/PKGBUILD to v$VERSION"
