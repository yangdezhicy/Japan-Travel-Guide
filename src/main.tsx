import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('#root 挂载点不存在')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
