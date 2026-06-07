#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
  echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
  echo -e "${GREEN}✓${NC} $1"
}

log_error() {
  echo -e "${RED}✗${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}⚠${NC} $1"
}

log_step() {
  echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BLUE}${1}${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Check if version is provided
if [ -z "$1" ]; then
  log_error "Version number required"
  echo ""
  echo "Usage: $0 <version>"
  echo "Example: $0 1.0.1"
  exit 1
fi

VERSION=$1

# Validate version format (semantic versioning)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  log_error "Invalid version format: $VERSION"
  echo "Expected format: MAJOR.MINOR.PATCH (e.g., 1.0.1)"
  exit 1
fi

log_step "Socket.IO Test Client Release: v${VERSION}"

# Step 1: Check git status
log_info "Checking git status..."
if ! git diff --quiet; then
  log_error "Working directory has uncommitted changes"
  echo "Please commit or stash changes before releasing"
  exit 1
fi
log_success "Working directory clean"

# Step 2: Check if changelog has been updated
log_info "Checking if src/data/changelog.ts has been updated..."
if ! grep -q "version: '$VERSION'" src/data/changelog.ts; then
  log_error "Changelog entry for v$VERSION not found in src/data/changelog.ts"
  echo ""
  echo "Please update src/data/changelog.ts with:"
  echo ""
  echo "  {"
  echo "    version: '$VERSION',"
  echo "    changes: ["
  echo "      { type: 'feat', text: 'Feature description' },"
  echo "      { type: 'fix', text: 'Bug fix description' },"
  echo "    ],"
  echo "  },"
  echo ""
  exit 1
fi
log_success "Changelog entry found for v$VERSION"

# Step 3: Update package.json
log_info "Updating package.json version..."
OLD_VERSION=$(jq -r '.version' package.json)
jq ".version = \"$VERSION\"" package.json > package.json.tmp
mv package.json.tmp package.json
log_success "Updated package.json: v${OLD_VERSION} → v${VERSION}"

# Step 4: Build the app
log_step "Building application and extensions..."
log_info "Running pnpm build (this may take a minute)..."
if pnpm build > /dev/null 2>&1; then
  log_success "Build completed successfully"
else
  log_error "Build failed"
  echo "Run 'pnpm build' to see detailed error"
  # Restore package.json on failure
  git checkout package.json
  exit 1
fi

# Step 5: Verify builds
log_info "Verifying builds..."
if [ -f "dist/index.html" ] && [ -d "extensions/dist/chrome" ] && [ -d "extensions/dist/firefox" ]; then
  log_success "All builds present: web app, Chrome extension, Firefox extension"
else
  log_error "Some builds are missing"
  git checkout package.json
  exit 1
fi

# Step 6: Git commit
log_step "Creating git commit..."
log_info "Staging files..."
git add package.json src/data/changelog.ts
git status --short

log_info "Committing changes..."
if git commit -m "chore: release v${VERSION}" > /dev/null 2>&1; then
  log_success "Committed: chore: release v${VERSION}"
else
  log_error "Commit failed"
  git reset
  exit 1
fi

# Step 7: Git tag
log_step "Creating git tag..."
log_info "Tagging as v${VERSION}..."
if git tag -a "v${VERSION}" -m "Release v${VERSION}" > /dev/null 2>&1; then
  log_success "Tagged: v${VERSION}"
else
  log_error "Tag failed"
  git reset --soft HEAD~1
  exit 1
fi

# Step 8: Push to remote
log_step "Pushing to remote..."
log_info "Pushing commits and tags..."
if git push origin main --tags > /dev/null 2>&1; then
  log_success "Pushed to origin"
else
  log_error "Push failed - you may need to check your network connection"
  echo "You can retry with: git push origin main --tags"
  exit 1
fi

# Step 9: Manual distribution steps
log_step "Release Complete: v${VERSION}"
log_success "Local release steps completed!"
echo ""
echo "Next steps - these require manual actions:"
echo ""
echo "  ${YELLOW}1. Chrome Web Store${NC}"
echo "     - Navigate to: https://chrome.google.com/webstore/devconsole"
echo "     - Upload: extensions/dist/chrome/"
echo "     - Submit for review"
echo ""
echo "  ${YELLOW}2. Firefox Add-ons${NC}"
echo "     - Navigate to: https://addons.mozilla.org/en-US/developers/"
echo "     - Create new version"
echo "     - Upload: extensions/dist/firefox/"
echo "     - Submit for review"
echo ""
echo "  ${YELLOW}3. NPM Package${NC}"
echo "     - Run: ${BLUE}npm publish${NC}"
echo "     - Verify: https://www.npmjs.com/package/socketio-test-client"
echo ""
echo "  ${YELLOW}4. AUR Package${NC}"
echo "     - Update PKGBUILD with:"
echo "       • pkgver=$VERSION"
echo "       • sha256sum=\$(sha256sum socketio-test-client-${VERSION}.tar.gz | cut -d' ' -f1)"
echo "       • pkgrel=1"
echo "     - Commit and push to AUR"
echo ""
echo "  ${YELLOW}5. Verify \"What's New\" Modal${NC}"
echo "     - Open app in browser"
echo "     - Set old lastSeenVersion in localStorage"
echo "     - Reload and verify modal shows changelog for v${VERSION}"
echo ""
