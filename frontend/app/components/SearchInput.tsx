import { Input } from "../../src/components/ui/input"
import { Button } from "../../src/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { useForm, useFormState } from "react-hook-form"

type SearchInputProps = {
  onSearch: (searchTerm: string) => void
  isLoading?: boolean
  error?: Error | null
}

export function SearchInput({ onSearch, isLoading, error }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { handleSubmit, control } = useForm()
  const { isSubmitting } = useFormState({ control})
  
  const handleSearch = () => {
    if (searchTerm.trim()) {
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
      <div className={`input-container min-w-[350px] ${(isLoading || isSubmitting) && 'input-container-loading'}`}>
        <Input
          className="search-input focus-visible:ring-0"
          placeholder="ie. Gotham"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button 
          type="submit"
          disabled={(isLoading || isSubmitting) || !searchTerm.trim()} 
          className="search-button"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      {error && (
        <div className="text-[var(--color-destructive)] text-sm text-center">
          {error.message || "Failed to find location. Try again."}
        </div>
      )}
    </form> 
  )
}