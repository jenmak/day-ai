import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useLocationStore } from "../stores/locationStore";
import { ProfileIcon } from "./ProfileIcon";

export function Header() {
  const navigate = useNavigate()
  const { pathname} = useLocation()
  const { location } = useLocationStore()
  return (
    <div className="flex justify-between items-center p-4">
      {pathname !== "/" && (
        <Button onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
      )}

      {location && (
        <div className="flex flex-col text-center">
          <h3>{location.normalizedLocation}</h3>
          <p>{location.description}</p>
        </div>
      )}

      <ProfileIcon />
    </div>
  )
}