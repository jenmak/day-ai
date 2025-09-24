import { config } from "dotenv"

// Load environment variables
config()

// Note: OPENAI_API_KEY is now managed securely through ApiKeyManager
// Direct access to process.env.OPENAI_API_KEY is not allowed for security

export * from "./clothing"
export * from "./place"
export * from "./weather"
