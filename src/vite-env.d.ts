/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    /** 用于弹窗滚动锁定的全局计数器 */
    __jpModalLocks?: number
  }
}

export {}
