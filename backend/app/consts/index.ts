import { config } from "dotenv"

// Load environment variables
config()

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export * from "./clothing"
export * from "./weather"
export * from "./place"
