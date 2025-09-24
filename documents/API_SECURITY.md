# API Key Security Guide

This document outlines the security measures implemented to protect API keys and sensitive data in the DripDropCity application.

## 🔐 Security Overview

### API Key Protection

- **Backend-Only Access**: API keys are only accessible from the backend server
- **No Frontend Exposure**: Frontend code cannot access API keys directly
- **Secure Validation**: API keys are validated with proper format checking
- **Masked Logging**: API keys are masked in all log outputs

### Environment Variable Security

- **Sensitive Data Detection**: Automatic detection of potentially sensitive environment variables
- **Leak Prevention**: Validation to prevent environment variable leaks in logs
- **Error Sanitization**: Error messages are sanitized to remove sensitive data

## 🛡️ Security Implementation

### 1. ApiKeyManager

Located at `/workspace/backend/app/security/apiKeys.ts`

**Features:**

- Singleton pattern for secure key management
- API key validation and format checking
- Masked logging for security
- Fallback handling for missing keys

**Usage:**

```typescript
import { apiKeys } from "../security/apiKeys"

// Check if API key is available
if (apiKeys.isOpenAIAvailable()) {
  const key = apiKeys.getOpenAIKey()
  // Use key securely
}

// Get status with masked keys
const status = apiKeys.getStatus()
console.log(`OpenAI: ${status.openai.masked}`)
```

### 2. Environment Validation

Located at `/workspace/backend/app/security/envValidation.ts`

**Features:**

- Automatic detection of sensitive environment variables
- Safe logging of environment configuration
- Leak detection and prevention
- Error message sanitization

**Sensitive Variables Detected:**

- `OPENAI_API_KEY`
- `OPENCAGE_API_KEY`
- `DATABASE_URL`
- `JWT_SECRET`
- `SESSION_SECRET`
- `ENCRYPTION_KEY`

### 3. Secure Service Integration

**LLM Service** (`/workspace/backend/app/services/llmService.ts`):

```typescript
import { apiKeys, getApiKeyWithFallback } from "../security/apiKeys"

// Secure API key access
if (!apiKeys.isOpenAIAvailable()) {
  console.warn("OpenAI API key not available, falling back to mock implementation")
  return mockResponse
}

const apiKey = getApiKeyWithFallback("openai", "Failed to get OpenAI API key")
```

**Geolocation Service** (`/workspace/backend/app/services/geolocationService.ts`):

```typescript
import { apiKeys, getApiKeyWithFallback } from "../security/apiKeys"

// Secure API key access
if (!apiKeys.isOpenCageAvailable()) {
  console.warn("OpenCage API key not available, falling back to mock implementation")
  return mockResponse
}

const apiKey = getApiKeyWithFallback("opencage", "Failed to get OpenCage API key")
```

## 🔍 Security Features

### API Key Masking

API keys are masked in logs using the format: `sk-1234****1234`

**Example:**

```
🔐 API Key Status:
  OpenAI: ✅ Available (sk-1234****1234)
  OpenCage: ❌ Missing/Invalid (***MASKED***)
```

### Environment Variable Validation

```typescript
// Automatic validation on startup
const envValidation = validateEnvironmentVariables()
if (!envValidation.isValid) {
  console.error("❌ Environment validation failed:")
  envValidation.errors.forEach((error) => console.error(`  - ${error}`))
  process.exit(1)
}
```

### Leak Detection

```typescript
// Check for potential leaks
const envLeaks = checkForEnvLeaks()
if (envLeaks.length > 0) {
  console.error("🚨 Environment variable leaks detected:")
  envLeaks.forEach((leak) => console.error(`  - ${leak}`))
  process.exit(1)
}
```

### Error Sanitization

```typescript
// Sanitize error messages
const sanitizedMessage = sanitizeErrorMessage(err)
return c.json({ error: "Internal Server Error", message: sanitizedMessage })
```

## 🚫 Security Restrictions

### Frontend Restrictions

- **No API Key Access**: Frontend cannot access `process.env.OPENAI_API_KEY` or `process.env.OPENCAGE_API_KEY`
- **Configuration Only**: Frontend only receives safe configuration values
- **No Direct API Calls**: All API calls go through the backend

