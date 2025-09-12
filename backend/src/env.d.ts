interface ImportMetaEnv {
  PORT?: string
  HOST?: string
  OPENAI_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
