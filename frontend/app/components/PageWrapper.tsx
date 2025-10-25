import React from "react"

interface PageWrapperProps {
  children: React.ReactNode
}

/**
 * @description Handles the background colors for the page
 * depending on the temperature range category.
 * range category.
 * @param children - The children to render inside the page wrapper.
 * @returns The page wrapper component.
 */
export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="bg-gray-3 relative h-screen w-full">
      <div className="absolute top-0 left-0 right-0 bottom-0 z-1">{children}</div>
    </div>
  )
}
