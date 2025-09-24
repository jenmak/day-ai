import { useCallback, useMemo, useState } from "react"
import { ZodSchema } from "zod"
import { sanitizeInput, validateInput } from "../schemas/validation"

/**
 * Validation hook for React forms and inputs
 */

interface ValidationResult<T> {
  success: boolean
  data?: T
  errors?: Array<{
    field: string
    message: string
    code: string
  }>
}

interface ValidationState<T> {
  value: T
  errors: Array<{
    field: string
    message: string
    code: string
  }>
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
}

interface UseValidationOptions<T> {
  schema: ZodSchema<T>
  initialValue?: T
  validateOnChange?: boolean
  validateOnBlur?: boolean
  sanitizeInput?: boolean
  debounceMs?: number
}

interface UseValidationReturn<T> {
  value: T
  errors: Array<{ field: string; message: string; code: string }>
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
  setValue: (value: T) => void
  setErrors: (errors: Array<{ field: string; message: string; code: string }>) => void
  validate: () => ValidationResult<T>
  reset: () => void
  handleChange: (value: T) => void
  handleBlur: () => void
}

/**
 * Hook for validating form inputs with Zod schemas
 */
export function useValidation<T>({
  schema,
  initialValue,
  validateOnChange = false,
  validateOnBlur = true,
  sanitizeInput: shouldSanitize = true,
  debounceMs = 300
}: UseValidationOptions<T>): UseValidationReturn<T> {
  const [state, setState] = useState<ValidationState<T>>({
    value: initialValue as T,
    errors: [],
    isValid: true,
    isDirty: false,
    isTouched: false
  })

  // Debounced validation function
  const debouncedValidate = useMemo(() => {
    let timeoutId: NodeJS.Timeout

    return (value: T) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        validateValue(value)
      }, debounceMs)
    }
  }, [debounceMs])

  /**
   * Validate the current value
   */
  const validateValue = useCallback(
    (value: T) => {
      const sanitizedValue = shouldSanitize ? sanitizeInput(value) : value
      const result = validateInput(schema, sanitizedValue)

      setState((prev) => ({
        ...prev,
        errors: result.errors || [],
        isValid: result.success,
        value: result.success ? (result.data as T) : prev.value
      }))

      return result
    },
    [schema, shouldSanitize]
  )

  /**
   * Set the value and optionally validate
   */
  const setValue = useCallback(
    (newValue: T) => {
      setState((prev) => ({
        ...prev,
        value: newValue,
        isDirty: true
      }))

      if (validateOnChange) {
        debouncedValidate(newValue)
      }
    },
    [validateOnChange, debouncedValidate]
  )

  /**
   * Set errors manually
   */
  const setErrors = useCallback(
    (errors: Array<{ field: string; message: string; code: string }>) => {
      setState((prev) => ({
        ...prev,
        errors,
        isValid: errors.length === 0
      }))
    },
    []
  )

  /**
   * Validate the current value
   */
  const validate = useCallback(() => {
    const result = validateValue(state.value)
    return result
  }, [validateValue, state.value])

  /**
   * Reset the validation state
   */
  const reset = useCallback(() => {
    setState({
      value: initialValue as T,
      errors: [],
      isValid: true,
      isDirty: false,
      isTouched: false
    })
  }, [initialValue])

  /**
   * Handle input change
   */
  const handleChange = useCallback(
    (newValue: T) => {
      setValue(newValue)
    },
    [setValue]
  )

  /**
   * Handle input blur
   */
  const handleBlur = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isTouched: true
    }))

    if (validateOnBlur) {
      validateValue(state.value)
    }
  }, [validateOnBlur, validateValue, state.value])

  return {
    value: state.value,
    errors: state.errors,
    isValid: state.isValid,
    isDirty: state.isDirty,
    isTouched: state.isTouched,
    setValue,
    setErrors,
    validate,
    reset,
    handleChange,
    handleBlur
  }
}

/**
 * Hook for validating multiple form fields
 */
