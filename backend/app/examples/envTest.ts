// Test if environment variables are loaded in the backend
console.log("=== Environment Variables Test ===")
console.log("OPENAI_API_KEY exists:", !!import.meta.env.OPENAI_API_KEY)
console.log("OPENAI_API_KEY length:", import.meta.env.OPENAI_API_KEY?.length || 0)
console.log("OPENAI_API_KEY starts with 'sk-':", import.meta.env.OPENAI_API_KEY?.startsWith('sk-') || false)

// Test the LLM service
import { LLMService } from "#app/services/llmService.ts"

async function testLLM() {
  try {
    const result = await LLMService.normalizeLocation("The Big Apple")
    console.log("LLM Result:", result)
  } catch (error) {
    console.error("LLM Error:", error)
  }
}

testLLM()

