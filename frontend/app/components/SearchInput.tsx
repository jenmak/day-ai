import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { useForm, useFormState } from "react-hook-form"
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
}

export function SearchInput({
  onSearch,
  className,
  isLoading,
  placeholder = "ie. Gotham",
  backgroundColor,
  placeholderColor = "white",
  textColor = "white",
  ringBackgroundColor = "black",
  ringColor = "white"
}: SearchInputProps) {
  // Hooks.
  const { handleSubmit, control } = useForm()
  const { isSubmitting } = useFormState({ control })

  // Local state.
  const [searchTerm, setSearchTerm] = useState("")

  // Handlers.
  const handleSearch = () => {
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim())
      setSearchTerm("") // Clear input after search
    }
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
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
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button
          type="submit"
          disabled={isLoading || isSubmitting || !searchTerm.trim()}
          className="search-button"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
        <div className="rotating-ring"></div>
      </div>
    </form>
  )
}