export function useFormValidation<T extends Record<string, unknown>>(
  schemas: { [K in keyof T]: ZodSchema<T[K]> },
  initialValues?: Partial<T>,
  options?: {
    validateOnChange?: boolean
    validateOnBlur?: boolean
    sanitizeInput?: boolean
  }
) {
  const [values, setValues] = useState<Partial<T>>(initialValues || {})
  const [errors, setErrors] = useState<
    Partial<Record<keyof T, Array<{ field: string; message: string; code: string }>>>
  >({})
  const [isDirty, setIsDirty] = useState(false)
  const [isTouched, setIsTouched] = useState<Partial<Record<keyof T, boolean>>>({})

  const validateField = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      const schema = schemas[field]
      if (!schema) return

      const sanitizedValue = options?.sanitizeInput ? sanitizeInput(value) : value
      const result = validateInput(schema, sanitizedValue)

      setErrors((prev) => ({
        ...prev,
        [field]: result.errors || []
      }))

      if (result.success && result.data !== undefined) {
        setValues((prev) => ({
          ...prev,
          [field]: result.data
        }))
      }
    },
    [schemas, options?.sanitizeInput]
  )

  const setFieldValue = useCallback(
    (field: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({
        ...prev,
        [field]: value
      }))
      setIsDirty(true)

      if (options?.validateOnChange) {
        validateField(field, value)
      }
    },
    [options?.validateOnChange, validateField]
  )

  const setFieldTouched = useCallback(
    (field: keyof T) => {
      setIsTouched((prev) => ({
        ...prev,
        [field]: true
      }))

      if (options?.validateOnBlur) {
        validateField(field, values[field] as T[keyof T])
      }
    },
    [options?.validateOnBlur, validateField, values]
  )

  const validateForm = useCallback(() => {
    const allErrors: Partial<
      Record<keyof T, Array<{ field: string; message: string; code: string }>>
    > = {}
    let isValid = true

    for (const field in schemas) {
      const schema = schemas[field]
      const value = values[field]

      if (value !== undefined) {
        const sanitizedValue = options?.sanitizeInput ? sanitizeInput(value) : value
        const result = validateInput(schema, sanitizedValue)

        if (!result.success) {
          allErrors[field] = result.errors
          isValid = false
        }
      }
    }

    setErrors(allErrors)
    return { isValid, errors: allErrors }
  }, [schemas, values, options?.sanitizeInput])

  const resetForm = useCallback(() => {
    setValues(initialValues || {})
    setErrors({})
    setIsDirty(false)
    setIsTouched({})
  }, [initialValues])

  const getFieldErrors = useCallback(
    (field: keyof T) => {
      return errors[field] || []
    },
    [errors]
  )

  const getFieldIsValid = useCallback(
    (field: keyof T) => {
      return !errors[field] || errors[field]?.length === 0
    },
    [errors]
  )

  const getFieldIsTouched = useCallback(
    (field: keyof T) => {
      return isTouched[field] || false
    },
    [isTouched]
  )

  const isFormValid = useMemo(() => {
    return Object.values(errors).every((fieldErrors) => !fieldErrors || fieldErrors.length === 0)
  }, [errors])

  return {
    values,
    errors,
    isDirty,
    isTouched,
    isFormValid,
    setFieldValue,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    getFieldErrors,
    getFieldIsValid,
    getFieldIsTouched
  }
}

/**
 * Hook for validating API responses
 */
export function useApiValidation<T>(schema: ZodSchema<T>) {
  const [validationResult, setValidationResult] = useState<ValidationResult<T> | null>(null)

  const validateResponse = useCallback(
    (data: unknown) => {
      const result = validateInput(schema, data)
      setValidationResult(result)
      return result
    },
    [schema]
  )

  const clearValidation = useCallback(() => {
    setValidationResult(null)
  }, [])

  return {
    validationResult,
    validateResponse,
    clearValidation,
    isValid: validationResult?.success || false,
    errors: validationResult?.errors || [],
    data: validationResult?.data
  }
}

/**
 * Hook for debounced validation
 */
export function useDebouncedValidation<T>(schema: ZodSchema<T>, delay: number = 300) {
  const [value, setValue] = useState<T>()
  const [validationResult, setValidationResult] = useState<ValidationResult<T> | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  const validate = useCallback(
    (inputValue: T) => {
      setValue(inputValue)
      setIsValidating(true)

      const timeoutId = setTimeout(() => {
        const result = validateInput(schema, inputValue)
        setValidationResult(result)
        setIsValidating(false)
      }, delay)

      return () => clearTimeout(timeoutId)
    },
    [schema, delay]
  )

  return {
    value,
    validationResult,
    isValidating,
    validate,
    isValid: validationResult?.success || false,
    errors: validationResult?.errors || [],
    data: validationResult?.data
  }
}
