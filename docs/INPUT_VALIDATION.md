# Input Validation with Zod

This document outlines the comprehensive input validation system implemented using Zod schemas across the DripDropCity application.

## 🔍 Overview

### Validation Strategy

- **Schema-First Approach**: All inputs are validated using Zod schemas before processing
- **Type Safety**: Validation provides compile-time and runtime type safety
- **Error Handling**: Detailed validation errors with field-specific messages
- **Sanitization**: Automatic input sanitization to prevent XSS attacks
- **Performance**: Efficient validation with minimal overhead

### Validation Layers

1. **Frontend Validation**: Client-side validation for immediate feedback
2. **API Validation**: Server-side validation for all endpoints
3. **Service Validation**: Internal service method validation
4. **Database Validation**: Schema validation before data persistence

## 🛠️ Implementation

### 1. Backend Validation System

#### Core Validation Schemas (`/workspace/backend/app/schemas/validation.ts`)

```typescript
// Common validation utilities
export const StringValidation = {
  required: z.string().min(1, "Field is required"),
  optional: () => z.string().optional(),
  maxLength: (max: number) => z.string().max(max, `Must be ${max} characters or less`),
  lengthRange: (min: number, max: number) =>
    z
      .string()
      .min(min, `Must be at least ${min} characters`)
      .max(max, `Must be at most ${max} characters`),
  alphanumeric: z.string().regex(/^[a-zA-Z0-9]+$/, "Must contain only letters and numbers"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Must be a valid slug"),
  email: z.string().email("Must be a valid email address"),
  sanitized: z.string().transform((str) => sanitizeInput(str))
}

export const NumberValidation = {
  positive: z.number().positive("Must be a positive number"),
  nonNegative: z.number().nonnegative("Must be a non-negative number"),
  integer: () => z.number().int("Must be an integer"),
  range: (min: number, max: number) =>
    z.number().min(min, `Must be at least ${min}`).max(max, `Must be at most ${max}`),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  percentage: z.number().min(0).max(100),
  temperatureF: z.number().min(-50).max(150)
}
```

#### Enhanced Place Schemas (`/workspace/backend/app/schemas/place.ts`)

```typescript
// Enhanced Create Place Schema
export const CreatePlaceSchema = z.object({
  description: StringValidation.required
    .min(1, "Place description cannot be empty")
    .max(500, "Place description must be 500 characters or less")
    .refine((desc) => desc.trim().length > 0, "Place description cannot be only whitespace")
    .transform((desc) => desc.trim())
    .refine((desc) => !/^[0-9\s\-_]+$/.test(desc), "Place description must contain letters")
})

// Enhanced Address Schema
export const AddressSchema = z.object({
  city: StringValidation.required
    .min(1, "City name is required")
    .max(100, "City name must be 100 characters or less")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "City name contains invalid characters"),
  state: StringValidation.required
    .min(1, "State name is required")
    .max(100, "State name must be 100 characters or less")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "State name contains invalid characters"),
  postalCode: StringValidation.required.regex(
    /^[a-zA-Z0-9\s\-]{3,10}$/,
    "Must be a valid postal code"
  ),
  country: StringValidation.required
    .min(2, "Country code must be at least 2 characters")
    .max(100, "Country name must be 100 characters or less")
})
```

#### Enhanced Weather Schemas (`/workspace/backend/app/schemas/weather.ts`)

```typescript
// Enhanced Weather Schema with cross-field validation
export const WeatherSchema = z
  .object({
    date: DateValidation.isoString,
    degreesFahrenheit: NumberValidation.temperatureF,
    temperatureRange: TemperatureRangeSchema,
    temperatureRangeCategory: TemperatureRangeCategorySchema,
    rainProbabilityPercentage: NumberValidation.percentage,
    windSpeedMph: NumberValidation.windSpeedMph,
    condition: OpenMeteoWeatherCodeSchema,
    clothing: z
      .array(z.nativeEnum(ClothingCategoryEnum))
      .min(1, "At least one clothing recommendation is required")
      .max(10, "Cannot have more than 10 clothing recommendations")
  })
  .refine((weather) => {
    const tempRange = weather.temperatureRange
    return (
      weather.degreesFahrenheit >= tempRange.temperatureMinimum &&
      weather.degreesFahrenheit <= tempRange.temperatureMaximum
    )
  }, "Current temperature must be within the temperature range")
```

