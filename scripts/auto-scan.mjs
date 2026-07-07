import { chromium, devices } from 'playwright'
import fs from 'fs'

const url = 'http://127.0.0.1:4173/'
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', ...devices['iPhone 13'] },
]

const results = []

for (const vp of viewports) {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext('viewport' in vp ? vp : { viewport: { width: vp.width, height: vp.height } })
  const page = await context.newPage()
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `../output/${vp.name}-home.png`, fullPage: true })
  const metrics = await page.evaluate(() => {
    const doc = document.documentElement
    const overflow = doc.scrollWidth - doc.clientWidth
    const buttons = Array.from(document.querySelectorAll('button,a,summary'))
    const tinyTargets = buttons
      .map((el) => {
        const r = el.getBoundingClientRect()
        const text = (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24)
        return { text, width: Math.round(r.width), height: Math.round(r.height) }
      })
      .filter((item) => item.width > 0 && item.height > 0 && (item.width < 40 || item.height < 40))
      .slice(0, 12)
    const sections = Array.from(document.querySelectorAll('section[id]')).map((el) => el.id)
    return { title: document.title, width: doc.clientWidth, scrollWidth: doc.scrollWidth, overflow, tinyTargets, sections }
  })

  await page.click('button[aria-label="菜单"]').catch(() => {})
  await page.screenshot({ path: `../output/${vp.name}-nav.png`, fullPage: false })
  await page.click('text=旅行工具').catch(() => {})
  await page.waitForTimeout(500)
  await page.screenshot({ path: `../output/${vp.name}-tools.png`, fullPage: false })

  results.push({ viewport: vp.name, metrics, consoleErrors: errors.slice(0, 10) })
  await browser.close()
}

fs.writeFileSync('../output/auto-scan-report.json', JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
