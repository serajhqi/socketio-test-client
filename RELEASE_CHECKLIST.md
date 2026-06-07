# Release Guide

Use the **automated release script** to prepare the release. Git operations are your responsibility.

## Quick Start

```bash
# 1. Update changelog first (manual)
# Edit src/data/changelog.ts and add new version entry

# 2. Run release script (prepares package.json and builds)
./scripts/release.sh 1.0.1

# 3. Review and commit changes (manual)
git add package.json src/data/changelog.ts
git commit -m "chore: release v1.0.1"
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin main --tags

# 4. Distribute to Chrome, Firefox, NPM, AUR (manual)
```

---

## Step 1: Update Changelog (Manual)

**Important:** Do this BEFORE running the release script.

Edit `src/data/changelog.ts` and add your new version entry at the TOP:

```typescript
{
  version: '1.0.1',
  changes: [
    { type: 'feat', text: 'Description of new feature' },
    { type: 'fix', text: 'Description of bug fix' },
    { type: 'perf', text: 'Description of performance improvement' },
    { type: 'ui', text: 'Description of UI improvement' },
  ],
}
```

**Change Types:**
- `feat` — New features
- `fix` — Bug fixes  
- `perf` — Performance improvements
- `ui` — UI/UX changes

**Tips:**
- Use `git log v<old-version>..` to see what changed
- Include only user-facing changes
- Be concise and clear

---

## Step 2: Run Release Script

```bash
./scripts/release.sh 1.0.1
```

**What the script does:**
- ✅ Validates version format (X.Y.Z)
- ✅ Checks changelog entry exists
- ✅ Updates `package.json`
- ✅ Builds web app + Chrome + Firefox extensions
- ✅ Shows you what to do next

**What the script does NOT do:**
- ❌ Git commit (you do this)
- ❌ Git tag (you do this)
- ❌ Git push (you do this)

---

## Step 3: Git Operations (Manual)

After the script succeeds, follow the printed instructions:

```bash
# Review the changes
git diff package.json

# Stage files
git add package.json src/data/changelog.ts

# Commit
git commit -m "chore: release v1.0.1"

# Tag
git tag -a v1.0.1 -m "Release v1.0.1"

# Push
git push origin main --tags
```

---

## Step 4: Manual Distribution

### Chrome Web Store
- Go to: https://chrome.google.com/webstore/devconsole
- Upload ZIP: `extensions/dist/chrome/`
- Submit for review (usually approved within hours)

### Firefox Add-ons
- Go to: https://addons.mozilla.org/en-US/developers/
- Create new version
- Upload ZIP: `extensions/dist/firefox/`
- Submit for review (usually approved within 1-2 days)

### NPM Package
```bash
npm publish
# Publishes dist/ folder
# Verify: https://www.npmjs.com/package/socketio-test-client
```

### AUR Package
```bash
# Get checksum
wget https://github.com/serajhqi/socketio-test-client/archive/v1.0.1.tar.gz
sha256sum v1.0.1.tar.gz

# Update PKGBUILD:
# - pkgver=1.0.1
# - sha256sum=<from above>
# - pkgrel=1

git commit -am "Update to 1.0.1"
git push
```

---

## Step 5: Post-Release Verification

- [ ] All distributions show correct version
- [ ] Test "What's New" modal on upgrade (set old `lastSeenVersion` in localStorage)
- [ ] Announce release (GitHub, social media, etc.)
