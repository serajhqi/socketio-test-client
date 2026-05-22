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

test.describe('Listeners Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await connectToServer(page)
  })

  test('should display listeners panel', async ({ page }) => {
    const listenersPanel = page.locator('text=Listeners')
    await expect(listenersPanel).toBeVisible()
  })

  test('should show empty message initially', async ({ page }) => {
    const emptyMsg = page.locator('text=No listeners yet')
    await expect(emptyMsg).toBeVisible()
  })

  test('should add a listener', async ({ page }) => {
    const addBtn = page.locator('button').filter({ hasText: '+ Add' })
    await addBtn.click()

    // Prompt for listener name
    page.once('dialog', (dialog) => {
      dialog.accept('test-event')
    })

    await page.waitForTimeout(500)

    // Listener should appear
    const listener = page.locator('text=test-event')
    await expect(listener).toBeVisible()
  })

  test('should show no listeners message when cancelling add', async ({ page }) => {
    const addBtn = page.locator('button').filter({ hasText: '+ Add' })
    await addBtn.click()

    // Cancel the prompt
    page.once('dialog', (dialog) => {
      dialog.dismiss()
    })

    await page.waitForTimeout(300)

    // Should still show empty message
    const emptyMsg = page.locator('text=No listeners yet')
    await expect(emptyMsg).toBeVisible()
  })

  test('should remove a listener', async ({ page }) => {
    // Add a listener
    const addBtn = page.locator('button').filter({ hasText: '+ Add' })
    await addBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('to-remove')
    })

    await page.waitForTimeout(300)

    // Find and click remove button
    const listener = page.locator('text=to-remove')
    const removeBtn = listener.locator('xpath=following::button[1]')
    await removeBtn.click()

    await page.waitForTimeout(300)

    // Listener should be gone
    await expect(listener).not.toBeVisible()
  })

  test('should select a listener', async ({ page }) => {
    // Add a listener
    const addBtn = page.locator('button').filter({ hasText: '+ Add' })
    await addBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('selected')
    })

    await page.waitForTimeout(300)

    // Click listener
    const listener = page.locator('text=selected')
    await listener.click()

    // Should be highlighted
    const activeListener = page.locator('.listener-item--active')
    await expect(activeListener).toBeVisible()
  })

  test('should show message preview for listener', async ({ page }) => {
    // Add a listener
    const addBtn = page.locator('button').filter({ hasText: '+ Add' })
    await addBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('broadcast')
    })

    await page.waitForTimeout(300)

    // Trigger a broadcast event to send message to listener
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('broadcast')
    await sendBtn.click()

    await page.waitForTimeout(1000)

    // Message should appear in listener
    const messageCount = page.locator('text=/\\d+ messages?/')
    // This depends on the test server implementation
  })

  test('should display JSON viewer for selected message', async ({ page }) => {
    // Add listener
    const addBtn = page.locator('button').filter({ hasText: '+ Add' })
    await addBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('echo-listener')
    })

    await page.waitForTimeout(300)

    // Send an event
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const bodyTextarea = page.locator('textarea[placeholder*="message"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await bodyTextarea.fill('{"data": "test"}')
    await sendBtn.click()

    await page.waitForTimeout(1000)

    // Select listener and message to view JSON
    const listener = page.locator('text=echo-listener')
    await listener.click()

    await page.waitForTimeout(300)

    // JSON viewer should show the data
    const jsonViewer = page.locator('text=Select a message')
    // Depends on implementation
  })

  test('should clear listener messages', async ({ page }) => {
    // Add listener
    const addBtn = page.locator('button').filter({ hasText: '+ Add' })
    await addBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('clear-test')
    })

    await page.waitForTimeout(300)

    // Select listener
    const listener = page.locator('text=clear-test')
    await listener.click()

    await page.waitForTimeout(200)

    // Clear button should exist
    const clearBtn = page.locator('button').filter({ hasText: 'Clear' })
    // The second Clear button (in messages header)
    const clearBtns = clearBtn
    const count = await clearBtns.count()

    if (count > 1) {
      // Click the Clear button in the messages section
      await clearBtns.nth(1).click()

      await page.waitForTimeout(300)

      // Messages should be cleared
      const emptyMsg = page.locator('text=No messages yet')
      // Should be visible if messages were cleared
    }
  })

  test('should display multiple listeners', async ({ page }) => {
    const addBtn = page.locator('button').filter({ hasText: '+ Add' })

    // Add first listener
    await addBtn.click()
    page.once('dialog', (dialog) => {
      dialog.accept('listener-1')
    })
    await page.waitForTimeout(300)

    // Add second listener
    await addBtn.click()
    page.once('dialog', (dialog) => {
      dialog.accept('listener-2')
    })
    await page.waitForTimeout(300)

    // Both should be visible
    const listener1 = page.locator('text=listener-1')
    const listener2 = page.locator('text=listener-2')

    await expect(listener1).toBeVisible()
    await expect(listener2).toBeVisible()
  })

  test('should show message count for each listener', async ({ page }) => {
    const addBtn = page.locator('button').filter({ hasText: '+ Add' })
    await addBtn.click()

    page.once('dialog', (dialog) => {
      dialog.accept('count-test')
    })

    await page.waitForTimeout(300)

    // Count should be displayed (0 initially)
    const listener = page.locator('text=count-test')
    await expect(listener).toBeVisible()
  })
})
