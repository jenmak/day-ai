import { useParams } from "react-router"
import { useLocationStore } from "../stores/locationStore"
import { useLocationBySlug } from "../hooks/useLocationBySlug"
import { Spinner } from "@/components/ui/spinner"
import { useState } from "react"
import { PageWrapper } from "../components/PageWrapper"

export function Location() {
  const { slug } = useParams()
  const { location, setLocation } = useLocationStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * If the location is not in the store, fetch it by slug.
   */
  if (!location) {
    const { data, isLoading, error } = useLocationBySlug({ slug: slug as string })
    if (data) {
      setLocation(data)
    }
    if (error) {
      setError(error)
    }
    if (isLoading) {
      setIsLoading(isLoading)
    }
  }

  if (isLoading) {
    return (
      <PageWrapper>
        <Spinner />
      </PageWrapper>
    )
  }

  if (error) {
    return (
      <PageWrapper>
        <div>Error: {error.message}</div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <h1>{location.normalizedLocation}</h1>
      <p>{location.description}</p>
      <p>{location.geocodedAddress.latitude}, {location.geocodedAddress.longitude}</p>
      <p>{location.geocodedAddress.structuredAddress.city}, {location.geocodedAddress.structuredAddress.state} {location.geocodedAddress.structuredAddress.postalCode}</p>
      <p>{location.geocodedAddress.structuredAddress.country}</p>
    </PageWrapper>
  )
}