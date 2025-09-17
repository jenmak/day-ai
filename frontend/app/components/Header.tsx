import { Button } from "../../src/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { SearchInput } from "./SearchInput";
import { useCreatePlace } from "../hooks/useCreatePlace";

export function Header() {
  const navigate = useNavigate()
  const { pathname} = useLocation()
  const { createPlace } = useCreatePlace()
  return (
    <div className="flex justify-between items-center p-4 fixed top-0 left-0 right-0 z-10">
      {pathname !== "/" && (
        <Button className="bg-transparent color-white rounded-full hover:bg-white/30" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
      )}
      {pathname !== '/' && (
        <SearchInput  onSearch={createPlace} />
      )}
      <div className="w-[1px] h-[1px] bg-transparent"></div>
    </div>
  )
}