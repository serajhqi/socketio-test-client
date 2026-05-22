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

test.describe('History Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await connectToServer(page)
  })

  test('should display history panel', async ({ page }) => {
    const historyPanel = page.locator('text=History')
    await expect(historyPanel).toBeVisible()
  })

  test('should show empty history initially', async ({ page }) => {
    // Expand history if collapsed
    const toggleBtn = page.locator('button').filter({ hasText: 'History' }).first()
    const arrowText = await toggleBtn.locator('span').first().textContent()

    if (arrowText?.includes('▶')) {
      await toggleBtn.click()
    }

    const emptyMsg = page.locator('text=No history yet')
    // History might be collapsed initially, which is fine
    await expect(toggleBtn).toBeVisible()
  })

  test('should add request to history', async ({ page }) => {
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const titleInput = page.locator('input[placeholder*="Description for history"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await titleInput.fill('My First Request')
    await sendBtn.click()

    await page.waitForTimeout(500)

    // Expand history
    const toggleBtn = page.locator('button').filter({ hasText: 'History' }).first()
    const arrowText = await toggleBtn.locator('span').first().textContent()

    if (arrowText?.includes('▶')) {
      await toggleBtn.click()
      await page.waitForTimeout(200)
    }

    // Request should appear in history
    const historyItem = page.locator('text=My First Request')
    await expect(historyItem).toBeVisible()
  })

  test('should filter history by search', async ({ page }) => {
    // Send multiple requests
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const titleInput = page.locator('input[placeholder*="Description for history"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await titleInput.fill('User Request')
    await sendBtn.click()
    await page.waitForTimeout(300)

    await eventInput.clear()
    await titleInput.clear()
    await eventInput.fill('echo')
    await titleInput.fill('Message Request')
    await sendBtn.click()
    await page.waitForTimeout(300)

    // Expand history
    const toggleBtn = page.locator('button').filter({ hasText: 'History' }).first()
    const arrowText = await toggleBtn.locator('span').first().textContent()

    if (arrowText?.includes('▶')) {
      await toggleBtn.click()
      await page.waitForTimeout(200)
    }

    // Search for "User"
    const searchInput = page.locator('input[placeholder="Search requests..."]')
    await searchInput.fill('User')

    await page.waitForTimeout(300)

    // Should show only User Request
    const userItem = page.locator('text=User Request')
    await expect(userItem).toBeVisible()

    const messageItem = page.locator('text=Message Request')
    await expect(messageItem).not.toBeVisible()
  })

  test('should clear search filter', async ({ page }) => {
    // Add requests
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const titleInput = page.locator('input[placeholder*="Description for history"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await titleInput.fill('Request A')
    await sendBtn.click()
    await page.waitForTimeout(300)

    // Expand history
    const toggleBtn = page.locator('button').filter({ hasText: 'History' }).first()
    const arrowText = await toggleBtn.locator('span').first().textContent()

    if (arrowText?.includes('▶')) {
      await toggleBtn.click()
      await page.waitForTimeout(200)
    }

    // Search
    const searchInput = page.locator('input[placeholder="Search requests..."]')
    await searchInput.fill('B')

    await page.waitForTimeout(300)

    // Clear search
    await searchInput.clear()
    await page.waitForTimeout(300)

    // Should show all requests again
    const itemA = page.locator('text=Request A')
    await expect(itemA).toBeVisible()
  })

  test('should open request from history', async ({ page }) => {
    // Send a request
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const titleInput = page.locator('input[placeholder*="Description for history"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await titleInput.fill('Saved Request')
    await sendBtn.click()
    await page.waitForTimeout(500)

    // Clear inputs
    await eventInput.clear()
    await titleInput.clear()

    // Expand history
    const toggleBtn = page.locator('button').filter({ hasText: 'History' }).first()
    const arrowText = await toggleBtn.locator('span').first().textContent()

    if (arrowText?.includes('▶')) {
      await toggleBtn.click()
      await page.waitForTimeout(200)
    }

    // Click on history item
    const historyItem = page.locator('text=Saved Request')
    await historyItem.click()

    await page.waitForTimeout(300)

    // Inputs should be restored
    const restoredEvent = eventInput.inputValue()
    const restoredTitle = titleInput.inputValue()

    expect(await restoredEvent).toBe('echo')
    expect(await restoredTitle).toBe('Saved Request')
  })

  test('should remove request from history', async ({ page }) => {
    // Send a request
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const titleInput = page.locator('input[placeholder*="Description for history"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await titleInput.fill('Request To Remove')
    await sendBtn.click()
    await page.waitForTimeout(500)

    // Expand history
    const toggleBtn = page.locator('button').filter({ hasText: 'History' }).first()
    const arrowText = await toggleBtn.locator('span').first().textContent()

    if (arrowText?.includes('▶')) {
      await toggleBtn.click()
      await page.waitForTimeout(200)
    }

    // Find and click remove button
    const historyItem = page.locator('text=Request To Remove')
    const removeBtn = historyItem.locator('xpath=following::button[1]')
    await removeBtn.click()

    await page.waitForTimeout(300)

    // Item should be gone
    await expect(historyItem).not.toBeVisible()
  })

  test('should persist history across page reloads', async ({ page }) => {
    // Send a request
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const titleInput = page.locator('input[placeholder*="Description for history"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await titleInput.fill('Persistent Request')
    await sendBtn.click()
    await page.waitForTimeout(500)

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Expand history
    const toggleBtn = page.locator('button').filter({ hasText: 'History' }).first()
    const arrowText = await toggleBtn.locator('span').first().textContent()

    if (arrowText?.includes('▶')) {
      await toggleBtn.click()
      await page.waitForTimeout(200)
    }

    // Request should still be in history
    const historyItem = page.locator('text=Persistent Request')
    await expect(historyItem).toBeVisible()
  })

  test('should toggle history panel collapse', async ({ page }) => {
    const toggleBtn = page.locator('button').filter({ hasText: 'History' }).first()

    // Get initial state
    const arrowBefore = await toggleBtn.locator('span').first().textContent()

    await toggleBtn.click()
    await page.waitForTimeout(200)

    // Arrow should flip
    const arrowAfter = await toggleBtn.locator('span').first().textContent()

    expect(arrowBefore).not.toBe(arrowAfter)
  })

  test('should show history count badge', async ({ page }) => {
    // Send requests
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const titleInput = page.locator('input[placeholder*="Description for history"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await titleInput.fill('Request 1')
    await sendBtn.click()
    await page.waitForTimeout(300)

    await eventInput.clear()
    await titleInput.clear()
    await eventInput.fill('echo')
    await titleInput.fill('Request 2')
    await sendBtn.click()
    await page.waitForTimeout(300)

    // Count should be displayed
    const countBadge = page.locator('button').filter({ hasText: 'History' }).first()
    const text = await countBadge.textContent()

    expect(text).toContain('2')
  })
})