### 2. Validation Middleware (`/workspace/backend/app/middleware/validation.ts`)

#### Request Validation Middleware

```typescript
export function validateBody<T>(schema: ZodSchema<T>) {
  return createValidationMiddleware({ schema, source: "body" })
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return createValidationMiddleware({ schema, source: "query" })
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return createValidationMiddleware({ schema, source: "params" })
}

export function validateHeaders<T>(schema: ZodSchema<T>) {
  return createValidationMiddleware({ schema, source: "header" })
}
```

#### Multi-Source Validation

```typescript
export function validateMultiple(schemas: {
  body?: ZodSchema
  query?: ZodSchema
  params?: ZodSchema
  headers?: ZodSchema
}) {
  // Validates multiple request sources simultaneously
}
```

#### Security Validation

```typescript
export function validateRateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  // Rate limiting with validation
}

export function validateContentType(allowedTypes: string[] = ["application/json"]) {
  // Content-Type validation
}

export function validateRequestSize(maxSizeBytes: number = 1024 * 1024) {
  // Request size validation
}
```

### 3. API Endpoint Validation

#### Enhanced Router Procedures (`/workspace/backend/app/router/places.ts`)

```typescript
export const places = router({
  create: procedure.input(CreatePlaceSchema).mutation(async ({ ctx, input }) => {
    try {
      // Validate input with enhanced validation
      const validatedInput = validateInput(CreatePlaceSchema, input)

      // Process validated input...
    } catch (error) {
      // Enhanced error handling
    }
  }),

  getBySlug: procedure.input(GetPlaceBySlugSchema).query(async ({ ctx, input }) => {
    try {
      // Validate input with enhanced validation
      const validatedInput = validateInput(GetPlaceBySlugSchema, input)

      // Process validated input...
    } catch (error) {
      // Enhanced error handling
    }
  })
})
```

### 4. Frontend Validation System

#### Frontend Validation Schemas (`/workspace/frontend/app/schemas/validation.ts`)

```typescript
// Search input validation
export const SearchInputSchema = z.object({
  query: StringValidation.required
    .min(1, "Please enter a location to search")
    .max(200, "Search query must be 200 characters or less")
    .transform((query) => query.trim())
    .refine((query) => query.length > 0, "Search query cannot be empty")
    .refine((query) => !/^[0-9\s\-_]+$/.test(query), "Search query must contain letters")
})

// Form validation schemas
export const FormValidationSchemas = {
  contact: z.object({
    name: StringValidation.required
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be 100 characters or less")
      .regex(/^[a-zA-Z\s\-'\.]+$/, "Name contains invalid characters"),
    email: z.string().email("Must be a valid email address"),
    message: StringValidation.required
      .min(10, "Message must be at least 10 characters")
      .max(1000, "Message must be 1000 characters or less")
  })
}
```

#### React Validation Hooks (`/workspace/frontend/app/hooks/useValidation.ts`)

```typescript
// Single field validation
export function useValidation<T>({
  schema,
  initialValue,
  validateOnChange = false,
  validateOnBlur = true,
  sanitizeInput = true,
  debounceMs = 300
}: UseValidationOptions<T>): UseValidationReturn<T>

// Multi-field form validation
export function useFormValidation<T extends Record<string, unknown>>(
  schemas: { [K in keyof T]: ZodSchema<T[K]> },
  initialValues?: Partial<T>,
  options?: {
    validateOnChange?: boolean
    validateOnBlur?: boolean
    sanitizeInput?: boolean
  }
)

// API response validation
export function useApiValidation<T>(schema: ZodSchema<T>)

// Debounced validation
export function useDebouncedValidation<T>(schema: ZodSchema<T>, delay: number = 300)
```

