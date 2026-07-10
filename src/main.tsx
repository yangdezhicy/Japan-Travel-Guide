import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const markMaterialIconsReady = () => document.body.classList.add('material-icons-ready')
const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts

if (fontSet) {
  void fontSet.load('24px "Material Symbols Outlined"').finally(markMaterialIconsReady)
} else {
  markMaterialIconsReady()
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('#root 挂载点不存在')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
