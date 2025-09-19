import { Input } from "./shadcn/input"
import { Button } from "./shadcn/button"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { useForm, useFormState } from "react-hook-form"

type SearchInputProps = {
  onSearch: (searchTerm: string) => void
  error?: Error | null
  className?: string
  backgroundColor?: string
}

export function SearchInput({ onSearch, className, backgroundColor }: SearchInputProps) {
  // Hooks.
  const { handleSubmit, control } = useForm()
  const { isSubmitting } = useFormState({ control })
  const [isLoading, setIsLoading] = useState(false)

  // Local state.
  const [searchTerm, setSearchTerm] = useState("")

  // Handlers.
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsLoading(true)
      onSearch(searchTerm.trim())
    }
  }
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }


  return (
    <form onSubmit={handleSubmit(handleSearch)}>
      <div className={`input-container ${isLoading || isSubmitting ? "input-container-loading" : ""} ${className}`}>
        <Input
          className={`search-input focus-visible:ring-0 ${backgroundColor ? `bg-[${backgroundColor}]` : "bg-transparent"}`}
          placeholder="ie. Gotham"
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