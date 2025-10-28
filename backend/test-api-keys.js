#!/usr/bin/env bun

/**
 * Test script to verify API key error handling
 * Run this to test the new error messages
 */

console.log("🧪 Testing API Key Error Handling...\n")

// Test 1: Missing API keys
console.log("Test 1: Missing API keys")
process.env.OPENAI_API_KEY = ""
process.env.OPENCAGE_API_KEY = ""

try {
  const { ApiKeyManager } = await import("./app/security/apiKeys.js")
  const keyManager = ApiKeyManager.getInstance()

  console.log("API Key Status:", keyManager.getStatus())

  // This should throw an error with helpful message
  try {
    keyManager.getOpenAIKey()
  } catch (error) {
    console.log("✅ OpenAI Error:", error.message)
    if (error.helpMessage) {
      console.log("Help:", error.helpMessage)
    }
  }

  try {
    keyManager.getOpenCageKey()
  } catch (error) {
    console.log("✅ OpenCage Error:", error.message)
    if (error.helpMessage) {
      console.log("Help:", error.helpMessage)
    }
  }
} catch (error) {
  console.log("❌ Unexpected error:", error.message)
}

console.log("\n" + "=".repeat(50) + "\n")

// Test 2: Valid API keys
console.log("Test 2: Valid API keys")
process.env.OPENAI_API_KEY =
  "sk-test1234567890abcdef1234567890abcdef1234567890abcdef12"
process.env.OPENCAGE_API_KEY = "test1234567890abcdef1234567890ab"

try {
  const { ApiKeyManager } = await import("./app/security/apiKeys.js")
  const keyManager = ApiKeyManager.getInstance()

  console.log("API Key Status:", keyManager.getStatus())

  // This should work
  const openaiKey = keyManager.getOpenAIKey()
  const opencageKey = keyManager.getOpenCageKey()

  console.log("✅ OpenAI Key:", openaiKey.substring(0, 10) + "...")
  console.log("✅ OpenCage Key:", opencageKey.substring(0, 10) + "...")
} catch (error) {
  console.log("❌ Unexpected error:", error.message)
}

console.log("\n🎉 API Key Error Handling Test Complete!")
