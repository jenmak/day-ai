import React from "react"

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {

  return (
    <div className="flex flex-col gap-4 p-4 justify-center items-center">
      {children}
    </div>
  )
}