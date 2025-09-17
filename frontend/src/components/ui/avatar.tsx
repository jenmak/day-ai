import * as React from "react"
import { cn } from "@/lib/utils"
import { Image } from "./image"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: "sm" | "md" | "lg" | "xl"
  shape?: "circle" | "square"
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "Avatar", fallback, size = "md", shape = "circle", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8",
      md: "h-10 w-10", 
      lg: "h-12 w-12",
      xl: "h-16 w-16"
    }

    const shapeClasses = {
      circle: "rounded-full",
      square: "rounded-md"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden",
          sizeClasses[size],
          shapeClasses[shape],
          className
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fallback={fallback}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <span className="text-sm font-medium">
              {alt.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar }
