#!/usr/bin/env node

/**
 * Test script to verify tRPC error handling works correctly
 * This simulates the production error scenario
 */

import { createTRPCClient, httpLink } from "@trpc/client"
import superjson from "superjson"

console.log("🧪 Testing tRPC error handling...")

// Create a test tRPC client
const trpcClient = createTRPCClient({
  links: [
    httpLink({
      url: "http://localhost:3333/api/trpc",
      transformer: superjson,
      headers: {
        "Content-Type": "application/json"
      }
    })
  ]
})

async function testErrorHandling() {
  try {
    console.log("Testing place creation with invalid input...")

    // This should trigger a validation error
    const result = await trpcClient.places.create.mutate({
      description: "" // Empty description should fail validation
    })

    console.log("❌ Unexpected success:", result)
  } catch (error) {
    console.log("✅ Error caught successfully!")
    console.log("Error type:", error.constructor.name)
    console.log("Error message:", error.message)
    console.log("Error data:", error.data)

    // Check if it's a proper tRPC error
    if (error.name === "TRPCClientError") {
      console.log("✅ Proper tRPC error format received")
    } else {
      console.log("❌ Not a tRPC error format")
    }
  }
}

async function testServerHealth() {
  try {
    console.log("Testing server health...")
    const response = await fetch("http://localhost:3333/api/health/keys")
    const data = await response.json()
    console.log("✅ Server health check:", data.status)
  } catch (error) {
    console.log("❌ Server health check failed:", error.message)
  }
}

async function runTests() {
  console.log("Starting tRPC error handling tests...\n")

  await testServerHealth()
  console.log("")
  await testErrorHandling()

  console.log("\n🎉 Error handling tests completed!")
}

runTests().catch(console.error)
