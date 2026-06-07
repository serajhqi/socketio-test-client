import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

try {
  console.log('1. Fresh install - verifying no modal appears...')
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  
  const modalInitially = await page.locator('text=What\'s New').isVisible().catch(() => false)
  console.log(`   Modal visible on fresh install: ${modalInitially} (expected: false)`)
  if (modalInitially) {
    await page.screenshot({ path: '/tmp/fail-fresh.png' })
    throw new Error('Modal should not appear on fresh install!')
  }
  
  console.log('\n2. Simulating version upgrade (setting old version in localStorage)...')
  await page.evaluate(() => {
    const state = {
      address: null,
      status: 'disconnected',
      options: {},
      profiles: [],
      activeProfileId: null,
      requestHistory: [],
      listeners: [],
      lastSeenVersion: '0.9.0',
      historyCollapsed: false,
      theme: 'dark',
      repoStars: 0,
    }
    localStorage.setItem('socketio-client', JSON.stringify({ state, version: 3 }))
  })
  
  console.log('\n3. Reloading page - modal should appear with upgrade info...')
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  
  const modalAfterUpgrade = await page.locator('text=What\'s New').isVisible().catch(() => false)
  console.log(`   Modal visible after upgrade: ${modalAfterUpgrade} (expected: true)`)
  
  if (!modalAfterUpgrade) {
    await page.screenshot({ path: '/tmp/fail-upgrade.png' })
    throw new Error('Modal should appear after version upgrade!')
  }
  
  // Verify modal content
  const version = await page.locator('text=v1.0.0').isVisible().catch(() => false)
  console.log(`   Version badge "v1.0.0" visible: ${version}`)
  
  const feature1 = await page.locator('text=Light/dark theme toggle').isVisible().catch(() => false)
  const feature2 = await page.locator('text=Donate button').isVisible().catch(() => false)
  const fix1 = await page.locator('text=Prevent modal close when dragging text selection outside').isVisible().catch(() => false)
  
  console.log(`   Feature "Light/dark theme toggle" visible: ${feature1}`)
  console.log(`   Feature "Donate button" visible: ${feature2}`)
  console.log(`   Fix visible: ${fix1}`)
  
  if (!version || !feature1 || !feature2 || !fix1) {
    await page.screenshot({ path: '/tmp/fail-content.png' })
    throw new Error('Modal content incomplete!')
  }
  
  console.log('\n4. Closing modal and reloading - should not appear again...')
  const closeBtn = page.locator('button').filter({ has: page.locator('[aria-label="Close"]') }).first()
  await closeBtn.click()
  await page.waitForTimeout(300)
  
  const modalHidden = await page.locator('text=What\'s New').isHidden().catch(() => false)
  console.log(`   Modal hidden after close: ${modalHidden}`)
  
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  
  const modalAfterReload = await page.locator('text=What\'s New').isVisible().catch(() => false)
  console.log(`   Modal visible after reload: ${modalAfterReload} (expected: false)`)
  
  if (modalAfterReload) {
    await page.screenshot({ path: '/tmp/fail-reappear.png' })
    throw new Error('Modal should not reappear after closing and reloading!')
  }
  
  console.log('\n✅ All checks passed!')
  await page.screenshot({ path: '/tmp/success.png' })
  
} catch (err) {
  console.error('\n❌ Error:', err.message)
  process.exit(1)
} finally {
  await browser.close()
}
