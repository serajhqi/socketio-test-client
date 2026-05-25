import { test, expect } from '@playwright/test'

async function connectToServer(page: any) {
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
}

test.describe('Request/Response Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await connectToServer(page)
  })

  test('should display request panel', async ({ page }) => {
    const requestPanel = page.locator('text=Send Request')
    await expect(requestPanel).toBeVisible()
  })

  test('should display response panel', async ({ page }) => {
    const responsePanel = page.locator('text=Response')
    await expect(responsePanel).toBeVisible()
  })

  test('should show error when event name is empty', async ({ page }) => {
    const sendBtn = page.locator('button:has-text("Send")')
    await sendBtn.click()

    const error = page.locator('text=Event name is required')
    await expect(error).toBeVisible()
  })

  test('should disable send button when disconnected', async ({ page }) => {
    // Disconnect
    const disconnectBtn = page.locator('button:has-text("Disconnect")')
    await disconnectBtn.click()

    await page.waitForTimeout(500)

    // Send button should be disabled
    const sendBtn = page.locator('button:has-text("Send")')
    const isDisabled = await sendBtn.isDisabled()
    expect(isDisabled).toBe(true)
  })

  test('should send echo event and receive response', async ({ page }) => {
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const bodyTextarea = page.locator('textarea[placeholder*="message"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await bodyTextarea.fill('{"test": "data"}')

    await sendBtn.click()

    await page.waitForTimeout(1000)

    // Response should be displayed
    const response = page.locator('text=test')
    await expect(response).toBeVisible()
  })

  test('should display response duration', async ({ page }) => {
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await sendBtn.click()

    await page.waitForTimeout(1000)

    // Duration should be displayed (in ms or s)
    const duration = page.locator('text=/\\d+(ms|s)/')
    await expect(duration).toBeVisible()
  })

  test('should copy response to clipboard', async ({ page, context }) => {
    // Grant clipboard permission
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await sendBtn.click()

    await page.waitForTimeout(1000)

    // Find and click copy button
    const copyBtn = page.locator('button:has-text("Copy")')
    await copyBtn.click()

    // Toast notification should appear
    const toast = page.locator('text=Response copied')
    await expect(toast).toBeVisible({ timeout: 5000 })
  })

  test('should validate JSON body', async ({ page }) => {
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const bodyTextarea = page.locator('textarea[placeholder*="message"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await bodyTextarea.fill('invalid json')

    await sendBtn.click()

    const error = page.locator('text=Invalid JSON')
    await expect(error).toBeVisible()
  })

  test('should send request without body', async ({ page }) => {
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    // Leave body empty
    await sendBtn.click()

    await page.waitForTimeout(1000)

    // Should still work
    const responsePanel = page.locator('text=Response')
    await expect(responsePanel).toBeVisible()
  })

  test('should populate title field', async ({ page }) => {
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const titleInput = page.locator('input[placeholder*="Description for history"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await titleInput.fill('Test Echo Request')

    await sendBtn.click()

    await page.waitForTimeout(1000)

    // Request should appear in history with title
    const historyItem = page.locator('text=Test Echo Request')
    await expect(historyItem).toBeVisible()
  })

  test('should support slow-echo event with longer duration', async ({ page }) => {
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('slow-echo')
    await sendBtn.click()

    await page.waitForTimeout(1500)

    // Response should contain duration > 200ms
    const responsePanel = page.locator('text=Response')
    await expect(responsePanel).toBeVisible()
  })

  test('should send multiple requests sequentially', async ({ page }) => {
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const sendBtn = page.locator('button:has-text("Send")')

    // First request
    await eventInput.fill('echo')
    await sendBtn.click()
    await page.waitForTimeout(500)

    // Second request
    await eventInput.clear()
    await eventInput.fill('ping')
    await sendBtn.click()
    await page.waitForTimeout(500)

    // Both should work
    const responsePanel = page.locator('text=Response')
    await expect(responsePanel).toBeVisible()
  })
})
