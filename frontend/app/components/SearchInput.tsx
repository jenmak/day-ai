import { Input } from "../../src/components/ui/input"
import { Button } from "../../src/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useState } from "react"

type SearchInputProps = {
  onSearch: (searchTerm: string) => void
  isLoading: boolean
}

export function SearchInput({ onSearch, isLoading }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("")
  
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
    <div className="input-container">
      <Input
        className="search-input focus-visible:ring-0"
        placeholder="ie. Gotham"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Button 
        onClick={handleSearch} 
        disabled={isLoading || !searchTerm.trim()} 
        className="search-button"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  )
}