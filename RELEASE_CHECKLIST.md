# Release Checklist

Follow this checklist when releasing a new version to all distribution channels.

## Pre-Release (Development)

- [ ] All features/fixes completed and merged to `main`
- [ ] Run `pnpm test` — all tests pass
- [ ] Run `pnpm test:e2e` — all E2E tests pass
- [ ] Run `pnpm build` — builds successfully for web + extensions

## Version & Changelog

- [ ] **Update `package.json`** — bump version (e.g., `1.0.0` → `1.0.1` or `1.1.0`)
  - Use semantic versioning: `MAJOR.MINOR.PATCH`
  - Patch: bug fixes only
  - Minor: new features (backward compatible)
  - Major: breaking changes

- [ ] **Update `src/data/changelog.ts`** — add new version entry
  - Add entry at the TOP of CHANGELOG array
  - Format:
    ```ts
    {
      version: '1.0.1',
      changes: [
        { type: 'feat', text: 'Description of feature' },
        { type: 'fix', text: 'Description of bug fix' },
        { type: 'perf', text: 'Description of performance improvement' },
        { type: 'ui', text: 'Description of UI change' },
      ],
    }
    ```
  - Use commit history as reference (`git log v<old-version>..`)
  - Include only user-facing changes

- [ ] **Verify version consistency**
  - `package.json` version should match changelog entry
  - Version will auto-inject into manifests and app via Vite

## Build & Test

- [ ] `pnpm build` — builds web app + both extensions
- [ ] Test web app locally: `pnpm dev` → verify "What's New" modal shows correct changelog
- [ ] Manual testing in browser/extension contexts:
  - Fresh install: modal shows all available changes
  - Upgrade simulation: set `lastSeenVersion` to old version in localStorage, reload → modal shows new changes
  - Same version reload: no modal appears

## Git & Release

- [ ] Commit version & changelog changes:
  ```bash
  git add package.json src/data/changelog.ts
  git commit -m "chore: release v1.0.1"
  ```

- [ ] Create annotated git tag (triggers pnpm release):
  ```bash
  git tag -a v1.0.1 -m "Release v1.0.1"
  git push origin main --tags
  ```
  OR use: `pnpm release:[patch|minor|major]`

## Distribution

### Chrome Web Store

- [ ] Load extension from `./extensions/dist/chrome/`
- [ ] Verify manifest version matches (auto-injected from package.json)
- [ ] Upload to Chrome Web Store dashboard
  - Navigate to: https://chrome.google.com/webstore/devconsole
  - Upload ZIP: `extensions/dist/chrome/` (zip the entire directory)
  - Update store listing if needed (changelog, screenshots, etc.)
  - Submit for review (usually approved within hours)

### Firefox Add-ons

- [ ] Load extension from `./extensions/dist/firefox/`
- [ ] Verify manifest version matches
- [ ] Upload to Mozilla Add-ons dashboard
  - Navigate to: https://addons.mozilla.org/en-US/developers/
  - Create new version
  - Upload ZIP: `extensions/dist/firefox/`
  - Add release notes (reference changelog)
  - Submit for review (usually approved within 1-2 days)

### NPM Package

- [ ] Verify package.json version is bumped
- [ ] Ensure dist is built: `pnpm build`
- [ ] Run: `npm publish`
  - Will publish whatever is in dist/ (web app)
  - Verify on: https://www.npmjs.com/package/socketio-test-client

### AUR Package

- [ ] Run: `pnpm aur:update`
  - Auto-generates PKGBUILD with new version and sha256sum
  - Commits to AUR repository

- [ ] If manual update needed:
  ```bash
  # Get sha256sum of release tarball
  wget https://github.com/serajhqi/socketio-test-client/archive/v1.0.1.tar.gz
  sha256sum v1.0.1.tar.gz
  
  # Update PKGBUILD with new version and checksum
  # Push to AUR
  ```

## Post-Release

- [ ] Verify all distributions show new version:
  - Chrome Web Store listing page
  - Firefox Add-ons listing page
  - NPM package page
  - AUR package page

- [ ] Test that users see "What's New" modal on upgrade:
  - Simulate old version in localStorage
  - Reload → verify modal appears with correct changelog

- [ ] Announce release (if applicable):
  - GitHub releases page
  - Social media / community channels

---

## Quick Reference

**Version Bumping:**
```bash
pnpm release            # Auto-detect from commits
pnpm release:patch      # 1.0.0 → 1.0.1
pnpm release:minor      # 1.0.0 → 1.1.0
pnpm release:major      # 1.0.0 → 2.0.0
```

**Local Testing:**
```bash
pnpm dev                # Start dev server at http://localhost:5173
pnpm build              # Build all distributions
pnpm test               # Run unit + integration tests
pnpm test:e2e           # Run E2E tests
```

**File Locations:**
- Web app source: `src/`
- Extension source: `extensions/src/`
- Built web app: `dist/`
- Built extensions: `extensions/dist/chrome/` and `extensions/dist/firefox/`
- Changelog data: `src/data/changelog.ts`
- Version: `package.json` (single source of truth)
