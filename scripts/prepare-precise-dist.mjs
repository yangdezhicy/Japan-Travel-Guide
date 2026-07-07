import fs from 'node:fs'
import path from 'node:path'

const projectRoot = process.cwd()
const distDir = path.join(projectRoot, 'dist')
const outputDir = path.join(projectRoot, 'dist_precise')
const sourceDir = path.join(projectRoot, 'src')
const publicImagesDir = path.join(projectRoot, 'public', 'images')

const IMAGE_EXT_RE = /\.(?:jpg|jpeg|png|webp|svg)$/i
const SOURCE_EXT_RE = /\.(?:ts|tsx|js|jsx|css|html)$/i

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

function readSourceText() {
  const files = [
    path.join(projectRoot, 'index.html'),
    ...walk(sourceDir).filter((file) => SOURCE_EXT_RE.test(file)),
  ]
  return files.map((file) => fs.readFileSync(file, 'utf8')).join('\n')
}

function collectExistingImageNames() {
  const names = new Set()
  for (const dir of [path.join(distDir, 'images'), publicImagesDir]) {
    for (const file of walk(dir)) {
      if (IMAGE_EXT_RE.test(file)) names.add(path.basename(file))
    }
  }
  return names
}

function collectRealProductIds(sourceText) {
  const match = sourceText.match(/REAL_PRODUCT_IMAGE_IDS\s*=\s*new Set<string>\(\[([\s\S]*?)\]\)/)
  if (!match) return new Set()
  return new Set([...match[1].matchAll(/['"]([^'"]+)['"]/g)].map((item) => item[1]))
}

function collectDirectImageLiterals(sourceText, existingImages) {
  const names = new Set()
  for (const match of sourceText.matchAll(/['"`]([^'"`]+\.(?:jpg|jpeg|png|webp|svg))['"`]/gi)) {
    const rawValue = match[1]
    const fileName = path.basename(rawValue.replace(/^\/images\//, ''))
    if (existingImages.has(fileName)) names.add(fileName)
  }
  return names
}

function collectObjectChunks(sourceText) {
  const chunks = []
  let chunk = []
  let depth = 0

  for (const line of sourceText.split('\n')) {
    const startsObject = depth === 0 && /^\s*\{/.test(line)
    if (startsObject) chunk = []
    if (depth > 0 || startsObject) chunk.push(line)

    if (depth > 0 || startsObject) {
      const openCount = (line.match(/\{/g) || []).length
      const closeCount = (line.match(/\}/g) || []).length
      depth += openCount - closeCount
      if (depth === 0 && chunk.length) {
        chunks.push(chunk.join('\n'))
        chunk = []
      }
    }
  }

  return chunks
}

function collectSouvenirImageNames(sourceText, realProductIds, existingImages) {
  const names = new Set()

  for (const chunk of collectObjectChunks(sourceText)) {
    const idMatch = chunk.match(/(?:['"]id['"]|\bid)\s*:\s*['"]([^'"]+)['"]/)
    const imgMatch = chunk.match(/(?:['"]img['"]|\bimg)\s*:\s*['"]([^'"]+)['"]/)
    if (!idMatch || !imgMatch) continue

    const id = idMatch[1]
    const img = imgMatch[1]
    if (img.includes('.')) continue

    const imgExtMatch = chunk.match(/(?:['"]imgExt['"]|\bimgExt)\s*:\s*['"]([^'"]+)['"]/)
    const imgExt = imgExtMatch?.[1] || 'jpg'

    const generatedName = `sv_${img}.${imgExt}`
    if (existingImages.has(generatedName)) names.add(generatedName)

    if (realProductIds.has(id)) {
      const realName = `sv_product_${id}.png`
      if (existingImages.has(realName)) names.add(realName)
    }
  }

  // The shopping runtime intentionally maps every REAL_PRODUCT_IMAGE_IDS entry to sv_product_<id>.png.
  // Keep all currently available real product files so category/detail interactions do not miss late-rendered images.
  for (const id of realProductIds) {
    const realName = `sv_product_${id}.png`
    if (existingImages.has(realName)) names.add(realName)
  }

  return names
}

function copyEssentialDist() {
  fs.rmSync(outputDir, { recursive: true, force: true })
  fs.mkdirSync(outputDir, { recursive: true })

  for (const entry of fs.readdirSync(distDir, { withFileTypes: true })) {
    const source = path.join(distDir, entry.name)
    const target = path.join(outputDir, entry.name)
    if (entry.name === 'images') continue
    fs.cpSync(source, target, { recursive: true })
  }

  fs.mkdirSync(path.join(outputDir, 'images'), { recursive: true })
}

function copyNeededImages(imageNames) {
  const distImagesDir = path.join(distDir, 'images')
  const targetImagesDir = path.join(outputDir, 'images')
  const missing = []

  for (const imageName of [...imageNames].sort()) {
    const fromDist = path.join(distImagesDir, imageName)
    const fromPublic = path.join(publicImagesDir, imageName)
    const target = path.join(targetImagesDir, imageName)

    if (fs.existsSync(fromDist)) {
      fs.copyFileSync(fromDist, target)
    } else if (fs.existsSync(fromPublic)) {
      fs.copyFileSync(fromPublic, target)
    } else {
      missing.push(imageName)
    }
  }

  return missing
}

function countFiles(dir) {
  return walk(dir).length
}

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  throw new Error('dist/index.html 不存在，请先执行 npm run build')
}

const sourceText = readSourceText()
const existingImages = collectExistingImageNames()
const realProductIds = collectRealProductIds(sourceText)
const directImages = collectDirectImageLiterals(sourceText, existingImages)
const souvenirImages = collectSouvenirImageNames(sourceText, realProductIds, existingImages)
const neededImages = new Set([...directImages, ...souvenirImages])

copyEssentialDist()
const missing = copyNeededImages(neededImages)

const report = {
  generatedAt: new Date().toISOString(),
  outputDir: path.relative(projectRoot, outputDir),
  totalFiles: countFiles(outputDir),
  imageFiles: walk(path.join(outputDir, 'images')).length,
  keptImages: neededImages.size,
  directImages: directImages.size,
  souvenirImages: souvenirImages.size,
  missing,
}

fs.writeFileSync(path.join(outputDir, 'precise-dist-report.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
