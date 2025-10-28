#!/usr/bin/env node

/**
 * Test script to verify superjson serialization works correctly
 * This tests the date serialization that was causing the production error
 */

import superjson from "superjson"

console.log("🧪 Testing superjson serialization...")

// Test data similar to what the Place schema would produce
const testPlace = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  description: "Test location",
  normalizedPlace: "Test City, Test State",
  slug: "test-city-test-state",
  geocodedAddress: {
    latitude: 40.7128,
    longitude: -74.006,
    formattedAddress: "Test City, Test State, Test Country",
    structuredAddress: {
      city: "Test City",
      state: "Test State",
      postalCode: "12345",
      country: "Test Country"
    }
  },
  weather: [
    {
      date: "2025-01-28",
      degreesFahrenheit: 72,
      temperatureRange: {
        temperatureMinimum: 65,
        temperatureMaximum: 80
      },
      temperatureRangeCategory: "WARM",
      rainProbabilityPercentage: 20,
      windSpeedMph: 10,
      condition: 3,
      clothing: ["t-shirt", "shorts", "sneakers"]
    }
  ],
  temperatureRangeCategory: "WARM",
  createdAt: new Date() // This is the key fix - using Date object instead of string
}

try {
  console.log("Original data:")
  console.log("- createdAt type:", typeof testPlace.createdAt)
  console.log("- createdAt value:", testPlace.createdAt)

  // Test serialization
  const serialized = superjson.stringify(testPlace)
  console.log("\n✅ Serialization successful!")
  console.log("- Serialized length:", serialized.length)

  // Test deserialization
  const deserialized = superjson.parse(serialized)
  console.log("\n✅ Deserialization successful!")
  console.log("- Deserialized createdAt type:", typeof deserialized.createdAt)
  console.log("- Deserialized createdAt value:", deserialized.createdAt)
  console.log("- Is Date object:", deserialized.createdAt instanceof Date)

  console.log("\n🎉 All tests passed! The serialization issue should be fixed.")
} catch (error) {
  console.error("❌ Serialization test failed:", error.message)
  console.error("Stack:", error.stack)
  process.exit(1)
}
