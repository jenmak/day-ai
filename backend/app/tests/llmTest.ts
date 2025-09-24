import { LLMService } from "../services/llmService"

// Test the LLM service with various location descriptions
export async function testLLMService() {
  console.log("=== DayAI LLM Service Test ===\n")

  const testCases = [
    "Gotham City",
    "The Big Apple",
    "Home of the school that's better than Yale",
    "The Windy City",
    "La La Land",
    "The City of Angels",
    "The Emerald City",
    "The Motor City",
    "The Music City",
    "The Space City",
    "Springfield",
    "New York, NY", // Already normalized
    "Los Angeles, CA", // Already normalized
    "Some random place that doesn't exist"
  ]

  for (const testCase of testCases) {
    try {
      const result = await LLMService.normalizePlace(testCase)
      console.log(`Input: "${testCase}"`)
      console.log(`Output: "${result.normalizedPlace}"`)
      console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`)
      console.log(`Reasoning: ${result.reasoning}`)
      console.log("---")
    } catch (error) {
      console.error(`Error processing "${testCase}":`, error)
      console.log("---")
    }
  }
}

// Test a single place description with the real OpenAI API
async function testSingleLocation() {
  console.log("=== Single LLM Service Test ===\n")

  const testCase = "Gotham City"

  try {
    console.log(`Testing: "${testCase}"`)
    const result = await LLMService.normalizePlace(testCase)
    console.log(`✅ Result:`)
    console.log(`   Normalized: "${result.normalizedPlace}"`)
    console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`)
    console.log(`   Reasoning: ${result.reasoning}`)
  } catch (error) {
    console.error(`❌ Error processing "${testCase}":`, error)
  }
}

// Uncomment to run the test
// testLLMService()

// Run the single test
// testSingleLocation()
