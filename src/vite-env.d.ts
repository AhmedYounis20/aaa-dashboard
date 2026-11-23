/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PAYABLE_NOTES_ID: string;
  readonly VITE_RECEIVABLE_NOTES_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
