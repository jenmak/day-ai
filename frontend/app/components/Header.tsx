
import { useLocation } from "react-router";
import { SearchInput } from "./SearchInput";
import { useCreatePlace } from "../hooks/useCreatePlace";

export function Header() {
  const { pathname} = useLocation()
  const { createPlace } = useCreatePlace()
  return (
    <div className="flex justify-center p-4 fixed top-0 left-0 right-0 z-10">
      {pathname !== '/' && (
        <SearchInput  onSearch={createPlace} />
      )}
    </div>
  )
}