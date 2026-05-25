import { test, expect } from '@playwright/test'

test.describe('Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('should display profile switcher button', async ({ page }) => {
    const profileBtn = page.locator('button').filter({ hasText: 'Profiles' })
    await expect(profileBtn).toBeVisible()
  })

  test('should open profile dropdown', async ({ page }) => {
    const profileBtn = page.locator('button').filter({ hasText: 'Profiles' }).first()
    await profileBtn.click()

    const dropdown = page.locator('text=Save as Profile')
    await expect(dropdown).toBeVisible()
  })

  test('should save current settings as profile', async ({ page }) => {
    // Set server address first
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    await page.waitForTimeout(200)

    // Open profile dropdown
    const profileBtn = page.locator('button').filter({ hasText: 'Profiles' }).first()
    await profileBtn.click()

    // Click save as profile
    const saveAsBtn = page.locator('button').filter({ hasText: 'Save as Profile' })
    await saveAsBtn.click()

    // Enter profile name
    page.once('dialog', (dialog) => {
      dialog.accept('Dev Server')
    })

    await page.waitForTimeout(500)

    // Profile should appear in dropdown
    const profileBtn2 = page.locator('button').filter({ hasText: 'Dev Server' }).first()
    await expect(profileBtn2).toBeVisible()
  })

  test('should switch between profiles', async ({ page }) => {
    // Create first profile
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    await page.waitForTimeout(200)

    let profileBtn = page.locator('button').filter({ hasText: 'Profiles' }).first()
    await profileBtn.click()

    let saveAsBtn = page.locator('button').filter({ hasText: 'Save as Profile' })
    await saveAsBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('Profile A')
    })

    await page.waitForTimeout(300)

    // Close dropdown
    await page.click('body', { position: { x: 0, y: 0 } })

    await page.waitForTimeout(200)

    // Create second profile with different settings
    await serverBtn.click()

    const addressInput2 = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput2.clear()
    await addressInput2.fill('https://api.example.com')

    const saveBtn2 = page.locator('button:has-text("Save")')
    await saveBtn2.click()

    await page.waitForTimeout(200)

    profileBtn = page.locator('button').filter({ hasText: 'Profile A' }).first()
    await profileBtn.click()

    saveAsBtn = page.locator('button').filter({ hasText: 'Save as Profile' })
    await saveAsBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('Profile B')
    })

    await page.waitForTimeout(300)

    // Switch to Profile A
    const profileABtn = page.locator('button').filter({ hasText: 'Profile A' })
    await profileABtn.click()

    await page.waitForTimeout(300)

    // Profile button should now show "Profile A"
    const activeProfile = page.locator('button').filter({ hasText: 'Profile A' }).first()
    await expect(activeProfile).toBeVisible()
  })

  test('should rename a profile', async ({ page }) => {
    // Create a profile
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    await page.waitForTimeout(200)

    let profileBtn = page.locator('button').filter({ hasText: 'Profiles' }).first()
    await profileBtn.click()

    const saveAsBtn = page.locator('button').filter({ hasText: 'Save as Profile' })
    await saveAsBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('Old Name')
    })

    await page.waitForTimeout(300)

    // Find rename button
    const profileItem = page.locator('text=Old Name')
    const renameBtn = profileItem.locator('xpath=../following::button[1]')
    await renameBtn.click()

    await page.waitForTimeout(200)

    // Should show input field for renaming
    const renameInput = page.locator('input[value="Old Name"]')
    await renameInput.clear()
    await renameInput.fill('New Name')

    const confirmBtn = page.locator('button:has-text("✓")')
    await confirmBtn.click()

    await page.waitForTimeout(300)

    // Profile should be renamed
    const newNameProfile = page.locator('text=New Name')
    await expect(newNameProfile).toBeVisible()
  })

  test('should delete a profile', async ({ page }) => {
    // Create a profile to delete
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    await page.waitForTimeout(200)

    let profileBtn = page.locator('button').filter({ hasText: 'Profiles' }).first()
    await profileBtn.click()

    const saveAsBtn = page.locator('button').filter({ hasText: 'Save as Profile' })
    await saveAsBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('To Delete')
    })

    await page.waitForTimeout(300)

    // Find delete button
    const profileItem = page.locator('text=To Delete')
    const deleteBtn = profileItem.locator('xpath=../following::button[2]')

    page.once('dialog', (dialog) => {
      dialog.accept() // Confirm deletion
    })

    await deleteBtn.click()

    await page.waitForTimeout(300)

    // Profile should be gone
    await expect(profileItem).not.toBeVisible()
  })

  test('should show empty message when no profiles', async ({ page }) => {
    const profileBtn = page.locator('button').filter({ hasText: 'Profiles' }).first()
    await profileBtn.click()

    const emptyMsg = page.locator('text=No profiles yet')
    await expect(emptyMsg).toBeVisible()
  })

  test('should show profile hostname', async ({ page }) => {
    // Create a profile
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://myserver.example.com:3000')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    await page.waitForTimeout(200)

    let profileBtn = page.locator('button').filter({ hasText: 'Profiles' }).first()
    await profileBtn.click()

    const saveAsBtn = page.locator('button').filter({ hasText: 'Save as Profile' })
    await saveAsBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('Custom')
    })

    await page.waitForTimeout(300)

    // Hostname should be displayed
    const hostname = page.locator('text=myserver.example.com')
    await expect(hostname).toBeVisible()
  })

  test('should highlight active profile', async ({ page }) => {
    // Create a profile
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    await page.waitForTimeout(200)

    let profileBtn = page.locator('button').filter({ hasText: 'Profiles' }).first()
    await profileBtn.click()

    const saveAsBtn = page.locator('button').filter({ hasText: 'Save as Profile' })
    await saveAsBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('Active')
    })

    await page.waitForTimeout(300)

    // Click on profile to activate it
    const profileItem = page.locator('text=Active')
    await profileItem.click()

    await page.waitForTimeout(200)

    // Reopen dropdown to see active state
    profileBtn = page.locator('button').filter({ hasText: 'Active' }).first()
    await profileBtn.click()

    const activeItem = page.locator('.profile-item--active')
    await expect(activeItem).toBeVisible()
  })
})
