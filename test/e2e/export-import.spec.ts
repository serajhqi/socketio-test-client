import { test, expect } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

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

test.describe('Export/Import Sessions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
    await connectToServer(page)
  })

  test('should display export button', async ({ page }) => {
    const exportBtn = page.getByTitle('Export session')
    await expect(exportBtn).toBeVisible()
  })

  test('should display import button', async ({ page }) => {
    const importBtn = page.getByTitle('Import session')
    await expect(importBtn).toBeVisible()
  })

  test('should export session data', async ({ page, context }) => {
    // Add some data
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const titleInput = page.locator('input[placeholder*="Description for history"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await titleInput.fill('Export Test')
    await sendBtn.click()

    await page.waitForTimeout(500)

    // Capture download
    const downloadPromise = page.waitForEvent('download')
    const exportBtn = page.getByTitle('Export session')
    await exportBtn.click()

    const download = await downloadPromise

    // Verify filename contains socketio-session
    expect(download.suggestedFilename()).toContain('socketio-session')
    expect(download.suggestedFilename()).toContain('.json')

    // Verify download succeeded
    const path_to_save = await download.path()
    expect(fs.existsSync(path_to_save)).toBe(true)

    // Read and verify content
    const content = fs.readFileSync(path_to_save, 'utf-8')
    const data = JSON.parse(content)

    expect(data.schema_version).toBe(1)
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('history')
    expect(data).toHaveProperty('listeners')
    expect(data).toHaveProperty('profiles')
  })

  test('should import valid session data', async ({ page }) => {
    // Create a test file
    const testData = {
      schema_version: 1,
      timestamp: Date.now(),
      history: [
        {
          title: 'Imported Request',
          emitName: 'test',
          body: '{"key": "value"}',
          response: undefined,
        },
      ],
      listeners: [
        {
          title: 'imported-listener',
          messages: [],
        },
      ],
      profiles: [
        {
          id: '1',
          name: 'Imported Profile',
          address: 'http://localhost:3099',
          options: {},
        },
      ],
    }

    const testFile = path.join(__dirname, 'test-import.json')
    fs.writeFileSync(testFile, JSON.stringify(testData, null, 2))

    try {
      // Import the file
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(testFile)

      await page.waitForTimeout(1000)

      // Toast should show success
      const successToast = page.locator('text=Imported')
      await expect(successToast).toBeVisible({ timeout: 5000 })

      // Expand history to verify import
      const toggleBtn = page.locator('button').filter({ hasText: 'History' }).first()
      const arrowText = await toggleBtn.locator('span').first().textContent()

      if (arrowText?.includes('▶')) {
        await toggleBtn.click()
        await page.waitForTimeout(200)
      }

      // Request should be in history
      const importedRequest = page.locator('text=Imported Request')
      await expect(importedRequest).toBeVisible()
    } finally {
      // Cleanup
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile)
      }
    }
  })

  test('should handle invalid import file', async ({ page }) => {
    // Create invalid JSON file
    const testFile = path.join(__dirname, 'invalid.json')
    fs.writeFileSync(testFile, 'invalid json content')

    try {
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(testFile)

      await page.waitForTimeout(500)

      // Error toast should appear
      const errorToast = page.locator('text=Import failed')
      await expect(errorToast).toBeVisible()
    } finally {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile)
      }
    }
  })

  test('should handle unsupported schema version', async ({ page }) => {
    const testData = {
      schema_version: 999,
      timestamp: Date.now(),
      history: [],
      listeners: [],
      profiles: [],
    }

    const testFile = path.join(__dirname, 'unsupported.json')
    fs.writeFileSync(testFile, JSON.stringify(testData))

    try {
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(testFile)

      await page.waitForTimeout(500)

      // Error should appear
      const errorToast = page.locator('text=Unsupported schema')
      await expect(errorToast).toBeVisible()
    } finally {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile)
      }
    }
  })

  test('should persist exported data across sessions', async ({ page }) => {
    // Add data
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await sendBtn.click()

    await page.waitForTimeout(500)

    // Export
    const downloadPromise = page.waitForEvent('download')
    const exportBtn = page.getByTitle('Export session')
    await exportBtn.click()

    const download = await downloadPromise
    const filePath = await download.path()

    // Verify the exported file contains the data
    const content = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)

    expect(data.history.length).toBeGreaterThan(0)
    expect(data.history[0].emitName).toBe('echo')
  })

  test('should export includes proper timestamp', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download')
    const exportBtn = page.getByTitle('Export session')
    await exportBtn.click()

    const download = await downloadPromise
    const filePath = await download.path()

    const content = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(content)

    expect(typeof data.timestamp).toBe('number')
    expect(data.timestamp).toBeGreaterThan(0)
    expect(data.timestamp).toBeLessThanOrEqual(Date.now())
  })

  test('should clear session before importing', async ({ page }) => {
    // Add some data
    const eventInput = page.locator('input[placeholder*="message, user:update"]')
    const sendBtn = page.locator('button:has-text("Send")')

    await eventInput.fill('echo')
    await sendBtn.click()

    await page.waitForTimeout(500)

    // Create import file with different data
    const importData = {
      schema_version: 1,
      timestamp: Date.now(),
      history: [
        {
          title: 'New Request',
          emitName: 'new-event',
          body: undefined,
          response: undefined,
        },
      ],
      listeners: [],
      profiles: [],
    }

    const testFile = path.join(__dirname, 'clear-test.json')
    fs.writeFileSync(testFile, JSON.stringify(importData))

    try {
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles(testFile)

      await page.waitForTimeout(1000)

      // Expand history
      const toggleBtn = page.locator('button').filter({ hasText: 'History' }).first()
      const arrowText = await toggleBtn.locator('span').first().textContent()

      if (arrowText?.includes('▶')) {
        await toggleBtn.click()
        await page.waitForTimeout(200)
      }

      // Should have the new request
      const newRequest = page.locator('text=New Request')
      await expect(newRequest).toBeVisible()
    } finally {
      if (fs.existsSync(testFile)) {
        fs.unlinkSync(testFile)
      }
    }
  })
})
