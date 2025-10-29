#!/usr/bin/env node

/**
 * Test script to verify latitude/longitude conversion works correctly
 */

import { z } from "zod"

console.log("🧪 Testing latitude/longitude conversion...")

// Test the validation schema
const latitudeSchema = z
  .union([z.string(), z.number()])
  .transform((val) => Number(val))
  .pipe(
    z
      .number()
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90")
  )

const longitudeSchema = z
  .union([z.string(), z.number()])
  .transform((val) => Number(val))
  .pipe(
    z
      .number()
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180")
  )

function testConversion() {
  const testCases = [
    { input: "40.7128", type: "string", expected: 40.7128 },
    { input: 40.7128, type: "number", expected: 40.7128 },
    { input: "-74.0060", type: "string", expected: -74.006 },
    { input: -74.006, type: "number", expected: -74.006 },
    { input: "0", type: "string", expected: 0 },
    { input: 0, type: "number", expected: 0 }
  ]

  console.log("Testing latitude conversion:")
  testCases.forEach(({ input, type, expected }) => {
    try {
      const result = latitudeSchema.parse(input)
      console.log(`✅ ${type} "${input}" → ${result} (expected: ${expected})`)
      if (result !== expected) {
        console.log(`❌ Mismatch! Expected ${expected}, got ${result}`)
      }
    } catch (error) {
      console.log(`❌ ${type} "${input}" failed:`, error.message)
    }
  })

  console.log("\nTesting longitude conversion:")
  testCases.forEach(({ input, type, expected }) => {
    try {
      const result = longitudeSchema.parse(input)
      console.log(`✅ ${type} "${input}" → ${result} (expected: ${expected})`)
      if (result !== expected) {
        console.log(`❌ Mismatch! Expected ${expected}, got ${result}`)
      }
    } catch (error) {
      console.log(`❌ ${type} "${input}" failed:`, error.message)
    }
  })
}

function testInvalidValues() {
  console.log("\nTesting invalid values:")
  const invalidCases = ["invalid", "not-a-number", "", null, undefined, {}, []]

  invalidCases.forEach((input) => {
    try {
      latitudeSchema.parse(input)
      console.log(`❌ Should have failed for: ${JSON.stringify(input)}`)
    } catch (error) {
      console.log(
        `✅ Correctly rejected: ${JSON.stringify(input)} - ${error.message}`
      )
    }
  })
}

function testRangeValidation() {
  console.log("\nTesting range validation:")
  const rangeCases = [
    { value: 91, shouldFail: true, reason: "latitude too high" },
    { value: -91, shouldFail: true, reason: "latitude too low" },
    { value: 90, shouldFail: false, reason: "latitude at max" },
    { value: -90, shouldFail: false, reason: "latitude at min" },
    { value: 181, shouldFail: true, reason: "longitude too high" },
    { value: -181, shouldFail: true, reason: "longitude too low" },
    { value: 180, shouldFail: false, reason: "longitude at max" },
    { value: -180, shouldFail: false, reason: "longitude at min" }
  ]

  rangeCases.forEach(({ value, shouldFail, reason }) => {
    try {
      // Test latitude for latitude cases, longitude for longitude cases
      const isLongitude = reason.includes("longitude")
      const schema = isLongitude ? longitudeSchema : latitudeSchema
      const result = schema.parse(value)
      if (shouldFail) {
        console.log(`❌ Should have failed for ${value} (${reason})`)
      } else {
        console.log(`✅ ${value} passed validation (${reason})`)
      }
    } catch (error) {
      if (shouldFail) {
        console.log(
          `✅ ${value} correctly rejected (${reason}): ${error.message}`
        )
      } else {
        console.log(
          `❌ ${value} should have passed (${reason}): ${error.message}`
        )
      }
    }
  })
}

console.log("Starting latitude/longitude conversion tests...\n")
testConversion()
testInvalidValues()
testRangeValidation()
console.log("\n🎉 All tests completed!")
