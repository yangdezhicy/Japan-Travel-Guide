import { chromium } from 'playwright'

const url = process.argv[2]
if (!url) throw new Error('Usage: node scripts/check-page-assets.mjs <url>')

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } })
const failed = []
page.on('requestfailed', (request) => {
  const failure = request.failure()
  failed.push({ url: request.url(), error: failure?.errorText || '' })
})
await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
for (let i = 0; i < 8; i += 1) {
  await page.mouse.wheel(0, 1400)
  await page.waitForTimeout(500)
}
await page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {})
await browser.close()

console.log(JSON.stringify({ url, failedCount: failed.length, failed }, null, 2))
