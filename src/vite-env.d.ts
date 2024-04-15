/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly PC_BASE: string; // Public base;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
