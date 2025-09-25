import { config } from "dotenv"

// Load environment variables
// OPEN_AI_API_KEY is now managed securely through ApiKeyManager.
// Direct access to process.env.OPENAI_API_KEY is not allowed for security
config()

export * from "./clothing"
export * from "./place"
export * from "./weather"