## 🔧 Validation Features

### 1. Input Sanitization

```typescript
export function sanitizeInput<T>(data: T): T {
  if (typeof data === "string") {
    return data
      .replace(/[<>\"'&]/g, (match) => {
        const entities: Record<string, string> = {
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
          "&": "&amp;"
        }
        return entities[match]
      })
      .trim() as T
  }
  // Handle arrays and objects...
}
```

### 2. Error Handling

```typescript
export function validateInput<T>(schema: ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code
      }))

      throw new Error(`Validation failed: ${JSON.stringify(errorMessages)}`)
    }
    throw error
  }
}
```

### 3. Cross-Field Validation

```typescript
// Temperature range validation
export const TemperatureRangeSchema = z
  .object({
    temperatureMinimum: NumberValidation.temperatureF,
    temperatureMaximum: NumberValidation.temperatureF
  })
  .refine(
    (range) => range.temperatureMinimum <= range.temperatureMaximum,
    "Minimum temperature must be less than or equal to maximum temperature"
  )

// Weather data validation
export const WeatherSchema = z
  .object({
    degreesFahrenheit: NumberValidation.temperatureF,
    temperatureRange: TemperatureRangeSchema
  })
  .refine((weather) => {
    const tempRange = weather.temperatureRange
    return (
      weather.degreesFahrenheit >= tempRange.temperatureMinimum &&
      weather.degreesFahrenheit <= tempRange.temperatureMaximum
    )
  }, "Current temperature must be within the temperature range")
```

### 4. Array Validation

```typescript
// Weather data arrays with length validation
export const OpenMeteoDailySchema = z
  .object({
    time: z
      .array(DateValidation.isoString)
      .min(1, "Time array cannot be empty")
      .max(14, "Cannot request more than 14 days"),
    temperature_2m_max: z
      .array(NumberValidation.temperatureF)
      .min(1, "Temperature max array cannot be empty")
      .max(14, "Cannot request more than 14 days")
  })
  .refine((data) => {
    const arrayLengths = [
      data.time.length,
      data.temperature_2m_max.length
      // ... other arrays
    ]
    return arrayLengths.every((length) => length === arrayLengths[0])
  }, "All weather data arrays must have the same length")
```

## 📊 Validation Coverage

### Backend Validation

| Component           | Validation Level | Schema Coverage            |
| ------------------- | ---------------- | -------------------------- |
| **API Endpoints**   | ✅ Complete      | All input/output schemas   |
| **Service Methods** | ✅ Complete      | Input parameter validation |
| **Data Models**     | ✅ Complete      | Full schema validation     |
| **Error Responses** | ✅ Complete      | Sanitized error messages   |
| **Rate Limiting**   | ✅ Complete      | Request validation         |
| **File Uploads**    | ✅ Complete      | File type/size validation  |

### Frontend Validation

| Component          | Validation Level | Schema Coverage            |
| ------------------ | ---------------- | -------------------------- |
| **Form Inputs**    | ✅ Complete      | Real-time validation       |
| **Search Queries** | ✅ Complete      | Input sanitization         |
| **API Responses**  | ✅ Complete      | Response validation        |
| **URL Parameters** | ✅ Complete      | Route parameter validation |
| **User Inputs**    | ✅ Complete      | XSS prevention             |

## 🚀 Usage Examples

### 1. Backend API Validation

```typescript
// Create place with validation
const createPlaceSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description too long")
    .transform((desc) => desc.trim())
})

app.post("/api/places", validateBody(createPlaceSchema), async (c) => {
  const validatedData = getValidatedData(c)
  // Process validated data...
})
```

### 2. Frontend Form Validation

```typescript
// React form with validation
function SearchForm() {
  const { value, errors, isValid, handleChange, validate } = useValidation({
    schema: SearchInputSchema,
    validateOnBlur: true
  })

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value.query}
        onChange={(e) => handleChange({ query: e.target.value })}
        onBlur={validate}
      />
      {errors.map(error => (
        <div key={error.field} className="error">
          {error.message}
        </div>
      ))}
    </form>
  )
}
```

