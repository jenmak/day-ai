import { Button } from "../../src/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { ProfileIcon } from "./ProfileIcon";
import { SearchInput } from "./SearchInput";
import { useCreateLocation } from "../hooks/useCreateLocation";

export function Header() {
  const navigate = useNavigate()
  const { pathname} = useLocation()
  const { createLocation, isLoading } = useCreateLocation()
  return (
    <div className="flex justify-between items-center p-4 fixed top-0 left-0 right-0 z-10">
      {pathname !== "/" && (
        <Button onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
      )}

      {pathname !== '/' && (
        <SearchInput onSearch={createLocation} isLoading={isLoading} />
      )}

      <ProfileIcon />

    </div>
  )
}