import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { useForm, useFormState } from "react-hook-form"
import { useValidation } from "../hooks/useValidation"
import { SearchInputSchema } from "../schemas/validation"
import { usePlaceStore } from "../stores/placeStore"
import { ReactCSSProperties } from "../types/CustomProperties"
import { Button } from "./shadcn/button"
import { Input } from "./shadcn/input"

type SearchInputProps = {
  onSearch: (searchTerm: string) => void
  error?: Error | null
  placeholder?: string
  className?: string
  ringBackgroundColor?: string
  ringColor?: string
  backgroundColor?: string
  placeholderColor?: string
  textColor?: string
  isLoading?: boolean
  showValidationErrors?: boolean
}

export function SearchInput({
  onSearch,
  error,
  className,
  isLoading,
  placeholder = "ie. Gotham",
  backgroundColor,
  placeholderColor = "white",
  textColor = "white",
  ringBackgroundColor = "black",
  ringColor = "white",
  showValidationErrors = true
}: SearchInputProps) {
  // Hooks.
  const { handleSubmit, control } = useForm()
  const { isSubmitting } = useFormState({ control })
  const { clearError } = usePlaceStore()

  // Validation hook.
  const { errors, isValid, isTouched, setValue, validate, handleChange, handleBlur } =
    useValidation({
      schema: SearchInputSchema,
      initialValue: { query: "" },
      validateOnChange: false,
      validateOnBlur: true
    })

  // Local state.
  const [searchTerm, setSearchTerm] = useState("")

  // Handlers.
  const handleSearch = () => {
    const validationResult = validate()
    if (validationResult.success && searchTerm.trim()) {
      clearError()
      onSearch(searchTerm.trim())
      setValue({ query: "" })
      setSearchTerm("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    handleChange({ query: value })
  }

  return (
    <form onSubmit={handleSubmit(handleSearch)}>
      <div
        className={`input-container ${isLoading || isSubmitting ? "input-container-loading" : ""} ${className}`}
        style={
          {
            "--input-ring-background-color": ringBackgroundColor,
            "--input-background-color": backgroundColor,
            "--input-placeholder-color": placeholderColor,
            "--input-text-color": textColor,
            "--input-ring-color": ringColor
          } as ReactCSSProperties
        }
      >
        <Input
          className="search-input focus-visible:ring-0"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onBlur={handleBlur}
        />
        <Button
          type="submit"
          disabled={isLoading || isSubmitting || !searchTerm.trim() || !isValid}
          className="search-button"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
        <div className="rotating-ring"></div>
      </div>

      {/* Validation Error Display */}
      {showValidationErrors && isTouched && errors.length > 0 && (
        <div className="mt-2 text-sm text-orange-400">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-1">
              <span>{error.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* API Error Display */}
      {error && !isLoading && !isSubmitting && (
        <div className="mt-2 text-sm text-white">
          <div className="flex items-center gap-1">
            <span>{error.message}</span>
          </div>
        </div>
      )}
    </form>
  )
}