### 3. Service Method Validation

```typescript
// Service method with input validation
class WeatherService {
  static async get7DayForecast(coords: { latitude: number; longitude: number }) {
    // Validate coordinates
    const validatedCoords = validateInput(CoordinatesSchema, coords)

    // Process validated coordinates...
  }
}
```

## 🔒 Security Features

### 1. XSS Prevention

```typescript
// Automatic input sanitization
const sanitizedInput = sanitizeInput(userInput)
```

### 2. SQL Injection Prevention

```typescript
// Parameterized queries with validated inputs
const validatedId = validateInput(z.string().uuid(), requestId)
const result = await db.query("SELECT * FROM places WHERE id = ?", [validatedId])
```

### 3. Rate Limiting

```typescript
// Rate limiting with validation
app.use(validateRateLimit(100, 60000)) // 100 requests per minute
```

### 4. Input Size Limits

```typescript
// Request size validation
app.use(validateRequestSize(1024 * 1024)) // 1MB limit
```

## 📈 Performance Considerations

### 1. Validation Caching

```typescript
// Cache validation results for repeated inputs
const validationCache = new Map<string, ValidationResult>()
```

### 2. Lazy Validation

```typescript
// Validate only when needed
const lazyValidation = useDebouncedValidation(schema, 300)
```

### 3. Selective Validation

```typescript
// Validate only changed fields
const partialValidation = validatePartial(formData, changedFields)
```

## 🧪 Testing Validation

### 1. Unit Tests

```typescript
describe("Input Validation", () => {
  test("validates place description", () => {
    const validInput = { description: "New York City" }
    const result = validateInput(CreatePlaceSchema, validInput)
    expect(result.success).toBe(true)
  })

  test("rejects invalid place description", () => {
    const invalidInput = { description: "" }
    const result = validateInput(CreatePlaceSchema, invalidInput)
    expect(result.success).toBe(false)
    expect(result.errors).toContainEqual({
      field: "description",
      message: "Place description cannot be empty"
    })
  })
})
```

### 2. Integration Tests

```typescript
describe("API Validation", () => {
  test("validates request body", async () => {
    const response = await request(app)
      .post("/api/places")
      .send({ description: "Invalid input" })
      .expect(400)

    expect(response.body.error).toBe("Validation Failed")
  })
})
```

## 🎯 Best Practices

### 1. Schema Design

- **Be Specific**: Use specific validation rules for each field
- **Provide Context**: Include helpful error messages
- **Use Transformations**: Clean and normalize data during validation
- **Cross-Field Validation**: Validate relationships between fields

### 2. Error Handling

- **Sanitize Errors**: Never expose sensitive information in error messages
- **Provide Context**: Include field names and validation rules in errors
- **Graceful Degradation**: Handle validation failures gracefully
- **Log Validation Failures**: Monitor validation errors for security

### 3. Performance

- **Validate Early**: Validate inputs as soon as they're received
- **Cache Results**: Cache validation results for repeated inputs
- **Use Debouncing**: Debounce validation for real-time feedback
- **Selective Validation**: Only validate changed fields

### 4. Security

- **Sanitize Inputs**: Always sanitize user inputs
- **Validate File Uploads**: Strict validation for file uploads
- **Rate Limiting**: Implement rate limiting with validation
- **Size Limits**: Enforce size limits on all inputs

## 🔗 Related Files

- `/workspace/backend/app/schemas/validation.ts` - Core validation utilities
- `/workspace/backend/app/schemas/place.ts` - Place-specific schemas
- `/workspace/backend/app/schemas/weather.ts` - Weather-specific schemas
- `/workspace/backend/app/middleware/validation.ts` - Validation middleware
- `/workspace/backend/app/router/places.ts` - API endpoint validation
- `/workspace/frontend/app/schemas/validation.ts` - Frontend validation
- `/workspace/frontend/app/hooks/useValidation.ts` - React validation hooks
