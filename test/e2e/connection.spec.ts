import { test, expect } from '@playwright/test'

test.describe('Connection Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('should display initial disconnected state', async ({ page }) => {
    const connectBtn = page.locator('button:has-text("Connect")')
    await expect(connectBtn).toBeVisible()
  })

  test('should open server settings modal', async ({ page }) => {
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const modal = page.locator('.modal-overlay')
    await expect(modal).toBeVisible()

    const title = page.locator('.modal__title')
    await expect(title).toContainText('Server Settings')
  })

  test('should save server address', async ({ page }) => {
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    // Modal should close
    const modal = page.locator('.modal-overlay')
    await expect(modal).not.toBeVisible()
  })

  test('should connect to server', async ({ page }) => {
    // Set server address first
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    // Wait for modal to close
    await page.waitForTimeout(200)

    // Click connect
    const connectBtn = page.locator('button:has-text("Connect")')
    await connectBtn.click()

    // Wait for connection
    await page.waitForTimeout(500)

    // Should show disconnect button
    const disconnectBtn = page.locator('button:has-text("Disconnect")')
    await expect(disconnectBtn).toBeVisible()
  })

  test('should display socket ID when connected', async ({ page }) => {
    // Set server and connect
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    await page.waitForTimeout(200)

    const connectBtn = page.locator('button:has-text("Connect")')
    await connectBtn.click()

    await page.waitForTimeout(500)

    // Socket ID should be displayed
    const socketIdLabel = page.locator('text=Socket ID:')
    await expect(socketIdLabel).toBeVisible()
  })

  test('should display transport type when connected', async ({ page }) => {
    // Set server and connect
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    await page.waitForTimeout(200)

    const connectBtn = page.locator('button:has-text("Connect")')
    await connectBtn.click()

    await page.waitForTimeout(500)

    // Transport should be displayed
    const transportLabel = page.locator('text=Transport:')
    await expect(transportLabel).toBeVisible()
  })

  test('should disconnect from server', async ({ page }) => {
    // Set server and connect
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    await page.waitForTimeout(200)

    let connectBtn = page.locator('button:has-text("Connect")')
    await connectBtn.click()

    await page.waitForTimeout(500)

    // Disconnect
    const disconnectBtn = page.locator('button:has-text("Disconnect")')
    await disconnectBtn.click()

    await page.waitForTimeout(500)

    // Should show connect button again
    connectBtn = page.locator('button:has-text("Connect")')
    await expect(connectBtn).toBeVisible()
  })

  test('should show error when server address is invalid', async ({ page }) => {
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.clear()

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    // Error message should appear
    const error = page.locator('text=Server address is required')
    await expect(error).toBeVisible()
  })

  test('should show error on invalid JSON options', async ({ page }) => {
    const serverBtn = page.getByTitle('Configure server address')
    await serverBtn.click()

    const addressInput = page.locator('input[placeholder*="localhost:3000"]')
    await addressInput.fill('http://localhost:3099')

    const optionsTextarea = page.locator('textarea[placeholder*="reconnection"]')
    await optionsTextarea.fill('invalid json')

    const saveBtn = page.locator('button:has-text("Save")')
    await saveBtn.click()

    // Error message should appear
    const error = page.locator('text=Invalid JSON')
    await expect(error).toBeVisible()
  })
})