### Backend Restrictions

- **No Direct Access**: Services cannot access `process.env.API_KEY` directly
- **Secure Manager Only**: All API key access must go through `ApiKeyManager`
- **Validation Required**: API keys are validated before use

## 🔧 Configuration

### Environment Variables

```bash
# Required for production
OPENAI_API_KEY=sk-1234567890abcdef1234567890abcdef1234567890abcdef
OPENCAGE_API_KEY=1234567890abcdef1234567890abcdef

# Optional
NODE_ENV=production
PORT=3333
```

### API Key Format Validation

- **OpenAI**: Must start with `sk-` and be 51 characters long
- **OpenCage**: Must be at least 32 characters and alphanumeric

## 🧪 Testing Security

### API Key Validation Test

```typescript
// Test API key availability
const status = apiKeys.getStatus()
console.log("OpenAI Available:", status.openai.available)
console.log("OpenCage Available:", status.opencage.available)
```

### Environment Leak Test

```typescript
// Test for environment variable leaks
const leaks = checkForEnvLeaks()
if (leaks.length > 0) {
  console.error("Leaks detected:", leaks)
}
```

### Error Sanitization Test

```typescript
// Test error message sanitization
const error = new Error("API call failed with key: sk-1234567890abcdef")
const sanitized = sanitizeErrorMessage(error)
console.log("Sanitized:", sanitized) // Should not contain the actual key
```

## 🚨 Security Best Practices

### Development

1. **Never commit API keys** to version control
2. **Use .env files** for local development
3. **Test with mock data** when API keys are unavailable
4. **Validate environment** on every startup

### Production

1. **Use secure environment variables** (not .env files)
2. **Enable all security validations**
3. **Monitor logs** for potential leaks
4. **Rotate API keys** regularly

### Code Review

1. **Check for direct `process.env` access** in frontend code
2. **Verify API key masking** in log statements
3. **Ensure error sanitization** in error handlers
4. **Validate security imports** in services

## 🔄 Migration from Insecure Code

### Before (❌ Insecure):

```typescript
// Direct access to environment variables
const apiKey = process.env.OPENAI_API_KEY
console.log("API Key:", apiKey) // EXPOSES KEY!

// Frontend access to API keys
const openaiKey = process.env.OPENAI_API_KEY // SECURITY RISK!
```

### After (✅ Secure):

```typescript
// Secure access through ApiKeyManager
const apiKey = getApiKeyWithFallback("openai", "Failed to get OpenAI API key")
console.log("API Key Status:", apiKeys.getStatus().openai.masked) // MASKED!

// No frontend access to API keys
// API keys are backend-only
```

## 📊 Security Monitoring

### Startup Validation

The application performs comprehensive security validation on startup:

1. **API Key Validation**: Checks format and availability
2. **Environment Validation**: Ensures required variables are present
3. **Leak Detection**: Scans for potential environment variable leaks
4. **Configuration Logging**: Safely logs configuration with masked sensitive data

### Runtime Monitoring

- **Error Sanitization**: All error messages are sanitized
- **Log Masking**: Sensitive data is masked in all logs
- **Fallback Handling**: Graceful degradation when API keys are unavailable

## 🎯 Security Checklist

- [ ] API keys are not accessible from frontend
- [ ] All API key access goes through ApiKeyManager
- [ ] Environment variables are validated on startup
- [ ] Error messages are sanitized
- [ ] Logs mask sensitive data
- [ ] No direct `process.env` access in services
- [ ] Fallback mechanisms work without API keys
- [ ] Security validation runs on every startup

## 🔗 Related Files

- `/workspace/backend/app/security/apiKeys.ts` - API key management
- `/workspace/backend/app/security/envValidation.ts` - Environment validation
- `/workspace/backend/app/services/llmService.ts` - Secure LLM integration
- `/workspace/backend/app/services/geolocationService.ts` - Secure geocoding integration
- `/workspace/backend/src/index.ts` - Security initialization
